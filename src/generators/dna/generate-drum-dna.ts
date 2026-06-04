import { KickSnarePatternWeights } from '../drums/kick-snare-patterns';
import { getRandomFloat } from '../../utils/get-random-float';
import { lerp } from '../../utils/lerp';
import { takeRandom } from '../../utils/take-random';
import { HatsPatternWeights } from '../drums/hats-patterns';

export interface DrumDnaSettings {
  density: number;
  syncopation: number;
  bodyDrumPattern: string;
  bodyHatPattern: string;
}

const MinDensity = 0.35;
const MaxDensity = 1;
const InitialSearchSpread = 0.05;
const SearchSpreadStep = 0.05;
const MaxSearchSpread = 1;

const getSyncopationRangeForDensity = (density: number): [number, number] => {
  const midpointDensity = 0.675;

  if (density <= midpointDensity) {
    const phase = (density - MinDensity) / (midpointDensity - MinDensity);

    return [lerp(0, 0.04, phase), lerp(0.1, 0.5, phase)];
  }

  const phase = (density - midpointDensity) / (MaxDensity - midpointDensity);

  return [0.04, lerp(0.5, 1, phase)];
};

const findMatchingKickSnarePatterns = (
  density: number,
  syncopation: number,
  searchSpread: number,
): string[] => {
  const minDensity = Math.max(0, density - searchSpread);
  const maxDensity = Math.min(1, density + searchSpread);
  const minSyncopation = Math.max(0, syncopation - searchSpread);
  const maxSyncopation = Math.min(1, syncopation + searchSpread);

  return [...KickSnarePatternWeights.values()]
    .filter((weight) => {
      return (
        weight.density >= minDensity &&
        weight.density <= maxDensity &&
        weight.syncopationScore >= minSyncopation &&
        weight.syncopationScore <= maxSyncopation
      );
    })
    .map((weight) => weight.pattern);
};

const findMatchingHatsPatterns = (
  density: number,
  syncopation: number,
  searchSpread: number,
): string[] => {
  const minDensity = Math.max(0, density - searchSpread);
  const maxDensity = Math.min(1, density + searchSpread);
  const minSyncopation = Math.max(0, syncopation - searchSpread);
  const maxSyncopation = Math.min(1, syncopation + searchSpread);

  return [...HatsPatternWeights.values()]
    .filter((weight) => {
      return (
        weight.density >= minDensity &&
        weight.density <= maxDensity &&
        weight.syncopationScore >= minSyncopation &&
        weight.syncopationScore <= maxSyncopation
      );
    })
    .map((weight) => weight.pattern);
};

const randomizeDrumDnaCandidate = (): Pick<DrumDnaSettings, 'density' | 'syncopation'> => {
  const density = getRandomFloat(MinDensity, MaxDensity);
  const [minSyncopation, maxSyncopation] = getSyncopationRangeForDensity(density);

  return {
    density,
    syncopation: getRandomFloat(minSyncopation, maxSyncopation),
  };
};

export const generateDrumDnaSettings = (): DrumDnaSettings => {
  const candidate = randomizeDrumDnaCandidate();

  for (
    let searchSpread = InitialSearchSpread;
    searchSpread <= MaxSearchSpread;
    searchSpread += SearchSpreadStep
  ) {
    const matchingPatterns = findMatchingKickSnarePatterns(
      candidate.density,
      candidate.syncopation,
      searchSpread,
    );

    if (matchingPatterns.length > 0) {
      const bodyDrumPattern = takeRandom(matchingPatterns);
      const matchingHatsPatterns = findMatchingHatsPatterns(
        candidate.density,
        candidate.syncopation,
        searchSpread,
      );
      const bodyHatPattern = matchingHatsPatterns.length > 0
        ? takeRandom(matchingHatsPatterns)
        : takeRandom([...HatsPatternWeights.keys()]);

      return {
        ...candidate,
        bodyDrumPattern,
        bodyHatPattern,
      };
    }
  }

  const bodyDrumPattern = takeRandom([...KickSnarePatternWeights.keys()]);
  const bodyHatPattern = takeRandom([...HatsPatternWeights.keys()]);

  return {
    ...candidate,
    bodyDrumPattern,
    bodyHatPattern,
  };
};
