import { STEP_TICKS } from '@sequencer/timing';
import { getNoteName } from '@sequencer/pitch';
import type { NoteClip } from '@sequencer/types';

export interface ExpandedPatternEvent {
  id: string;
  note: string;
  startTick: number;
  durationTicks: number;
}

export const getPatternLengthTicks = (clip: NoteClip): number =>
  clip.pattern.reduce((totalTicks, [, stepCount]) => totalTicks + stepCount * STEP_TICKS, 0);

export const expandClipPattern = (clip: NoteClip): ExpandedPatternEvent[] => {
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
