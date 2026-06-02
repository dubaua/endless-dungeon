import { BackbeatFillOrder, KickFillOrder } from './fill-order.const';
import { getPatternSyncopationScore } from './get-pattern-syncopation-score';

export interface KickSnarePatternWeight {
  pattern: string;
  kickCount: number;
  snareCount: number;
  kickDensity: number;
  snareDensity: number;
  density: number;
  beatCount: number;
  kickSyncopationScore: number;
  snareSyncopationScore: number;
  syncopationScore: number;
}

const countPatternBeats = (pattern: readonly string[], beat: string): number => {
  return pattern.filter((step) => step === beat).length;
};

export const weighKickSnarePattern = (pattern: string): KickSnarePatternWeight => {
  const steps = [...pattern];
  const kickCount = countPatternBeats(steps, 'k');
  const snareCount = countPatternBeats(steps, 's');
  const beatCount = kickCount + snareCount;
  const kickSyncopationScore = getPatternSyncopationScore(pattern, 'k', KickFillOrder) / 32; // calculated max
  const snareSyncopationScore = getPatternSyncopationScore(pattern, 's', BackbeatFillOrder) / 24; // calculated max
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
    kickSyncopationScore,
    snareSyncopationScore,
    syncopationScore: (kickSyncopationScore + snareSyncopationScore) / 2,
  };
};
