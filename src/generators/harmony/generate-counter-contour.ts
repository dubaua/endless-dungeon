import type { NoteName } from 'tonal';

import type { Motif, MotifContour, MotifContourBar } from '@generators/motif/motif.type';
import { getModeDegreeIndex } from '@harmony/get-mode-degree';
import type { Mode } from '@harmony/mode.type';
import { getModeDegreeNoteHeight } from '@harmony/utils/get-mode-degree-note-height';
import { getNoteHeight } from '@harmony/utils/get-note-height';
import { getRegisterDistance } from '@harmony/utils/get-register-distance';
import { scale } from '@utils/scale';

type Props = {
  maxNote: string;
  minNote: string;
  mode: Mode;
  motif: MotifContour;
  preferredDegreeOffsets: readonly number[];
  rangeSteps: number;
  rootNote: NoteName;
};

type CounterBarCandidate = {
  offsetIndex: number;
  registerDistance: number;
  steps: number[];
};

const DegreeSearchMin = -96;
const DegreeSearchMax = 48;

const normalizeCounterBar = (steps: readonly number[]): number[] => {
  if (steps.length === 0) {
    return [];
  }

  const invertedSteps = steps.map((degree) => degree * -1);
  const minDegree = Math.min(...invertedSteps);
  const maxDegree = Math.max(...invertedSteps);

  if (minDegree === maxDegree) {
    return invertedSteps.map(() => 0);
  }

  return invertedSteps.map((degree) => scale(degree, minDegree, maxDegree, -1, 1));
};

const placeCounterBar = (
  normalizedSteps: readonly number[],
  firstTargetDegree: number,
  rangeSteps: number,
): number[] => {
  const firstCounterDegree = normalizedSteps[0] ?? 0;
  const rangeAmplitude = rangeSteps / 2;

  return normalizedSteps.map((degree) =>
    Math.round(firstTargetDegree + (degree - firstCounterDegree) * rangeAmplitude),
  );
};

const getDegreesInsideRegister = (
  rootNote: NoteName,
  mode: Mode,
  minNoteHeight: number,
  maxNoteHeight: number,
): number[] => {
  return Array.from(
    { length: DegreeSearchMax - DegreeSearchMin + 1 },
    (_, index) => DegreeSearchMin + index,
  ).filter((degree) => {
    const noteHeight = getModeDegreeNoteHeight(degree, rootNote, mode);

    return noteHeight >= minNoteHeight && noteHeight <= maxNoteHeight;
  });
};

const getBestPlacedCounterBar = (
  normalizedSteps: readonly number[],
  firstTargetDegrees: readonly number[],
  rangeSteps: number,
  rootNote: NoteName,
  mode: Mode,
  minNoteHeight: number,
  maxNoteHeight: number,
): { registerDistance: number; steps: number[] } => {
  const candidates = firstTargetDegrees.map((firstTargetDegree) =>
    placeCounterBar(normalizedSteps, firstTargetDegree, rangeSteps),
  );
  const steps =
    candidates.sort((left, right) => {
      return (
        getRegisterDistance({
          degrees: left,
          rootNote,
          mode,
          minNoteHeight,
          maxNoteHeight,
        }) -
        getRegisterDistance({
          degrees: right,
          rootNote,
          mode,
          minNoteHeight,
          maxNoteHeight,
        })
      );
    })[0] ?? [];

  return {
    registerDistance: getRegisterDistance({
      degrees: steps,
      rootNote,
      mode,
      minNoteHeight,
      maxNoteHeight,
    }),
    steps,
  };
};

const getCounterBarCandidate = (
  normalizedSteps: readonly number[],
  mainFirstDegree: number,
  preferredDegreeOffset: number,
  offsetIndex: number,
  rangeSteps: number,
  degreesInsideRegister: readonly number[],
  minNoteHeight: number,
  maxNoteHeight: number,
  rootNote: NoteName,
  mode: Mode,
): CounterBarCandidate => {
  const preferredFirstDegreeIndex = getModeDegreeIndex(
    mainFirstDegree + preferredDegreeOffset,
    mode,
  );
  const firstDegreeCandidates = degreesInsideRegister.filter((degree) => {
    return getModeDegreeIndex(degree, mode) === preferredFirstDegreeIndex;
  });
  const possibleFirstDegrees =
    firstDegreeCandidates.length > 0 ? firstDegreeCandidates : degreesInsideRegister;
  const placedCounterBar = getBestPlacedCounterBar(
    normalizedSteps,
    possibleFirstDegrees,
    rangeSteps,
    rootNote,
    mode,
    minNoteHeight,
    maxNoteHeight,
  );

  return {
    offsetIndex,
    registerDistance: placedCounterBar.registerDistance,
    steps: placedCounterBar.steps,
  };
};

const getBestCounterBarCandidate = (
  candidates: readonly CounterBarCandidate[],
): CounterBarCandidate => {
  return [...candidates].sort((left, right) => {
    if (left.registerDistance !== right.registerDistance) {
      return left.registerDistance - right.registerDistance;
    }

    return left.offsetIndex - right.offsetIndex;
  })[0];
};

export const generateCounterContour = ({
  motif,
  rootNote,
  mode,
  preferredDegreeOffsets,
  rangeSteps,
  minNote,
  maxNote,
}: Props): Motif => {
  const minNoteHeight = getNoteHeight(minNote);
  const maxNoteHeight = getNoteHeight(maxNote);
  const degreesInsideRegister = getDegreesInsideRegister(
    rootNote,
    mode,
    minNoteHeight,
    maxNoteHeight,
  );

  return motif.map((bar): MotifContourBar => {
    const normalizedSteps = normalizeCounterBar(bar.steps);
    const mainFirstDegree = Math.round(bar.steps[0] ?? 0);
    const candidates = preferredDegreeOffsets.map((offset, index) =>
      getCounterBarCandidate(
        normalizedSteps,
        mainFirstDegree,
        offset,
        index,
        rangeSteps,
        degreesInsideRegister,
        minNoteHeight,
        maxNoteHeight,
        rootNote,
        mode,
      ),
    );
    const bestCandidate = getBestCounterBarCandidate(candidates);

    return {
      steps: bestCandidate.steps,
      stepEvents: bar.stepEvents.map(() => []),
    };
  });
};
