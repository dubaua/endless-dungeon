import type { TrackDna } from '@generators/dna/track-dna';
import type { PatternStep } from '@sequencer';
import type { Motif } from '@generators/motif/motif.type';
import { getMode } from '@harmony/get-mode';
import { getModeDegreeNote } from '@harmony/get-mode-degree-note';

const MotifStepLength = 2;

export const motifToPattern = (motif: Motif, trackDna: TrackDna): PatternStep[] => {
  return motif.flatMap((bar) =>
    bar.steps.map((degree) => [
      getModeDegreeNote(trackDna.rootNote, getMode(trackDna.modeName), degree),
      MotifStepLength,
    ]),
  );
};
