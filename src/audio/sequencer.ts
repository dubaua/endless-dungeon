import type * as Tone from 'tone';

import { expandClipPattern, PPQ, type ExpandedPatternEvent } from '@sequencer';
import type { DrumClip } from '@sequencer/types';
import { getState } from '@state/store';
import { dispatchNoteOn } from '@audio/synths/registry';
import type { NoteSynthId } from '@audio/synths/types';

const StepsPerBar = 16;

interface ScheduledNoteEvent extends ExpandedPatternEvent {
  synthId: NoteSynthId;
}

const ticksToSeconds = (ticks: number, bpm: number): number => {
  const beats = ticks / PPQ;
  return beats * (60 / bpm);
};

const getDrumClipStepLength = (clips: readonly DrumClip[]): number => {
  const clipEndSteps = clips.map((clip) => clip.startBar * StepsPerBar + clip.pattern.length);

  return Math.max(StepsPerBar, ...clipEndSteps);
};

const findNoteEventsStartingAtTick = (tick: number): ScheduledNoteEvent[] => {
  const state = getState();

  return state.sequencer.noteClips.flatMap((clip) =>
    expandClipPattern(clip)
      .filter((event) => event.startTick === tick)
      .map((event) => ({
        ...event,
        id: `${clip.id}-${event.id}`,
        synthId: clip.synthId,
      })),
  );
};

export const playSequencerTick = (tick: number, time: Tone.Unit.Time): void => {
  const state = getState();
  const events = findNoteEventsStartingAtTick(tick);

  events.forEach((event) => {
    dispatchNoteOn({
      synthId: event.synthId,
      note: event.note,
      durationSeconds: ticksToSeconds(event.durationTicks, state.transport.bpm),
      time,
      velocity: 1,
    });
  });
};

export const playSequencerStep = (step: number, time: Tone.Unit.Time): void => {
  const state = getState();
  const blockStep = step % getDrumClipStepLength(state.sequencer.drumClips);

  state.sequencer.drumClips.forEach((clip) => {
    const startStep = clip.startBar * StepsPerBar;
    const patternIndex = blockStep - startStep;

    if (patternIndex < 0 || patternIndex >= clip.pattern.length) {
      return;
    }

    const intensity = clip.pattern[patternIndex] ?? 0;

    if (intensity > 0) {
      dispatchNoteOn({
        synthId: clip.synthId,
        time,
        velocity: intensity,
      });
    }
  });
};
