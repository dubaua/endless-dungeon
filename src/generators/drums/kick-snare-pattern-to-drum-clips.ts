import type { DrumClip } from '../../sequencer/types';
import type { DrumSynthId } from '../../audio/synths/types';

const StepsPerBar = 16;

const patternToClips = (synthId: DrumSynthId, pattern: number[]): DrumClip[] =>
  Array.from({ length: Math.ceil(pattern.length / StepsPerBar) }, (_, index) => ({
    id: `drum-${synthId}-bar-${index + 1}`,
    synthId,
    startBar: index,
    pattern: pattern.slice(index * StepsPerBar, (index + 1) * StepsPerBar),
  }));

export const kickSnarePatternToDrumClips = (
  pattern: string,
  clips: readonly DrumClip[],
): DrumClip[] => {
  const kickPattern = [...pattern].map((step) => (step === 'k' ? 1 : 0));
  const snarePattern = [...pattern].map((step) => (step === 's' ? 1 : 0));
  const kickClips = patternToClips('kick', kickPattern);
  const snareClips = patternToClips('snare', snarePattern);

  return [
    ...kickClips,
    ...snareClips,
    ...clips.filter((clip) => clip.synthId !== 'kick' && clip.synthId !== 'snare'),
  ];
};
