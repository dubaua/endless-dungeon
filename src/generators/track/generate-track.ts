import { generateTrackDna } from '@generators/dna/generate-track-dna';
import type { TrackDna } from '@generators/dna/track-dna';
import type { GenerateMotifOptions } from '@generators/motif/generate-block-motif';
import { generateTrackBlock, type TrackBlockTemp } from '@generators/track/generate-track-block';
import { generateEightBarDrumPattern } from '@generators/patterns/generate-eight-bar-drum-pattern';
import { generateEightBarHatsPattern } from '@generators/patterns/generate-eight-bar-hats-pattern';
import { hatsPatternToDrumClips } from '@generators/patterns/hats-pattern-to-drum-clips';
import { kickOffbeatPatternToDrumClips } from '@generators/patterns/kick-offbeat-pattern-to-drum-clips';
import type { DrumClip } from '@sequencer/types';

type Props = {
  drumClips: DrumClip[];
  motifOptions: GenerateMotifOptions;
  trackDna?: TrackDna;
};

export type TrackTemp = {
  blocks: TrackBlockTemp[];
  trackDna: TrackDna;
};

export const generateTrack = ({ drumClips, motifOptions, trackDna }: Props): TrackTemp => {
  const nextTrackDna = trackDna ?? generateTrackDna();
  let nextMotifOptions = motifOptions;
  let nextDrumClips = drumClips;

  if (!trackDna) {
    nextMotifOptions = {
      ...motifOptions,
      melodyJumpBias: nextTrackDna.melodyJumpBias,
      melodyBreakPhaseResetBias: nextTrackDna.melodyBreakPhaseResetBias,
      melodyBreakPhaseShiftBias: nextTrackDna.melodyBreakPhaseShiftBias,
      melodySpeedBias: nextTrackDna.melodySpeedBias,
      melodySpeedChangeBias: nextTrackDna.melodySpeedChangeBias,
      melodicRange: nextTrackDna.melodicRange,
      absoluteRange: nextTrackDna.absoluteRange,
    };
    nextDrumClips = hatsPatternToDrumClips(
      generateEightBarHatsPattern(nextTrackDna.bodyHatPattern),
      kickOffbeatPatternToDrumClips(
        generateEightBarDrumPattern(nextTrackDna.bodyDrumPattern),
        drumClips,
      ),
    );
  }

  const block = generateTrackBlock({
    drumClips: nextDrumClips,
    function: 'body',
    motifOptions: nextMotifOptions,
    trackDna: nextTrackDna,
    voicing: nextTrackDna.voicing,
  });

  return {
    blocks: [block],
    trackDna: nextTrackDna,
  };
};
