import type { BlockFunction } from './blocks/block-function';
import { lengthsGraph, type BlockLength, type BlockLengthWeights } from './blocks/lengths-graph';
import { startWeights } from './blocks/start-weights';
import { transitionsGraph } from './blocks/transitions-graph';
import type { TrackBlock } from './track-block';
import { generateByGraph, type RandomSource, type WeightedGraph } from '../utils/generate-by-graph';
import { getRandomInt } from '../utils/get-random-int';

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
  const availableWeights: BlockLengthWeights = {};

  Object.entries(weights).forEach(([bars, weight]) => {
    const length = Number(bars);
    availableWeights[bars as BlockLength] =
      length <= remainingBlockBars && length <= remainingTrackBars ? (weight ?? 0) : 0;
  });

  return availableWeights;
};

const hasAvailableLength = (block: BlockFunction, track: readonly TrackBlock[]): boolean => {
  const weights = removeLimitedLengths(lengthsGraph[block], block, track);

  return Object.values(weights).some((weight) => (weight ?? 0) > 0);
};

const removeLimitedBlocks = (
  weights: WeightedGraph<BlockFunction>,
  track: readonly TrackBlock[],
): WeightedGraph<BlockFunction> => {
  const availableWeights: WeightedGraph<BlockFunction> = {};

  Object.entries(weights).forEach(([block, weight]) => {
    const blockFunction = block as BlockFunction;
    availableWeights[blockFunction] = hasAvailableLength(blockFunction, track) ? (weight ?? 0) : 0;
  });

  return availableWeights;
};

const generateBlockLength = (
  block: BlockFunction,
  track: readonly TrackBlock[],
  random: RandomSource,
): number => {
  const weights = removeLimitedLengths(lengthsGraph[block], block, track);

  return Number(generateByGraph(weights, random));
};

export const generateTrack = (random: RandomSource = Math.random): TrackBlock[] => {
  const targetBars = getRandomInt(MinTrackBars, MaxTrackBars, random);
  const startBlock = generateByGraph(removeLimitedBlocks(startWeights, []), random);
  const track: TrackBlock[] = [
    {
      block: startBlock,
      bars: generateBlockLength(startBlock, [], random),
    },
  ];

  while (getTotalBars(track) < targetBars) {
    const currentBlock = track[track.length - 1]?.block ?? startBlock;
    const weights = removeLimitedBlocks(transitionsGraph[currentBlock], track);
    const block = generateByGraph(weights, random);

    track.push({
      block,
      bars: generateBlockLength(block, track, random),
    });
  }

  return track;
};
