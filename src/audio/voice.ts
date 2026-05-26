import * as Tone from 'tone';

import { expandClipPattern, getNoteFrequency, PPQ, type ExpandedPatternEvent } from '../sequencer';
import { getState, subscribe, SYNTH_MIXER_CHANNEL_ID } from '../state/store';
import { createMasterOutput, type MasterOutput } from './graph/master';
import { createVoiceInstance, type VoiceInstance } from './graph/voice';
import { createMeteredMixerChannel, type MeteredMixerChannel } from './mixer';

type Cleanup = () => void;

let initialized = false;
let cleanups: Cleanup[] = [];
let voiceInstance: VoiceInstance | null = null;
let masterOutput: MasterOutput | null = null;
let mixerChannel: MeteredMixerChannel | null = null;

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
    const channel = state.mixer.channels[SYNTH_MIXER_CHANNEL_ID];

    masterOutput = createMasterOutput(1);
    voiceInstance = createVoiceInstance(state.synth);
    mixerChannel = createMeteredMixerChannel(
      SYNTH_MIXER_CHANNEL_ID,
      channel?.volume ?? 1,
      channel?.muted ?? false,
      masterOutput.input,
    );
    voiceInstance.output.connect(mixerChannel.input);
  }

  return voiceInstance;
};

const handleStateChanges = (): void => {
  let lastSynth = JSON.stringify(getState().synth);
  let lastMixerChannel = JSON.stringify(getState().mixer.channels[SYNTH_MIXER_CHANNEL_ID]);

  const unsubscribe = subscribe((next) => {
    if (!voiceInstance || !mixerChannel) {
      return;
    }

    const nextSynth = JSON.stringify(next.synth);
    const nextMixerChannel = JSON.stringify(next.mixer.channels[SYNTH_MIXER_CHANNEL_ID]);

    if (nextSynth !== lastSynth) {
      lastSynth = nextSynth;
      voiceInstance.update(next.synth);
    }

    if (nextMixerChannel !== lastMixerChannel) {
      const channel = next.mixer.channels[SYNTH_MIXER_CHANNEL_ID];

      lastMixerChannel = nextMixerChannel;
      mixerChannel.setGain(channel?.volume ?? 1, channel?.muted ?? false);
    }
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
  mixerChannel = null;
  initialized = false;
};
