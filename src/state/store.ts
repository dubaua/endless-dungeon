import { createSignal, onCleanup, type Accessor } from 'solid-js';

import { demoTracks, type SequencerState } from '../sequencer';

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
  masterVolume: number;
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
}

type Listener = (state: AppState) => void;
type Mutator = (state: AppState) => void;

type Selector<T> = (state: AppState) => T;

type Cleanup = () => void;

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
      noteLanes: track.noteLanes?.map((lane) => ({ ...lane })),
      clips: track.clips.map((clip) => ({
        ...clip,
        notes: clip.notes.map((note) => ({ ...note })),
      })),
    })),
  },
  synth: { ...state.synth },
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
  const [value, setValue] = createSignal(selector(snapshotState()));
  const unsubscribe = subscribe((next) => {
    setValue(() => selector(next));
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

export const setTransportPosition = (
  bar: number,
  beat: number,
  sixteenth: number,
): void => {
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
