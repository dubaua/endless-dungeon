import { createSignal, onCleanup, type Accessor } from 'solid-js';

import { generateTrackDna } from '../generators/dna/generate-track-dna';
import type { TrackDna } from '../generators/dna/track-dna';
import { demoDrumChannels, demoTracks, type SequencerState } from '../sequencer';
import type { DrumChannel, PatternStep } from '../sequencer';
import { clamp } from '../utils/clamp';

export const SYNTH_MIXER_CHANNEL_ID = 'channel-synth-main';

const MIXER_SESSION_STORAGE_KEY = 'endless-dungeon:mixer';

export type OscillatorType = 'sine' | 'triangle' | 'sawtooth' | 'square';

export interface SynthState {
  oscillatorType: OscillatorType;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  filterFrequency: number;
  filterResonance: number;
  bitCrusherBits: number;
  bitCrusherDepth: number;
}

export interface MixerChannelState {
  id: string;
  name: string;
  volume: number;
  muted: boolean;
  groupId: string | null;
}

export interface MixerState {
  channels: Record<string, MixerChannelState>;
}

export interface TransportState {
  bpm: number;
  timeSignature: [number, number];
  isPlaying: boolean;
  currentTick: number;
  bar: number;
  beat: number;
  sixteenth: number;
  step: number;
}

export interface DrumPatternFiltersState {
  syncopationScore: number;
  syncopationSpread: number;
  density: number;
  densitySpread: number;
}

export interface AppState {
  transport: TransportState;
  sequencer: SequencerState;
  trackDna: TrackDna;
  drumPatternFilters: DrumPatternFiltersState;
  synth: SynthState;
  mixer: MixerState;
}

type Listener = (state: AppState) => void;
type Mutator = (state: AppState) => void;

type Selector<T> = (state: AppState) => T;

type Cleanup = () => void;

type StoredMixerChannelState = Partial<Pick<MixerChannelState, 'volume' | 'muted'>>;
type StoredMixerState = Record<string, StoredMixerChannelState>;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const deepEqual = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) {
    return true;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length && left.every((value, index) => deepEqual(value, right[index]))
    );
  }

  if (isPlainObject(left) && isPlainObject(right)) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    return (
      leftKeys.length === rightKeys.length &&
      leftKeys.every(
        (key) =>
          Object.prototype.hasOwnProperty.call(right, key) && deepEqual(left[key], right[key]),
      )
    );
  }

  return false;
};

const hasSessionStorage = (): boolean => typeof sessionStorage !== 'undefined';

