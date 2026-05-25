import { createSignal, onCleanup, type Accessor } from 'solid-js';

import { demoDrumChannels, demoTracks, type DrumVoiceKey, type SequencerState } from '../sequencer';

export type OscillatorType = 'sine' | 'triangle' | 'sawtooth' | 'square';
export type DrumNoiseType = 'white' | 'pink' | 'brown';
export type DrumFilterType = 'lowpass' | 'highpass' | 'bandpass';

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
  masterVolume: number;
}

export interface DrumVoiceState {
  noiseType: DrumNoiseType;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  filterType: DrumFilterType;
  filterFrequency: number;
  filterResonance: number;
  bitCrusherBits: number;
  bitCrusherDepth: number;
}

export type DrumVoicesState = Record<DrumVoiceKey, DrumVoiceState>;

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

export interface GeneratorsState {
  melodic: {
    value: number;
    inverted: number;
  };
}

export interface AppState {
  transport: TransportState;
  generators: GeneratorsState;
  sequencer: SequencerState;
  synth: SynthState;
  drumVoices: DrumVoicesState;
  mixer: MixerState;
}

type Listener = (state: AppState) => void;
type Mutator = (state: AppState) => void;

type Selector<T> = (state: AppState) => T;

type Cleanup = () => void;

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
  generators: {
    melodic: { value: 0, inverted: 0 },
  },
  sequencer: {
    tracks: demoTracks,
    drumChannels: demoDrumChannels,
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
    masterVolume: 0.75,
  },
  drumVoices: {
    kick: {
      noiseType: 'white',
      attack: 0.001,
      decay: 0.08,
      sustain: 0,
      release: 0.001,
      filterType: 'lowpass',
      filterFrequency: 240,
      filterResonance: 5,
      bitCrusherBits: 4,
      bitCrusherDepth: 0.0,
    },
    // decay is intensity
    // less bits -> more decay
    // depth is character range
    snare: {
      noiseType: 'white',
      attack: 0.001,
      decay: 0.6,
      sustain: 1,
      release: 0.1,
      filterType: 'bandpass',
      filterFrequency: 450,
      filterResonance: 0.2,
      bitCrusherBits: 3, // 2..4
      bitCrusherDepth: 0.05, // 0.01 .. 0.1
    },
    // volume is intensity
    closedHat: {
      noiseType: 'white', // не актуально
      attack: 0.001,
      decay: 0.035, // 0.02 .. 0.15
      sustain: 0,
      release: 0.001,
      filterType: 'highpass',
      filterFrequency: 7200,
      filterResonance: 0.7,
      bitCrusherBits: 3, // 1..4
      bitCrusherDepth: 0.02, // 0.013 .. 0.055
    },
    openHat: {
      noiseType: 'white', // не актуально
      attack: 0.001,
      decay: 0.18,
      sustain: 0,
      release: 0.28,
      filterType: 'highpass',
      filterFrequency: 5600,
      filterResonance: 0.9,
      bitCrusherBits: 3,
      bitCrusherDepth: 0.025,
    },
    crash: {
      noiseType: 'white',
      attack: 0.001,
      decay: 0.55,
      sustain: 0,
      release: 1.2,
      filterType: 'highpass',
      filterFrequency: 3600,
      filterResonance: 0.55,
      bitCrusherBits: 2,
      bitCrusherDepth: 0.035,
    },
  },
  mixer: {
    channels: Object.fromEntries(
      demoDrumChannels.map((channel) => [
        channel.outputChannelId,
        {
          id: channel.outputChannelId,
          name: channel.name,
          volume: 0.85,
          muted: true,
          groupId: channel.groupId,
        },
      ]),
    ),
  },
};

const listeners = new Set<Listener>();

const snapshotState = (): AppState => ({
  transport: { ...state.transport },
  generators: {
    melodic: { ...state.generators.melodic },
  },
  sequencer: {
    tracks: state.sequencer.tracks.map((track) => ({
      ...track,
      clips: track.clips.map((clip) => ({
        ...clip,
        pattern: clip.pattern.map(([note, stepCount]) => [note, stepCount]),
      })),
    })),
    drumChannels: state.sequencer.drumChannels.map((channel) => ({
      ...channel,
      pattern: [...channel.pattern],
    })),
  },
  synth: { ...state.synth },
  drumVoices: {
    kick: { ...state.drumVoices.kick },
    snare: { ...state.drumVoices.snare },
    closedHat: { ...state.drumVoices.closedHat },
    openHat: { ...state.drumVoices.openHat },
    crash: { ...state.drumVoices.crash },
  },
  mixer: {
    channels: Object.fromEntries(
      Object.entries(state.mixer.channels).map(([id, channel]) => [id, { ...channel }]),
    ),
  },
});

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

export const setMelodicGeneratorValues = (value: number, inverted: number): void => {
  updateState((draft) => {
    draft.generators = {
      ...draft.generators,
      melodic: { value, inverted },
    };
  });
};

export const setSynthState = (synth: Partial<SynthState>): void => {
  updateState((draft) => {
    draft.synth = { ...draft.synth, ...synth };
  });
};

export const setDrumVoiceState = (voice: DrumVoiceKey, settings: Partial<DrumVoiceState>): void => {
  updateState((draft) => {
    draft.drumVoices = {
      ...draft.drumVoices,
      [voice]: {
        ...draft.drumVoices[voice],
        ...settings,
      },
    };
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
  });
};
