import type { VoicingState } from '@audio/synths/types';
import { generateTrackDna } from '@generators/dna/generate-track-dna';
import type { TrackDna } from '@generators/dna/track-dna';
import { generateModeHarmony } from '@generators/harmony/generate-mode-harmony';
import { generateMotif, type GenerateMotifOptions } from '@generators/motif/generate-motif';
import type { Motif } from '@generators/motif/motif';
import { motifToPattern } from '@generators/motif/motif-to-pattern';
import { generateEightBarDrumPattern } from '@generators/patterns/generate-eight-bar-drum-pattern';
import { generateEightBarHatsPattern } from '@generators/patterns/generate-eight-bar-hats-pattern';
import { hatsPatternToDrumClips } from '@generators/patterns/hats-pattern-to-drum-clips';
import { kickOffbeatPatternToDrumClips } from '@generators/patterns/kick-offbeat-pattern-to-drum-clips';
import { getMode } from '@harmony/get-mode';
import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';
import type { DrumClip, PatternStep } from '@sequencer/types';

type Props = {
  drumClips: DrumClip[];
  motifOptions: GenerateMotifOptions;
  trackDna?: TrackDna;
};

export type TrackTemp = {
  drumClips: DrumClip[];
  harmonyFunctions: ModeDegreeFunction[];
  motif: Motif;
  motifOptions: GenerateMotifOptions;
  trackDna: TrackDna;
  voicePattern: PatternStep[];
  voicing: VoicingState;
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

  const harmonyFunctions = generateModeHarmony({
    bars: 8,
    mode: nextTrackDna.modeName,
    block: 'theme',
  });
  const motif = generateMotif({
    ...nextMotifOptions,
    mode: getMode(nextTrackDna.modeName),
    harmonyFunctions,
  });

  return {
    drumClips: nextDrumClips,
    harmonyFunctions,
    motif,
    motifOptions: nextMotifOptions,
    trackDna: nextTrackDna,
    voicePattern: motifToPattern(motif, nextTrackDna),
    voicing: nextTrackDna.voicing,
  };
};
