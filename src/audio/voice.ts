import * as Tone from 'tone';

import { expandClipPattern, getNoteFrequency, PPQ, type ExpandedPatternEvent } from '../sequencer';
import { getState, subscribe } from '../state/store';
import { createMasterOutput, type MasterOutput } from './graph/master';
import { createVoiceInstance, type VoiceInstance } from './graph/voice';

type Cleanup = () => void;

let initialized = false;
let cleanups: Cleanup[] = [];
let voiceInstance: VoiceInstance | null = null;
let masterOutput: MasterOutput | null = null;

const ticksToSeconds = (ticks: number, bpm: number): number => {
  const beats = ticks / PPQ;
  return beats * (60 / bpm);
};

const findNoteEventsStartingAtTick = (tick: number): ExpandedPatternEvent[] => {
  const state = getState();

  return state.sequencer.tracks
    .filter((track) => track.type === 'notes')
    .flatMap((track) =>
      track.clips.flatMap((clip) => expandClipPattern(clip).filter((event) => event.startTick === tick)),
    );
};

const ensureVoiceInstance = (): VoiceInstance => {
  if (!voiceInstance || !masterOutput) {
    const state = getState();
    masterOutput = createMasterOutput(state.synth.masterVolume);
    voiceInstance = createVoiceInstance(state.synth);
    voiceInstance.output.connect(masterOutput.input);
  }

  return voiceInstance;
};

const handleStateChanges = (): void => {
  let lastSynth = JSON.stringify(getState().synth);

  const unsubscribe = subscribe((next) => {
    if (!voiceInstance || !masterOutput) {
      return;
    }

    const nextSynth = JSON.stringify(next.synth);

    if (nextSynth === lastSynth) {
      return;
    }

    lastSynth = nextSynth;

    voiceInstance.update(next.synth);
    masterOutput.setVolume(next.synth.masterVolume);
  });

  cleanups.push(unsubscribe);
};

export const initializeVoice = (): void => {
  if (initialized) {
    return;
  }

  initialized = true;
  ensureVoiceInstance();
  handleStateChanges();
};

export const triggerPianoNotesAtTick = (tick: number, time: Tone.Unit.Time): void => {
  const voice = ensureVoiceInstance();
  const state = getState();
  const events = findNoteEventsStartingAtTick(tick);

  events.forEach((event) => {
    const frequency = getNoteFrequency(event.note);

    if (frequency === null) {
      return;
    }

    voice.triggerAttackRelease(
      frequency,
      ticksToSeconds(event.durationTicks, state.transport.bpm),
      time,
    );
  });
};

export const disposeVoice = (): void => {
  cleanups.forEach((cleanup) => {
    cleanup();
  });
  cleanups = [];

  voiceInstance?.dispose();
  masterOutput?.dispose();
  voiceInstance = null;
  masterOutput = null;
  initialized = false;
};
