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
import { getRandomFloat } from '../../../utils/get-random-float';
import {
  SecondaryDecayMultiplier,
  SecondaryDepthRange,
} from '../../../audio/voicing/drum-voicing.const';

type SecondaryDrumVoicing = { decay: number; bitCrusherDepth: number };

const mutateSecondaryVoicing = <TVoicing extends SecondaryDrumVoicing>(
  voicing: TVoicing,
): TVoicing => ({
  ...voicing,
  decay: voicing.decay * SecondaryDecayMultiplier,
  bitCrusherDepth:
    voicing.bitCrusherDepth * getRandomFloat(1 - SecondaryDepthRange, 1 + SecondaryDepthRange),
});

export const generateDrumVoicing = (rootNote: NoteName): VoicingState['drums'] => {
  const cymbalVoicingSettings = generateCymbalVoicingSettings();
  const kickPrimary = generateKickVoicing(rootNote);
  const snarePrimary = generateSnareVoicing();
  const clapPrimary = generateClapVoicing();

  return {
    kickPrimary,
    kickSecondary: mutateSecondaryVoicing(kickPrimary),
    snarePrimary,
    snareSecondary: mutateSecondaryVoicing(snarePrimary),
    clapPrimary,
    clapSecondary: mutateSecondaryVoicing(clapPrimary),
    closedHat: generateClosedHatVoicing(cymbalVoicingSettings),
    openHat: generateOpenHatVoicing(cymbalVoicingSettings),
    ride: generateRideVoicing(cymbalVoicingSettings),
    crash: generateCrashVoicing(cymbalVoicingSettings),
  };
};
