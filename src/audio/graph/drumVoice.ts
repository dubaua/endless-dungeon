import type { DrumChannel } from '../../sequencer';
import { createClosedHatVoice } from './drums/closedHat';
import { createCrashVoice } from './drums/crash';
import { createKickVoice } from './drums/kick';
import { createOpenHatVoice } from './drums/openHat';
import { createRideVoice } from './drums/ride';
import { createSnareVoice } from './drums/snare';
import type { DrumVoiceRuntimeInstance } from './drums/shared';

export const createDrumVoiceInstance = (channel: DrumChannel): DrumVoiceRuntimeInstance => {
  if (channel.voice === 'kick') {
    return createKickVoice(channel.voicing) as DrumVoiceRuntimeInstance;
  }

  if (channel.voice === 'snare') {
    return createSnareVoice(channel.voicing) as DrumVoiceRuntimeInstance;
  }

  if (channel.voice === 'closedHat') {
    return createClosedHatVoice(channel.voicing) as DrumVoiceRuntimeInstance;
  }

  if (channel.voice === 'openHat') {
    return createOpenHatVoice(channel.voicing) as DrumVoiceRuntimeInstance;
  }

  if (channel.voice === 'crash') {
    return createCrashVoice(channel.voicing) as DrumVoiceRuntimeInstance;
  }

  return createRideVoice(channel.voicing) as DrumVoiceRuntimeInstance;
};

export type { DrumVoiceRuntimeInstance } from './drums/shared';
