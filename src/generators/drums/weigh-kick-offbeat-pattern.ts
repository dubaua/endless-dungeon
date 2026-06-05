import { countPatternBeats } from '@generators/drums/count-pattern-beats';
import { getPatternSyncopationScore } from '@generators/drums/new-syncope-grade';

export interface KickOffbeatPatternWeight {
  pattern: string;
  kickCount: number;
  offbeatCount: number;
  primaryOffbeatCount: number;
  secondaryOffbeatCount: number;
  kickDensity: number;
  offbeatDensity: number;
  density: number;
  beatCount: number;
  syncopationScore: number;
}

export const weighKickOffbeatPattern = (pattern: string): KickOffbeatPatternWeight => {
  const steps = [...pattern];
  const kickCount = countPatternBeats(steps, 'k') + countPatternBeats(steps, 'x');
  const primaryOffbeatCount = countPatternBeats(steps, 'O') + countPatternBeats(steps, 'x');
  const secondaryOffbeatCount = countPatternBeats(steps, 'o');
  const offbeatCount = primaryOffbeatCount + secondaryOffbeatCount;
  const beatCount = kickCount + offbeatCount;
  const syncopationScore = getPatternSyncopationScore(pattern) / 76; // calculated max
  const kickDensity = kickCount / 10; // calculated max
  const offbeatDensity = offbeatCount / 8; // calculated max
  return {
    pattern,
    kickCount,
    offbeatCount,
    primaryOffbeatCount,
    secondaryOffbeatCount,
    kickDensity,
    offbeatDensity,
    density: (kickDensity + offbeatDensity) / 2,
    beatCount,
    syncopationScore,
  };
};
