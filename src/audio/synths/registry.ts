import { getNoteFrequency } from '../../sequencer';
import { getState, subscribe } from '../../state/store';
import { createDrumVoiceInstance, type DrumVoiceRuntimeInstance } from '../graph/drumVoice';
import { createVoiceInstance, type VoiceInstance } from '../graph/voice';
import { connectMixerChannelInput, getMixerChannelIdForSynth } from '../mixer';
import type { DrumSynthId, NoteOnEvent, NoteSynthId } from './types';

type Cleanup = () => void;

const DrumSynthIds: readonly DrumSynthId[] = ['kick', 'snare', 'closedHat', 'openHat', 'crash', 'ride'];
const NoteSynthIds: readonly NoteSynthId[] = ['voice', 'bass'];

let initialized = false;
let cleanups: Cleanup[] = [];
let drumSynths = new Map<DrumSynthId, DrumVoiceRuntimeInstance>();
let noteSynths = new Map<NoteSynthId, VoiceInstance>();

const ensureSynths = (): void => {
  if (drumSynths.size > 0 && noteSynths.size > 0) {
    return;
  }

  const state = getState();

  DrumSynthIds.forEach((synthId) => {
    const synth = createDrumVoiceInstance(synthId, state.voicing.drums[synthId]);
    drumSynths.set(synthId, synth);
    connectMixerChannelInput(getMixerChannelIdForSynth(synthId), synth.output);
  });

  NoteSynthIds.forEach((synthId) => {
    const synth = createVoiceInstance(state.voicing[synthId]);
    noteSynths.set(synthId, synth);
    connectMixerChannelInput(getMixerChannelIdForSynth(synthId), synth.output);
  });
};

const handleVoicingChanges = (): void => {
  let lastVoicing = JSON.stringify(getState().voicing);

  const unsubscribe = subscribe((next) => {
    const nextVoicing = JSON.stringify(next.voicing);

    if (nextVoicing === lastVoicing) {
      return;
    }

    lastVoicing = nextVoicing;
    DrumSynthIds.forEach((synthId) => {
      drumSynths.get(synthId)?.update(next.voicing.drums[synthId]);
    });
    NoteSynthIds.forEach((synthId) => {
      noteSynths.get(synthId)?.update(next.voicing[synthId]);
    });
  });

  cleanups.push(unsubscribe);
};

export const initializeSynthRegistry = (): void => {
  if (initialized) {
    return;
  }

  initialized = true;
  ensureSynths();
  handleVoicingChanges();
};

export const dispatchNoteOn = (event: NoteOnEvent): void => {
  ensureSynths();

  if (event.synthId === 'voice' || event.synthId === 'bass') {
    if (!event.note || event.durationSeconds === undefined) {
      return;
    }

    const frequency = getNoteFrequency(event.note);

    if (frequency === null) {
      return;
    }

    noteSynths.get(event.synthId)?.triggerAttackRelease(
      frequency,
      event.durationSeconds,
      event.time,
    );
    return;
  }

  if (event.synthId === 'closedHat' && event.velocity > 0) {
    drumSynths.get('openHat')?.choke?.(event.time);
  }

  drumSynths.get(event.synthId)?.trigger(event.time, event.velocity);
};

export const disposeSynthRegistry = (): void => {
  cleanups.forEach((cleanup) => cleanup());
  cleanups = [];
  noteSynths.forEach((synth) => {
    synth.dispose();
  });
  drumSynths.clear();
  noteSynths.clear();
  initialized = false;
};
