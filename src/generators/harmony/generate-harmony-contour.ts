import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';
import { takeRandomExclude } from '@utils/take-random-exclude';

type Props = {
  bars: number;
  functions: readonly ModeDegreeFunction[];
  start?: ModeDegreeFunction;
  end?: ModeDegreeFunction;
  midCadence?: ModeDegreeFunction;
};

/**
 * Generates a bar-length function contour with fixed start/end and optional middle cadence.
 */
export const generateHarmonyContour = ({
  bars,
  functions,
  start = 'tonic',
  end = 'dominant',
  midCadence,
}: Props): ModeDegreeFunction[] => {
  if (bars <= 0) {
    return [];
  }

  if (functions.length === 0) {
    throw new Error('Cannot generate theme harmony from an empty function list');
  }

  const theme: ModeDegreeFunction[] = [];
  const midCadenceIndex = midCadence ? Math.floor(bars / 2) : -1;

  for (let index = 0; index < bars; index += 1) {
    const previousFunction = theme[index - 1];

    if (index === 0) {
      theme.push(start);
      continue;
    }

    if (index === bars - 1) {
      theme.push(end);
      continue;
    }

    if (index === midCadenceIndex && midCadence) {
      theme.push(midCadence);
      continue;
    }

    theme.push(takeRandomExclude(functions, [previousFunction]));
  }

  return theme;
};
