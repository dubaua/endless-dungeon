import type { VoicingState } from '@audio/synths/types';
import { generateCounterContour } from '@generators/harmony/generate-counter-contour';
import { generateTrackDna } from '@generators/dna/generate-track-dna';
import type { TrackDna } from '@generators/dna/track-dna';
import { generateModeHarmony } from '@generators/harmony/generate-mode-harmony';
import { generateBlockMotif, type GenerateMotifOptions } from '@generators/motif/generate-block-motif';
import type { Motif, MotifContour } from '@generators/motif/motif.type';
import { motifContourToDegrees } from '@generators/motif/motif-contour-to-degrees';
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

const BassCounterRangeSteps = 8;
const BassCounterPreferredDegreeOffsets = [-2, 2, -3, 3, -4, 4] as const;
const BassCounterMinNote = 'A1';
const BassCounterMaxNote = 'A3';

export type TrackTemp = {
  drumClips: DrumClip[];
  harmonyFunctions: ModeDegreeFunction[];
  motif: Motif;
  motifContour: MotifContour;
  motifOptions: GenerateMotifOptions;
  bass: Motif;
  bassContour: MotifContour;
  bassPattern: PatternStep[];
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
  const motifContour = generateBlockMotif({
    ...nextMotifOptions,
    bars: harmonyFunctions.length,
  });
  const mode = getMode(nextTrackDna.modeName);
  const motif = motifContourToDegrees({
    motif: motifContour,
    mode,
    harmonyFunctions,
  });
  const bassContour = generateCounterContour({
    motif: motifContour,
    rangeSteps: BassCounterRangeSteps,
    preferredDegreeOffsets: BassCounterPreferredDegreeOffsets,
    minNote: BassCounterMinNote,
    maxNote: BassCounterMaxNote,
    rootNote: nextTrackDna.rootNote,
    mode,
  });
  const bass = bassContour;

  return {
    drumClips: nextDrumClips,
    harmonyFunctions,
    motif,
    motifContour,
    motifOptions: nextMotifOptions,
    bass,
    bassContour,
    bassPattern: motifToPattern(bass, nextTrackDna),
    trackDna: nextTrackDna,
    voicePattern: motifToPattern(motif, nextTrackDna),
    voicing: nextTrackDna.voicing,
  };
};
