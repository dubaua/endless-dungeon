import type { DrumChannel } from './types';

const DRUM_GROUP_ID = 'drum-bus-main';

export const demoDrumChannels: DrumChannel[] = [
  {
    id: 'drum-kick',
    name: 'Kick',
    voice: 'kick',
    outputChannelId: 'channel-drum-kick',
    groupId: DRUM_GROUP_ID,
    pattern: [1, 0, 0, 0, 0.75, 0, 0, 0, 1, 0, 0.35, 0, 0.75, 0, 0, 0],
  },
  {
    id: 'drum-snare',
    name: 'Snare',
    voice: 'snare',
    outputChannelId: 'channel-drum-snare',
    groupId: DRUM_GROUP_ID,
    pattern: [0, 0, 0, 0, 1, 0, 0, 0, 0.5, 0, 0, 0, 1, 0, 0, 0],
  },
  {
    id: 'drum-closed-hat',
    name: 'Closed Hat',
    voice: 'closedHat',
    outputChannelId: 'channel-drum-closed-hat',
    groupId: DRUM_GROUP_ID,
    pattern: [1, 0.5, 0.75, 0.5, 1, 0.5, 0.75, 0.5, 1, 0.5, 0.75, 0.5, 1, 0.5, 0.75, 0.5],
  },
  {
    id: 'drum-open-hat',
    name: 'Open Hat',
    voice: 'openHat',
    outputChannelId: 'channel-drum-open-hat',
    groupId: DRUM_GROUP_ID,
    pattern: [0, 0, 0, 0, 0, 0, 0, 0.65, 0, 0, 0, 0, 0, 0, 0, 0.85],
  },
  {
    id: 'drum-crash',
    name: 'Crash',
    voice: 'crash',
    outputChannelId: 'channel-drum-crash',
    groupId: DRUM_GROUP_ID,
    pattern: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];
