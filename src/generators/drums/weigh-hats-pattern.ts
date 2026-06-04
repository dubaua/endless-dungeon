import { countPatternBeats } from './count-pattern-beats';
import { getPatternSyncopationScore } from './new-syncope-grade';

export interface HatPatternWeight {
  pattern: string;
  closedHatCount: number;
  openHatCount: number;

  density: number;
  beatCount: number;
  syncopationScore: number;
}

export const weighHatPattern = (pattern: string): HatPatternWeight => {
  const steps = [...pattern];
  const closedHatCount = countPatternBeats(steps, 'h');
  const openHatCount = countPatternBeats(steps, 'o');
  const beatCount = closedHatCount + openHatCount;
  const syncopationScore = getPatternSyncopationScore(pattern) / 64;

  return {
    pattern,
    closedHatCount,
    openHatCount,
    beatCount,
    density: (closedHatCount + openHatCount) / 16,
    syncopationScore,
  };
};