const readStoredMixerState = (): StoredMixerState => {
  if (!hasSessionStorage()) {
    return {};
  }

  try {
    const raw = sessionStorage.getItem(MIXER_SESSION_STORAGE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;

    return isPlainObject(parsed) ? (parsed as StoredMixerState) : {};
  } catch {
    return {};
  }
};

const writeStoredMixerState = (mixer: MixerState): void => {
  if (!hasSessionStorage()) {
    return;
  }

  const stored: StoredMixerState = Object.fromEntries(
    Object.entries(mixer.channels).map(([id, channel]) => [
      id,
      {
        volume: channel.volume,
        muted: channel.muted,
      },
    ]),
  );

  sessionStorage.setItem(MIXER_SESSION_STORAGE_KEY, JSON.stringify(stored));
};

const createDefaultMixerChannels = (): Record<string, MixerChannelState> =>
  Object.fromEntries(
    [
      {
        id: SYNTH_MIXER_CHANNEL_ID,
        name: 'Piano',
        volume: 0.75,
        muted: false,
        groupId: null,
      },
      ...demoDrumChannels.map((channel) => ({
        id: channel.outputChannelId,
        name: channel.name,
        volume: 0.85,
        muted: false,
        groupId: channel.groupId,
      })),
    ].map((channel) => [channel.id, channel]),
  );

const createInitialMixerState = (): MixerState => {
  const channels = createDefaultMixerChannels();
  const stored = readStoredMixerState();

  Object.entries(stored).forEach(([id, settings]) => {
    const channel = channels[id];

    if (!channel) {
      return;
    }

    channels[id] = {
      ...channel,
      volume: typeof settings.volume === 'number' ? clamp(settings.volume, 0, 1) : channel.volume,
      muted: typeof settings.muted === 'boolean' ? settings.muted : channel.muted,
    };
  });

  return { channels };
};

const state: AppState = {
  transport: {
    bpm: 120,
    timeSignature: [4, 4],
    isPlaying: false,
    currentTick: 0,
    bar: 0,
    beat: 0,
    sixteenth: 0,
    step: 0,
  },
  sequencer: {
    tracks: demoTracks,
    drumChannels: demoDrumChannels,
  },
  trackDna: generateTrackDna(),
  drumPatternFilters: {
    syncopationScore: 0.5,
    syncopationSpread: 0.1,
    density: 0.5,
    densitySpread: 0.1,
  },
  synth: {
    oscillatorType: 'sawtooth',
    attack: 0.01,
    decay: 0.16,
    sustain: 0.55,
    release: 0.28,
    filterFrequency: 1800,
    filterResonance: 1.2,
    bitCrusherBits: 8,
    bitCrusherDepth: 0.02,
  },
  mixer: createInitialMixerState(),
};

const listeners = new Set<Listener>();

const snapshotState = (): AppState => state;

export const getState = (): AppState => state;

const notifyListeners = (): void => {
  const snapshot = snapshotState();
  listeners.forEach((listener) => {
    listener(snapshot);
  });
};

export const updateState = (mutator: Mutator): void => {
  mutator(state);
  notifyListeners();
};

export const subscribe = (listener: Listener): Cleanup => {
  listeners.add(listener);
  listener(snapshotState());
  return () => {
    listeners.delete(listener);
  };
};

export const useStore = <T>(selector: Selector<T>): Accessor<T> => {
  let selected = selector(snapshotState());
  const [value, setValue] = createSignal(selected);
  const unsubscribe = subscribe((next) => {
    const nextSelected = selector(next);

    if (!deepEqual(selected, nextSelected)) {
      selected = nextSelected;
      setValue(() => nextSelected);
    }
  });
  onCleanup(unsubscribe);
  return value;
};

export const setTransportPlaying = (isPlaying: boolean): void => {
  updateState((draft) => {
    draft.transport = { ...draft.transport, isPlaying };
  });
};

export const setTransportStep = (step: number): void => {
  updateState((draft) => {
    draft.transport = { ...draft.transport, step };
  });
};

export const setTransportTick = (currentTick: number): void => {
  updateState((draft) => {
    draft.transport = { ...draft.transport, currentTick };
  });
};

export const setTransportPosition = (bar: number, beat: number, sixteenth: number): void => {
  updateState((draft) => {
    draft.transport = { ...draft.transport, bar, beat, sixteenth };
  });
};

export const setTransportBpm = (bpm: number): void => {
  updateState((draft) => {
    draft.transport = { ...draft.transport, bpm };
  });
};

export const setTransportTimeSignature = (timeSignature: [number, number]): void => {
  updateState((draft) => {
    draft.transport = { ...draft.transport, timeSignature };
  });
};

export const setTrackDna = (trackDna: TrackDna): void => {
  updateState((draft) => {
    draft.trackDna = trackDna;
  });
};

export const setDrumPatternFilters = (filters: Partial<DrumPatternFiltersState>): void => {
  updateState((draft) => {
    draft.drumPatternFilters = { ...draft.drumPatternFilters, ...filters };
  });
};

export const setVoicePattern = (pattern: PatternStep[]): void => {
  updateState((draft) => {
    draft.sequencer = {
      ...draft.sequencer,
      tracks: draft.sequencer.tracks.map((track) => {
        if (track.type !== 'notes') {
          return track;
        }

        return {
          ...track,
          clips: track.clips.map((clip, index) => {
            if (index !== 0) {
              return clip;
            }

            return {
              ...clip,
              startTick: 0,
              pattern,
            };
          }),
        };
      }),
    };
  });
};

export const setDrumPatternStep = (channelId: string, step: number, intensity: number): void => {
  updateState((draft) => {
    draft.sequencer = {
      ...draft.sequencer,
      drumChannels: draft.sequencer.drumChannels.map((channel) => {
        if (channel.id !== channelId) {
          return channel;
        }

        return {
          ...channel,
          pattern: channel.pattern.map((value, index) => {
            if (index !== step) {
              return value;
            }

            return intensity;
          }),
        };
      }),
    };
  });
};

export const setDrumChannels = (drumChannels: DrumChannel[]): void => {
  updateState((draft) => {
    draft.sequencer = {
      ...draft.sequencer,
      drumChannels,
    };
  });
};

export const setSynthState = (synth: Partial<SynthState>): void => {
  updateState((draft) => {
    draft.synth = { ...draft.synth, ...synth };
  });
};

export const setMixerChannelState = (
  channelId: string,
  settings: Partial<Pick<MixerChannelState, 'volume' | 'muted'>>,
): void => {
  updateState((draft) => {
    const channel = draft.mixer.channels[channelId];

    if (!channel) {
      return;
    }

    draft.mixer = {
      ...draft.mixer,
      channels: {
        ...draft.mixer.channels,
        [channelId]: {
          ...channel,
          ...settings,
        },
      },
    };
    writeStoredMixerState(draft.mixer);
  });
};
