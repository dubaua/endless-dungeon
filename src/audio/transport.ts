import * as Tone from 'tone';

import { DEFAULT_CLIP_LENGTH_TICKS, PPQ } from '@sequencer';
import {
  getState,
  setTransportBpm,
  setTransportTick,
  setTransportPlaying,
  setTransportPosition,
  setTransportStep,
  subscribe,
} from '@state/store';
import { on } from '@/events';
import { playSequencerStep, playSequencerTick } from '@audio/sequencer';

// переписать терминал

const transport = Tone.getTransport();
const TICKS_PER_SIXTEENTH = PPQ / 4;

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

  scheduleId = transport.scheduleRepeat((time) => {
    const state = getState();
    const [beatsPerBar, beatUnit] = state.transport.timeSignature;
    const sixteenthsPerBeat = Math.max(1, 16 / beatUnit);
    const sixteenthsPerBar = Math.max(1, Math.floor(beatsPerBar * sixteenthsPerBeat));
    const ticksPerBeat = PPQ * (4 / beatUnit);
    const ticksPerBar = beatsPerBar * ticksPerBeat;
    const currentTick =
      (barCounter * ticksPerBar + stepWithinBar * TICKS_PER_SIXTEENTH) % DEFAULT_CLIP_LENGTH_TICKS;

    const beat = Math.floor(stepWithinBar / sixteenthsPerBeat);
    const sixteenth = Math.floor(stepWithinBar % sixteenthsPerBeat);

    setTransportTick(currentTick);
    setTransportPosition(barCounter, beat, sixteenth);
    setTransportStep(stepWithinBar);
    playSequencerTick(currentTick, time);
    playSequencerStep(barCounter * sixteenthsPerBar + stepWithinBar, time);

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
  setTransportTick(0);
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
  setTransportTick(0);
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
