import type { DrumClip } from './types';

const EmptyPattern = Array.from({ length: 16 }, () => 0);

export const InitialDrumClips: DrumClip[] = [
  {
    id: 'drum-kick-primary-bar-1',
    synthId: 'kickPrimary',
    startBar: 0,
    pattern: EmptyPattern,
  },
  {
    id: 'drum-kick-secondary-bar-1',
    synthId: 'kickSecondary',
    startBar: 0,
    pattern: EmptyPattern,
  },
  {
    id: 'drum-snare-primary-bar-1',
    synthId: 'snarePrimary',
    startBar: 0,
    pattern: EmptyPattern,
  },
  {
    id: 'drum-snare-secondary-bar-1',
    synthId: 'snareSecondary',
    startBar: 0,
    pattern: EmptyPattern,
  },
  {
    id: 'drum-clap-primary-bar-1',
    synthId: 'clapPrimary',
    startBar: 0,
    pattern: EmptyPattern,
  },
  {
    id: 'drum-clap-secondary-bar-1',
    synthId: 'clapSecondary',
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
    id: 'drum-ride-bar-1',
    synthId: 'ride',
    startBar: 0,
    pattern: EmptyPattern,
  },
  {
    id: 'drum-crash-bar-1',
    synthId: 'crash',
    startBar: 0,
    pattern: EmptyPattern,
  },
];
