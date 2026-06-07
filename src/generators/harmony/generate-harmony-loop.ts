import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';
import { takeRandomExclude } from '@utils/take-random-exclude';

type Props = {
  bars: number;
  blocks: readonly ModeDegreeFunction[];
  variations: readonly ModeDegreeFunction[];
};

/**
 * Repeats a short function loop across bars, with non-adjacent random variations inside.
 */
export const generateHarmonyLoop = ({ bars, blocks, variations }: Props): ModeDegreeFunction[] => {
  if (blocks.length === 0) {
    throw new Error('Cannot generate figure harmony from an empty block list');
  }

  const figure: ModeDegreeFunction[] = [];

  for (let index = 0; index < bars; index += 1) {
    const expectedBlock = blocks[index % blocks.length];

    if (index === 0 || index === bars - 1) {
      figure.push(expectedBlock);
      continue;
    }

    const previousBlock = figure[index - 1];
    const candidates = variations.includes(previousBlock)
      ? [expectedBlock]
      : [expectedBlock, ...variations];

    figure.push(takeRandomExclude(candidates, [previousBlock]));
  }

  return figure;
};
