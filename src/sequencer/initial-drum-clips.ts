import type { DrumClip } from './types';

const EmptyPattern = Array.from({ length: 16 }, () => 0);

export const InitialDrumClips: DrumClip[] = [
  {
    id: 'drum-kick-bar-1',
    synthId: 'kick',
    startBar: 0,
    pattern: EmptyPattern,
  },
  {
    id: 'drum-snare-bar-1',
    synthId: 'snare',
    startBar: 0,
    pattern: EmptyPattern,
  },
  {
    id: 'drum-clap-bar-1',
    synthId: 'clap',
    startBar: 0,
    pattern: EmptyPattern,
  },
  {
    id: 'drum-closed-hat-bar-1',
    synthId: 'closedHat',
    startBar: 0,
    pattern: EmptyPattern,
  },
  {
    id: 'drum-open-hat-bar-1',
    synthId: 'openHat',
    startBar: 0,
    pattern: EmptyPattern,
  },
  {
    id: 'drum-crash-bar-1',
    synthId: 'crash',
    startBar: 0,
    pattern: EmptyPattern,
  },
  {
    id: 'drum-ride-bar-1',
    synthId: 'ride',
    startBar: 0,
    pattern: EmptyPattern,
  },
];
