import { generateTrackDna } from '@generators/dna/generate-track-dna';
import { InitialDrumClips } from '@sequencer/initial-drum-clips';
import { InitialNoteClips } from '@sequencer/initial-note-clips';
import type { Track } from '@sequencer/types';

const InitialTrackDna = generateTrackDna();

export const InitialTrack: Track = {
  id: 'track-a',
  dna: InitialTrackDna,
  blocks: [
    {
      id: 'track-a-body-1',
      function: 'body',
      bars: 1,
      noteClips: InitialNoteClips,
      drumClips: InitialDrumClips,
      voicing: InitialTrackDna.voicing,
    },
  ],
};
