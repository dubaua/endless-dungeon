import type {
  ClapVoicing,
  ClosedHatVoicing,
  CrashVoicing,
  DrumSynthId,
  DrumVoicing,
  KickVoicing,
  OpenHatVoicing,
  RideVoicing,
  SnareVoicing,
} from '@audio/synths/types';
import { createClapVoice } from '@audio/graph/drums/clap';
import { createClosedHatVoice } from '@audio/graph/drums/closedHat';
import { createCrashVoice } from '@audio/graph/drums/crash';
import { createKickVoice } from '@audio/graph/drums/kick';
import { createOpenHatVoice } from '@audio/graph/drums/openHat';
import { createRideVoice } from '@audio/graph/drums/ride';
import { createSnareVoice } from '@audio/graph/drums/snare';
import type { DrumVoiceRuntimeInstance } from '@audio/graph/drums/shared';

export const createDrumVoiceInstance = (
  synthId: DrumSynthId,
  voicing: DrumVoicing,
  bpm: number,
): DrumVoiceRuntimeInstance => {
  if (synthId === 'kickPrimary' || synthId === 'kickSecondary') {
    return createKickVoice(voicing as KickVoicing, bpm) as DrumVoiceRuntimeInstance;
  }

  if (synthId === 'snarePrimary' || synthId === 'snareSecondary') {
    return createSnareVoice(voicing as SnareVoicing, bpm) as DrumVoiceRuntimeInstance;
  }

  if (synthId === 'clapPrimary' || synthId === 'clapSecondary') {
    return createClapVoice(voicing as ClapVoicing, bpm) as DrumVoiceRuntimeInstance;
  }

  if (synthId === 'closedHat') {
    return createClosedHatVoice(voicing as ClosedHatVoicing, bpm) as DrumVoiceRuntimeInstance;
  }

  if (synthId === 'openHat') {
    return createOpenHatVoice(voicing as OpenHatVoicing, bpm) as DrumVoiceRuntimeInstance;
  }

  if (synthId === 'crash') {
    return createCrashVoice(voicing as CrashVoicing, bpm) as DrumVoiceRuntimeInstance;
  }

  return createRideVoice(voicing as RideVoicing, bpm) as DrumVoiceRuntimeInstance;
};

export type { DrumVoiceRuntimeInstance } from '@audio/graph/drums/shared';
