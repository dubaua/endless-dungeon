import * as Tone from 'tone';

import {
  getState,
  setTransportBpm,
  setTransportPlaying,
  setTransportPosition,
  setTransportStep,
  setTransportTimeSignature,
  subscribe,
} from '../state/store';
import { on } from '../events';

const transport = Tone.getTransport();

type Cleanup = () => void;

let initialized = false;
let scheduleId: number | null = null;
let cleanups: Cleanup[] = [];
let barCounter = 0;
let stepWithinBar = 0;

const ensureContextRunning = async (): Promise<void> => {
  let context = Tone.getContext();

  if (context.state !== 'running') {
    await Tone.start();
    context = Tone.getContext();
  }

  if (context.state !== 'running') {
    await context.resume();
  }
};

const updateToneSettingsFromState = (): void => {
  const state = getState();
  transport.bpm.value = state.transport.bpm;
  transport.timeSignature = state.transport.timeSignature;
};

const handleStateChanges = (): void => {
  let lastBpm = getState().transport.bpm;
  let lastSignature = getState().transport.timeSignature;

  const unsubscribe = subscribe((next) => {
    const { bpm, timeSignature } = next.transport;

    if (bpm !== lastBpm) {
      transport.bpm.value = bpm;
      lastBpm = bpm;
    }

    if (timeSignature !== lastSignature) {
      transport.timeSignature = timeSignature;
      lastSignature = timeSignature;
    }
  });

  cleanups.push(unsubscribe);
};

const handleTransportEvents = (): void => {
  const resumeListener = on('audio/resume', () => {
    void ensureContextRunning();
  });

  const stopListener = on('transport/pause', () => {
    stopTransport();
  });

  const startListener = on('transport/play', () => {
    void startTransport();
  });

  const toggleListener = on('transport/toggle', () => {
    if (getState().transport.isPlaying) {
      stopTransport();
    } else {
      void startTransport();
    }
  });

  cleanups.push(resumeListener, stopListener, startListener, toggleListener);
};

const scheduleStepUpdates = (): void => {
  if (scheduleId !== null) {
    transport.clear(scheduleId);
  }

  barCounter = 0;
  stepWithinBar = 0;

  scheduleId = transport.scheduleRepeat(() => {
    const state = getState();
    const [beatsPerBar, beatUnit] = state.transport.timeSignature;
    const sixteenthsPerBeat = Math.max(1, 16 / beatUnit);
    const sixteenthsPerBar = Math.max(1, Math.floor(beatsPerBar * sixteenthsPerBeat));

    const beat = Math.floor(stepWithinBar / sixteenthsPerBeat);
    const sixteenth = Math.floor(stepWithinBar % sixteenthsPerBeat);

    setTransportPosition(barCounter, beat, sixteenth);
    setTransportStep(stepWithinBar);

    stepWithinBar += 1;

    if (stepWithinBar >= sixteenthsPerBar) {
      stepWithinBar = 0;
      barCounter += 1;
    }
  }, '16n');
};

export const initializeTransport = (): void => {
  if (initialized) {
    return;
  }

  initialized = true;

  updateToneSettingsFromState();
  handleStateChanges();
  handleTransportEvents();
  scheduleStepUpdates();
};

export const startTransport = async (): Promise<void> => {
  if (getState().transport.isPlaying) {
    return;
  }

  await ensureContextRunning();

  transport.stop();
  transport.position = '0:0:0';
  transport.start('+0', 0);

  barCounter = 0;
  stepWithinBar = 0;

  setTransportPosition(0, 0, 0);
  setTransportStep(0);
  setTransportPlaying(true);
};

export const stopTransport = (): void => {
  if (!getState().transport.isPlaying) {
    return;
  }

  transport.stop();
  transport.position = '0:0:0';

  barCounter = 0;
  stepWithinBar = 0;

  setTransportPosition(0, 0, 0);
  setTransportStep(0);
  setTransportPlaying(false);
};

export const disposeTransport = (): void => {
  if (scheduleId !== null) {
    transport.clear(scheduleId);
    scheduleId = null;
  }

  cleanups.forEach((cleanup) => cleanup());
  cleanups = [];
  initialized = false;
};

export const setTransportBpmFromUi = (bpm: number): void => {
  const clamped = Number.isFinite(bpm) ? Math.max(20, Math.min(300, bpm)) : 120;
  setTransportBpm(clamped);
};

export const setTransportTimeSignatureFromUi = (numerator: number, denominator: number): void => {
  if (numerator < 1 || denominator < 1) {
    return;
  }

  setTransportTimeSignature([numerator, denominator]);
};

