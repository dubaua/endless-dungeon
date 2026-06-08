import type { Motif, MotifContour } from '@generators/motif/motif.type';
import { getNearestModeDegreeByFunction } from '@harmony/get-nearest-mode-degree-by-function';
import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';
import type { Mode } from '@harmony/mode.type';

type Props = {
  harmonyFunctions: readonly ModeDegreeFunction[];
  mode: Mode;
  motif: MotifContour;
  startDegree?: number;
};

export const motifContourToDegrees = ({
  motif,
  mode,
  harmonyFunctions,
  startDegree = 0,
}: Props): Motif => {
  let nextStartDegree = startDegree;

  return motif.map((bar, index) => {
    const fn = harmonyFunctions[index];
    let barStartDegree = nextStartDegree;

    if (fn) {
      barStartDegree = getNearestModeDegreeByFunction({
        mode,
        degree: nextStartDegree,
        fn,
      });
    }

    const contourStartDegree = bar.steps[0] ?? 0;
    const degreeShift = barStartDegree - Math.round(contourStartDegree);
    const steps = bar.steps.map((step) => Math.round(step) + degreeShift);

    nextStartDegree = steps[steps.length - 1] ?? barStartDegree;

    return {
      steps,
      stepEvents: bar.stepEvents,
    };
  });
};
