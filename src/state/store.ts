import { createSignal, onCleanup, type Accessor } from 'solid-js';

export interface TransportState {
  bpm: number;
  timeSignature: [number, number];
  isPlaying: boolean;
  bar: number;
  beat: number;
  sixteenth: number;
  step: number;
}

export interface AppState {
  transport: TransportState;
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
    bar: 0,
    beat: 0,
    sixteenth: 0,
    step: 0,
  },
};

const listeners = new Set<Listener>();

export const getState = (): AppState => state;

const notifyListeners = (): void => {
  const snapshot: AppState = {
    transport: { ...state.transport },
  };
  listeners.forEach((listener) => listener(snapshot));
};

export const updateState = (mutator: Mutator): void => {
  mutator(state);
  notifyListeners();
};

export const subscribe = (listener: Listener): Cleanup => {
  listeners.add(listener);
  listener({ transport: { ...state.transport } });
  return () => {
    listeners.delete(listener);
  };
};

export const useStore = <T>(selector: Selector<T>): Accessor<T> => {
  const [value, setValue] = createSignal(selector({ transport: { ...state.transport } }));
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
