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

type Cleanup = () => void;

let initialized = false;
let scheduleId: number | null = null;
let cleanups: Cleanup[] = [];
let barCounter = 0;
let stepWithinBar = 0;

const updateToneSettingsFromState = (): void => {
  const state = getState();
  Tone.Transport.bpm.value = state.transport.bpm;
  Tone.Transport.timeSignature = state.transport.timeSignature;
};

const handleStateChanges = (): void => {
  let lastBpm = getState().transport.bpm;
  let lastSignature = getState().transport.timeSignature;

  const unsubscribe = subscribe((next) => {
    const { bpm, timeSignature } = next.transport;

    if (bpm !== lastBpm) {
      Tone.Transport.bpm.value = bpm;
      lastBpm = bpm;
    }

    if (timeSignature !== lastSignature) {
      Tone.Transport.timeSignature = timeSignature;
      lastSignature = timeSignature;
    }
  });

  cleanups.push(unsubscribe);
};

const handleTransportEvents = (): void => {
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

  cleanups.push(stopListener, startListener, toggleListener);
};

const scheduleStepUpdates = (): void => {
  if (scheduleId !== null) {
    Tone.Transport.clear(scheduleId);
  }

  barCounter = 0;
  stepWithinBar = 0;

  scheduleId = Tone.Transport.scheduleRepeat(() => {
    const state = getState();
    const [beatsPerBar, beatUnit] = state.transport.timeSignature;
    const sixteenthsPerBeat = Math.max(1, 16 / beatUnit);
    const sixteenthsPerBar = Math.max(1, Math.floor(beatsPerBar * sixteenthsPerBeat));

    if (stepWithinBar >= sixteenthsPerBar) {
      stepWithinBar = 0;
      barCounter += 1;
    }

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

  await Tone.start();
  Tone.Transport.position = '0:0:0';
  Tone.Transport.start();

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

  Tone.Transport.stop();
  Tone.Transport.position = '0:0:0';

  barCounter = 0;
  stepWithinBar = 0;

  setTransportPosition(0, 0, 0);
  setTransportStep(0);
  setTransportPlaying(false);
};

export const disposeTransport = (): void => {
  if (scheduleId !== null) {
    Tone.Transport.clear(scheduleId);
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

