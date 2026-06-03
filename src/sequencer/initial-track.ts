import { InitialVoicing } from '../audio/synths/initial-voicing';
import { generateTrackDna } from '../generators/dna/generate-track-dna';
import { InitialDrumClips } from './initial-drum-clips';
import { InitialNoteClips } from './initial-note-clips';
import type { Track } from './types';

export const InitialTrack: Track = {
  id: 'track-a',
  dna: generateTrackDna(),
  blocks: [
    {
      id: 'track-a-body-1',
      function: 'body',
      bars: 1,
      noteClips: InitialNoteClips,
      drumClips: InitialDrumClips,
      voicing: InitialVoicing,
    },
  ],
};
