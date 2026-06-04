import type { NoteName } from 'tonal';

import type { VoicingState } from '../../../audio/synths/types';
import { generateClapVoicing } from './generate-clap-voicing';
import { generateClosedHatVoicing } from './generate-closed-hat-voicing';
import { generateCrashVoicing } from './generate-crash-voicing';
import { generateCymbalVoicingSettings } from './generate-cymbal-voicing-settings';
import { generateKickVoicing } from './generate-kick-voicing';
import { generateOpenHatVoicing } from './generate-open-hat-voicing';
import { generateRideVoicing } from './generate-ride-voicing';
import { generateSnareVoicing } from './generate-snare-voicing';

export const generateDrumVoicing = (rootNote: NoteName): VoicingState['drums'] => {
  const cymbalVoicingSettings = generateCymbalVoicingSettings();

  return {
    kick: generateKickVoicing(rootNote),
    snare: generateSnareVoicing(),
    clap: generateClapVoicing(),
    closedHat: generateClosedHatVoicing(cymbalVoicingSettings),
    openHat: generateOpenHatVoicing(cymbalVoicingSettings),
    crash: generateCrashVoicing(cymbalVoicingSettings),
    ride: generateRideVoicing(cymbalVoicingSettings),
  };
};
