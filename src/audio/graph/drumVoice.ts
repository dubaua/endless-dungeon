import type {
  ClosedHatVoicing,
  CrashVoicing,
  DrumSynthId,
  DrumVoicing,
  KickVoicing,
  OpenHatVoicing,
  RideVoicing,
  SnareVoicing,
} from '../synths/types';
import { createClosedHatVoice } from './drums/closedHat';
import { createCrashVoice } from './drums/crash';
import { createKickVoice } from './drums/kick';
import { createOpenHatVoice } from './drums/openHat';
import { createRideVoice } from './drums/ride';
import { createSnareVoice } from './drums/snare';
import type { DrumVoiceRuntimeInstance } from './drums/shared';

export const createDrumVoiceInstance = (synthId: DrumSynthId, voicing: DrumVoicing): DrumVoiceRuntimeInstance => {
  if (synthId === 'kick') {
    return createKickVoice(voicing as KickVoicing) as DrumVoiceRuntimeInstance;
  }

  if (synthId === 'snare') {
    return createSnareVoice(voicing as SnareVoicing) as DrumVoiceRuntimeInstance;
  }

  if (synthId === 'closedHat') {
    return createClosedHatVoice(voicing as ClosedHatVoicing) as DrumVoiceRuntimeInstance;
  }

  if (synthId === 'openHat') {
    return createOpenHatVoice(voicing as OpenHatVoicing) as DrumVoiceRuntimeInstance;
  }

  if (synthId === 'crash') {
    return createCrashVoice(voicing as CrashVoicing) as DrumVoiceRuntimeInstance;
  }

  return createRideVoice(voicing as RideVoicing) as DrumVoiceRuntimeInstance;
};

export type { DrumVoiceRuntimeInstance } from './drums/shared';
