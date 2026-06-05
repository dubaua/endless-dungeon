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

export const kickOffbeatPatternToDrumClips = (
  pattern: string,
  clips: readonly DrumClip[],
): DrumClip[] => {
  const kickPattern = [...pattern].map((step) => (step === 'k' || step === 'x' ? 1 : 0));
  const primaryOffbeatPattern = [...pattern].map((step) => (step === 'O' || step === 'x' ? 1 : 0));
  const secondaryOffbeatPattern = [...pattern].map((step) => (step === 'o' ? 1 : 0));
  const kickClips = patternToClips('kickPrimary', kickPattern);
  const primaryOffbeatClips = patternToClips('snarePrimary', primaryOffbeatPattern);
  const secondaryOffbeatClips = patternToClips('snareSecondary', secondaryOffbeatPattern);

  return [
    ...kickClips,
    ...primaryOffbeatClips,
    ...secondaryOffbeatClips,
    ...clips.filter(
      (clip) =>
        clip.synthId !== 'kickPrimary' &&
        clip.synthId !== 'snarePrimary' &&
        clip.synthId !== 'snareSecondary',
    ),
  ];
};
