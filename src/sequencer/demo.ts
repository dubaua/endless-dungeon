import type { Clip, Track } from './types';

export const demoClips: Clip[] = [
  {
    id: 'clip-note-pattern',
    startTick: 0,
    gatePercent: 0.5,
    pattern: [
      ['c2', 1],
      ['db2', 2],
      [null, 4],
      ['c3', 1],
      ['g2', 2],
      [null, 2],
      ['f2', 1],
      ['ab2', 1],
      [null, 2],
      ['c3', 4],
      [null, 4],
      ['bb2', 2],
      ['g2', 2],
      ['eb2', 4],
      [null, 8],
      ['f2', 2],
      ['g2', 2],
      ['c3', 4],
      [null, 16],
    ],
  },
];

export const demoTracks: Track[] = [
  {
    id: 'track-notes',
    name: 'Dungeon Pattern',
    type: 'notes',
    clips: [demoClips[0]],
  },
];
