import type { DrumChannel } from './types';

const DRUM_GROUP_ID = 'drum-bus-main';

export const demoDrumChannels: DrumChannel[] = [
  {
    id: 'drum-kick',
    name: 'Kick',
    voice: 'kick',
    outputChannelId: 'channel-drum-kick',
    groupId: DRUM_GROUP_ID,
    voicing: {
      decay: 0.55, // больше декай
      pitchStart: 'C2',
      filterFrequency: 120,
      filterResonance: 1,
      bitCrusherBits: 2,
      bitCrusherDepth: 0.05, // больше депт - меньше декей
    },
    pattern: [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  },
  {
    id: 'drum-snare',
    name: 'Snare',
    voice: 'snare',
    outputChannelId: 'channel-drum-snare',
    groupId: DRUM_GROUP_ID,
    voicing: {
      bitCrusherBits: 3,
      bitCrusherDepth: 0.05,
    },
    pattern: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
  },
  {
    id: 'drum-closed-hat',
    name: 'Closed Hat',
    voice: 'closedHat',
    outputChannelId: 'channel-drum-closed-hat',
    groupId: DRUM_GROUP_ID,
    voicing: {
      decay: 0.035,
      bitCrusherBits: 3,
      bitCrusherDepth: 0.02,
    },
    pattern: [1, 0.5, 0.75, 0.5, 1, 0.5, 0.75, 0.5, 1, 0.5, 0.75, 0.5, 1, 0.5, 0.75, 0.5],
  },
  {
    id: 'drum-open-hat',
    name: 'Open Hat',
    voice: 'openHat',
    outputChannelId: 'channel-drum-open-hat',
    groupId: DRUM_GROUP_ID,
    voicing: {
      decay: 0.18,
      release: 0.28,
      filterFrequency: 5600,
      filterResonance: 0.9,
      bitCrusherBits: 3,
      bitCrusherDepth: 0.025,
    },
    pattern: [0, 0, 0, 0, 0, 0, 0, 0.65, 0, 0, 0, 0, 0, 0, 0, 0.85],
  },
  {
    id: 'drum-crash',
    name: 'Crash',
    voice: 'crash',
    outputChannelId: 'channel-drum-crash',
    groupId: DRUM_GROUP_ID,
    voicing: {
      decay: 1.2,
      release: 1.2,
      bitCrusherBits: 2,
      bitCrusherDepth: 0.035,
    },
    pattern: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];
