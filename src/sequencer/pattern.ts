import { STEP_TICKS } from './timing';
import { getNoteName } from './pitch';
import type { Clip } from './types';

export interface ExpandedPatternEvent {
  id: string;
  note: string;
  startTick: number;
  durationTicks: number;
}

export const getPatternLengthTicks = (clip: Clip): number =>
  clip.pattern.reduce((totalTicks, [, stepCount]) => totalTicks + stepCount * STEP_TICKS, 0);

export const expandClipPattern = (clip: Clip): ExpandedPatternEvent[] => {
  let cursorTick = clip.startTick;

  return clip.pattern.flatMap(([note, stepCount], index) => {
    const stepTicks = stepCount * STEP_TICKS;
    const startTick = cursorTick;
    cursorTick += stepTicks;

    if (!note) {
      return [];
    }

    return [
      {
        id: `${clip.id}-${index}`,
        note: getNoteName(note),
        startTick,
        durationTicks: stepTicks * clip.gatePercent,
      },
    ];
  });
};
