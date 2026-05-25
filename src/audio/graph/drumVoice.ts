import type { DrumVoiceKey } from '../../sequencer';
import type { DrumVoiceState } from '../../state/store';
import { createClosedHatVoice } from './drums/closedHat';
import { createCrashVoice } from './drums/crash';
import { createKickVoice } from './drums/kick';
import { createOpenHatVoice } from './drums/openHat';
import { createSnareVoice } from './drums/snare';
import type { DrumVoiceInstance } from './drums/shared';

export const createDrumVoiceInstance = (voice: DrumVoiceKey, state: DrumVoiceState): DrumVoiceInstance => {
  if (voice === 'kick') {
    return createKickVoice(state);
  }

  if (voice === 'snare') {
    return createSnareVoice(state);
  }

  if (voice === 'closedHat') {
    return createClosedHatVoice(state);
  }

  if (voice === 'openHat') {
    return createOpenHatVoice(state);
  }

  return createCrashVoice(state);
};

export type { DrumVoiceInstance } from './drums/shared';
