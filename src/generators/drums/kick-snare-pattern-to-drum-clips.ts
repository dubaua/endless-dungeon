import { InitialDrumClips } from '../../sequencer/initial-drum-clips';
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
  const clipsBySynth = new Map(clips.map((clip) => [clip.synthId, clip]));
  const baseClips = InitialDrumClips.map((clip) => clipsBySynth.get(clip.synthId) ?? clip);
  const kickPattern = [...pattern].map((step) => (step === 'k' ? 1 : 0));
  const snarePattern = [...pattern].map((step) => (step === 's' ? 1 : 0));
  const kickClips = patternToClips('kick', kickPattern);
  const snareClips = patternToClips('snare', snarePattern);

  return [
    ...kickClips,
    ...snareClips,
    ...baseClips.filter((clip) => clip.synthId !== 'kick' && clip.synthId !== 'snare'),
  ];
};

export const kickSnareDrumClipsToPattern = (clips: readonly DrumClip[]): string => {
  const kickPattern = clips
    .filter((clip) => clip.synthId === 'kick')
    .sort((left, right) => left.startBar - right.startBar)
    .flatMap((clip) => clip.pattern);
  const snarePattern = clips
    .filter((clip) => clip.synthId === 'snare')
    .sort((left, right) => left.startBar - right.startBar)
    .flatMap((clip) => clip.pattern);
  const patternLength = Math.max(kickPattern.length, snarePattern.length);

  return Array.from({ length: patternLength }, (_, index) => {
    const hasKick = (kickPattern[index] ?? 0) > 0;
    const hasSnare = (snarePattern[index] ?? 0) > 0;

    if (hasKick) {
      return 'k';
    }

    if (hasSnare) {
      return 's';
    }

    return '-';
  }).join('');
};
