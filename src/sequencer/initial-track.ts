import type { VoicingState } from '../audio/synths/types';
import { generateTrackDna } from '../generators/dna/generate-track-dna';
import type { TrackDna } from '../generators/dna/track-dna';
import { generateDrumVoicing } from '../generators/voicing/drums/generate-drum-voicing';
import { InitialDrumClips } from './initial-drum-clips';
import { InitialNoteClips } from './initial-note-clips';
import type { Track } from './types';

const InitialTrackDna = generateTrackDna();

const createTrackVoicing = (trackDna: TrackDna): VoicingState => ({
  drums: generateDrumVoicing(trackDna.rootNote),
  notes: {
    voice: {
      attack: 0.01,
      decay: 0.16,
      ...trackDna.voice,
    },
    bass: {
      attack: 0.01,
      decay: 0.16,
      ...trackDna.voice,
      filterFrequency: 700,
    },
  },
});

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
      voicing: createTrackVoicing(InitialTrackDna),
    },
  ],
};
