import type { Track } from './types';

export const InitialTracks: Track[] = [
  {
    id: 'track-notes',
    name: 'Dungeon Pattern',
    type: 'notes',
    clips: [
      {
        id: 'clip-note-pattern',
        startTick: 0,
        gatePercent: 0.5,
        pattern: [],
      },
    ],
  },
];
