import { countPatternBeats } from './count-pattern-beats';
import { getPatternSyncopationScore } from './new-syncope-grade';

export interface KickSnarePatternWeight {
  pattern: string;
  kickCount: number;
  snareCount: number;
  kickDensity: number;
  snareDensity: number;
  density: number;
  beatCount: number;
  syncopationScore: number;
}

export const weighKickSnarePattern = (pattern: string): KickSnarePatternWeight => {
  const steps = [...pattern];
  const kickCount = countPatternBeats(steps, 'k');
  const snareCount = countPatternBeats(steps, 's');
  const beatCount = kickCount + snareCount;
  const syncopationScore = getPatternSyncopationScore(pattern) / 64;
  const kickDensity = kickCount / 5; // calculated max
  const snareDensity = snareCount / 4; // calculated max
  return {
    pattern,
    kickCount,
    snareCount,
    kickDensity,
    snareDensity,
    density: (kickDensity + snareDensity) / 2,
    beatCount,
    syncopationScore,
  };
};
