import type { DrumSynthId } from '@audio/synths/types';
import type { DrumClip } from '@sequencer/types';

const StepsPerBar = 16;

const patternToClips = (synthId: DrumSynthId, pattern: number[]): DrumClip[] =>
  Array.from({ length: Math.ceil(pattern.length / StepsPerBar) }, (_, index) => ({
    id: `drum-${synthId}-bar-${index + 1}`,
    synthId,
    startBar: index,
    pattern: pattern.slice(index * StepsPerBar, (index + 1) * StepsPerBar),
  }));

export const hatsPatternToDrumClips = (
  pattern: string,
  clips: readonly DrumClip[],
): DrumClip[] => {
  const closedHatPattern = [...pattern].map((step) => (step === 'h' ? 1 : 0));
  const openHatPattern = [...pattern].map((step) => (step === 'o' ? 1 : 0));
  const closedHatClips = patternToClips('closedHat', closedHatPattern);
  const openHatClips = patternToClips('openHat', openHatPattern);

  return [
    ...closedHatClips,
    ...openHatClips,
    ...clips.filter((clip) => clip.synthId !== 'closedHat' && clip.synthId !== 'openHat'),
  ];
};
