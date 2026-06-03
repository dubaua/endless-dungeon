import { blockFunctions, type BlockFunction } from './block-function.type';
import { lengthsGraph, type BlockLengthWeights } from './block-length.graph';
import { startWeights } from './start-block.graph';
import { transitionsGraph } from './block-transition.graph';
import type { TrackBlock } from './track-block.interface';
import { getRandomInt } from '../../utils/get-random-int';
import { pickWeighted, type WeightedOptions } from '../../utils/pick-weighted';

const MinTrackBars = 24;
const MaxTrackBars = 48;

const maxBarsByBlock: Record<BlockFunction, number> = {
  body: 16,
  variation: 16,
  tension: 8,
  drop: 16,
  pit: 12,
  break: 6,
  breakdown: 8,
};

const getTotalBars = (track: readonly TrackBlock[]): number => {
  return track.reduce((sum, trackBlock) => sum + trackBlock.bars, 0);
};

const getUsedBars = (track: readonly TrackBlock[], block: BlockFunction): number => {
  return track
    .filter((trackBlock) => trackBlock.block === block)
    .reduce((sum, trackBlock) => sum + trackBlock.bars, 0);
};

const getRemainingBars = (track: readonly TrackBlock[], block: BlockFunction): number => {
  return maxBarsByBlock[block] - getUsedBars(track, block);
};

const removeLimitedLengths = (
  weights: BlockLengthWeights,
  block: BlockFunction,
  track: readonly TrackBlock[],
): BlockLengthWeights => {
  const remainingBlockBars = getRemainingBars(track, block);
  const remainingTrackBars = MaxTrackBars - getTotalBars(track);

  return weights.map((option) => ({
    value: option.value,
    weight:
      option.value <= remainingBlockBars && option.value <= remainingTrackBars ? option.weight : 0,
  }));
};

const hasAvailableLength = (block: BlockFunction, track: readonly TrackBlock[]): boolean => {
  const weights = removeLimitedLengths(lengthsGraph[block], block, track);

  return weights.some((option) => option.weight > 0);
};

const removeLimitedBlocks = (
  weights: WeightedOptions<BlockFunction>,
  track: readonly TrackBlock[],
): WeightedOptions<BlockFunction> => {
  return weights.map((option) => ({
    value: option.value,
    weight: hasAvailableLength(option.value, track) ? option.weight : 0,
  }));
};

const hasPickableOption = <T>(options: WeightedOptions<T>): boolean => {
  return options.some((option) => option.weight > 0);
};

const getFallbackBlockWeights = (track: readonly TrackBlock[]): WeightedOptions<BlockFunction> => {
  return blockFunctions.map((block) => ({
    value: block,
    weight: hasAvailableLength(block, track) ? 1 : 0,
  }));
};

const generateBlockLength = (block: BlockFunction, track: readonly TrackBlock[]): number => {
  const weights = removeLimitedLengths(lengthsGraph[block], block, track);

  return pickWeighted(weights);
};

export const generateTrackComposition = (): TrackBlock[] => {
  const targetBars = getRandomInt(MinTrackBars, MaxTrackBars);
  const startBlock = pickWeighted(removeLimitedBlocks(startWeights, []));
  const track: TrackBlock[] = [
    {
      block: startBlock,
      bars: generateBlockLength(startBlock, []),
    },
  ];

  while (getTotalBars(track) < targetBars) {
    const currentBlock = track[track.length - 1]?.block ?? startBlock;
    const weights = removeLimitedBlocks(transitionsGraph[currentBlock], track);
    const fallbackWeights = getFallbackBlockWeights(track);
    const nextBlockWeights = hasPickableOption(weights) ? weights : fallbackWeights;

    if (!hasPickableOption(nextBlockWeights)) {
      break;
    }

    const block = pickWeighted(nextBlockWeights);

    track.push({
      block,
      bars: generateBlockLength(block, track),
    });
  }

  return track;
};
