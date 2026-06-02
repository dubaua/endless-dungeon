import type { DrumChannel } from './types';

const DrumGroupId = 'drum-bus-main';
const EmptyPattern = Array.from({ length: 16 }, () => 0);

export const InitialDrumChannels: DrumChannel[] = [
  {
    id: 'drum-kick',
    name: 'Kick',
    voice: 'kick',
    outputChannelId: 'channel-drum-kick',
    groupId: DrumGroupId,
    voicing: {
      decay: 0.55,
      pitchStart: 'C2',
      filterFrequency: 120,
      filterResonance: 1,
      bitCrusherBits: 2,
      bitCrusherDepth: 0.05,
    },
    pattern: EmptyPattern,
  },
  {
    id: 'drum-snare',
    name: 'Snare',
    voice: 'snare',
    outputChannelId: 'channel-drum-snare',
    groupId: DrumGroupId,
    voicing: {
      decay: 0.15,
      bitCrusherBits: 2,
      bitCrusherDepth: 0.005,
    },
    pattern: EmptyPattern,
  },
  {
    id: 'drum-closed-hat',
    name: 'Closed Hat',
    voice: 'closedHat',
    outputChannelId: 'channel-drum-closed-hat',
    groupId: DrumGroupId,
    voicing: {
      decay: 0.075,
      filterFrequency: 7500,
      filterResonance: 0.9,
      bitCrusherBits: 3,
      bitCrusherDepth: 0.02,
    },
    pattern: EmptyPattern,
  },
  {
    id: 'drum-open-hat',
    name: 'Open Hat',
    voice: 'openHat',
    outputChannelId: 'channel-drum-open-hat',
    groupId: DrumGroupId,
    voicing: {
      decay: 0.8,
      release: 0.5,
      filterFrequency: 7500,
      filterResonance: 0.9,
      bitCrusherBits: 3,
      bitCrusherDepth: 0.02,
    },
    pattern: EmptyPattern,
  },
  {
    id: 'drum-crash',
    name: 'Crash',
    voice: 'crash',
    outputChannelId: 'channel-drum-crash',
    groupId: DrumGroupId,
    voicing: {
      decay: 1.2,
      release: 5,
      filterFrequency: 7500,
      filterResonance: 0.9,
      bitCrusherBits: 3,
      bitCrusherDepth: 0.02,
    },
    pattern: EmptyPattern,
  },
  {
    id: 'drum-ride',
    name: 'Ride',
    voice: 'ride',
    outputChannelId: 'channel-drum-ride',
    groupId: DrumGroupId,
    voicing: {
      decay: 0.45,
      release: 0.35,
      filterFrequency: 6800,
      filterResonance: 0.8,
      bitCrusherBits: 3,
      bitCrusherDepth: 0.02,
    },
    pattern: EmptyPattern,
  },
];
