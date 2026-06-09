import type { VoicingState } from '@audio/synths/types';
import type { BlockFunction } from '@generators/composition/block-function.type';
import { generateCounterContour } from '@generators/harmony/generate-counter-contour';
import { generateModeHarmony } from '@generators/harmony/generate-mode-harmony';
import { generateBlockMotif, type GenerateMotifOptions } from '@generators/motif/generate-block-motif';
import type { Motif, MotifContour } from '@generators/motif/motif.type';
import { motifContourToDegrees } from '@generators/motif/motif-contour-to-degrees';
import { motifToPattern } from '@generators/motif/motif-to-pattern';
import type { TrackDna } from '@generators/dna/track-dna';
import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';
import { Modes } from '@harmony/modes.const';
import type { DrumClip, PatternStep } from '@sequencer/types';
import { getRandomFloat } from '@utils/get-random-float';

type Props = {
  drumClips: DrumClip[];
  function: BlockFunction;
  motifOptions: GenerateMotifOptions;
  trackDna: TrackDna;
  voicing: VoicingState;
};

export type TrackBlockTemp = {
  articulationDurationCutSteps: number;
  articulationReleaseBias: number;
  harmonyFunctions: ModeDegreeFunction[];
  motif: Motif;
  motifContour: MotifContour;
  bass: Motif;
  bassContour: MotifContour;
  bassPattern: PatternStep[];
  drumClips: DrumClip[];
  function: BlockFunction;
  motifOptions: GenerateMotifOptions;
  voicePattern: PatternStep[];
  voicing: VoicingState;
};

const BassCounterRangeSteps = 8;
const BassCounterPreferredDegreeOffsets = [-2, 2, -3, 3, -4, 4] as const;
const BassCounterMinNote = 'A1';
const BassCounterMaxNote = 'A3';
const MinArticulationDurationCutSteps = 0.25;
const MaxArticulationDurationCutSteps = 0.75;
const MinArticulationReleaseBias = 0;
const MaxArticulationReleaseBias = 1;

const applyArticulationDurationCut = (
  pattern: PatternStep[],
  articulationDurationCutSteps: number,
): PatternStep[] => {
  return pattern.flatMap(([note, steps]) => {
    if (!note || steps <= articulationDurationCutSteps) {
      return [[note, steps]];
    }

    return [
      [note, steps - articulationDurationCutSteps],
      [null, articulationDurationCutSteps],
    ];
  });
};

export const generateTrackBlock = ({
  drumClips,
  function: blockFunction,
  motifOptions,
  trackDna,
  voicing,
}: Props): TrackBlockTemp => {
  const articulationDurationCutSteps = getRandomFloat(
    MinArticulationDurationCutSteps,
    MaxArticulationDurationCutSteps,
  );
  const articulationReleaseBias = getRandomFloat(
    MinArticulationReleaseBias,
    MaxArticulationReleaseBias,
  );
  const harmonyFunctions = generateModeHarmony({
    bars: 8,
    mode: trackDna.modeName,
    block: 'theme',
  });
  const motifContour = generateBlockMotif({
    ...motifOptions,
    bars: harmonyFunctions.length,
  });
  const mode = Modes[trackDna.modeName];
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
    rootNote: trackDna.rootNote,
    mode,
  });
  const bass = bassContour;

  return {
    articulationDurationCutSteps,
    articulationReleaseBias,
    harmonyFunctions,
    motif,
    motifContour,
    bass,
    bassContour,
    bassPattern: applyArticulationDurationCut(
      motifToPattern(bass, trackDna),
      articulationDurationCutSteps,
    ),
    drumClips,
    function: blockFunction,
    motifOptions,
    voicePattern: applyArticulationDurationCut(
      motifToPattern(motif, trackDna),
      articulationDurationCutSteps,
    ),
    voicing,
  };
};
