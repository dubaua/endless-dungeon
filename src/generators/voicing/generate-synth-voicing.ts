import { getRandomFloat } from '../../utils/get-random-float';
import { getRandomInt } from '../../utils/get-random-int';
import type { NoteSynthVoicing } from '../../audio/synths/types';
import { NoteSynthVoicing as NoteSynthVoicingSettings } from '../../audio/voicing/note-synth-voicing.const';
import { takeRandom } from '../../utils/take-random';

export const generateSynthVoicing = (): NoteSynthVoicing => {
  return {
    oscillatorType: takeRandom(NoteSynthVoicingSettings.oscillatorType),
    attack: NoteSynthVoicingSettings.attack,
    decay: NoteSynthVoicingSettings.decay,
    sustain: getRandomFloat(
      NoteSynthVoicingSettings.sustain.min,
      NoteSynthVoicingSettings.sustain.max,
    ),
    release: getRandomFloat(
      NoteSynthVoicingSettings.release.min,
      NoteSynthVoicingSettings.release.max,
    ),
    filterFrequency: getRandomInt(
      NoteSynthVoicingSettings.filterFrequency.min,
      NoteSynthVoicingSettings.filterFrequency.max,
    ),
    filterResonance: getRandomFloat(
      NoteSynthVoicingSettings.filterResonance.min,
      NoteSynthVoicingSettings.filterResonance.max,
    ),
    bitCrusherBits: getRandomInt(
      NoteSynthVoicingSettings.bitCrusherBits.min,
      NoteSynthVoicingSettings.bitCrusherBits.max,
    ),
    bitCrusherDepth: getRandomFloat(
      NoteSynthVoicingSettings.bitCrusherDepth.min,
      NoteSynthVoicingSettings.bitCrusherDepth.max,
    ),
  };
};
