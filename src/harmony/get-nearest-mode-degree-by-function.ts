import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';
import { getModeDegreesByFunction } from '@harmony/get-mode-degrees-by-function';
import { getModeDegreeOctave } from '@harmony/get-mode-degree';
import type { Mode } from '@harmony/mode.type';

type Props = {
  mode: Mode;
  degree: number;
  fn: ModeDegreeFunction;
};

/**
 * Finds the closest absolute degree that can express a harmony function.
 * Lets the next motif bar start near the previous bar ending instead of jumping to a fixed octave.
 */
export const getNearestModeDegreeByFunction = ({
  mode,
  degree,
  fn,
}: Props): number => {
  const modeDegrees = getModeDegreesByFunction(mode, fn);

  if (modeDegrees.length === 0) {
    throw new Error(`Mode ${mode.name} does not contain function ${fn}`);
  }

  const modeSize = mode.intervals.length;
  const currentOctave = getModeDegreeOctave(degree, mode);
  const candidates = modeDegrees.flatMap((modeDegree) => (
    [currentOctave - 1, currentOctave, currentOctave + 1].map((octave) => (
      modeDegree + octave * modeSize
    ))
  ));

  return candidates.reduce((nearestDegree, candidate) => {
    const nearestDistance = Math.abs(nearestDegree - degree);
    const candidateDistance = Math.abs(candidate - degree);

    return candidateDistance < nearestDistance ? candidate : nearestDegree;
  });
};
