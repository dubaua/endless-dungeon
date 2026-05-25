import * as Tone from 'tone';

import { midiNoteToName, PPQ, type Note } from '../sequencer';
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

const findPianoNotesStartingAtTick = (tick: number): Note[] => {
  const state = getState();

  return state.sequencer.tracks
    .filter((track) => track.type === 'pianoRoll')
    .flatMap((track) =>
      track.clips.flatMap((clip) =>
        clip.notes.filter((note) => clip.startTick + note.startTick === tick),
      ),
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
  const unsubscribe = subscribe((next) => {
    if (!voiceInstance || !masterOutput) {
      return;
    }

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
  const notes = findPianoNotesStartingAtTick(tick);

  notes.forEach((note) => {
    voice.triggerAttackRelease(
      midiNoteToName(note.note),
      ticksToSeconds(note.durationTicks, state.transport.bpm),
      time,
      note.velocity,
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
