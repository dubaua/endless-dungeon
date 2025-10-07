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

export const updateState = (mutator: Mutator): void => {
  mutator(state);
  listeners.forEach((listener) => listener(state));
};

export const subscribe = (listener: Listener): Cleanup => {
  listeners.add(listener);
  listener(state);
  return () => {
    listeners.delete(listener);
  };
};

export const useStore = <T>(selector: Selector<T>): Accessor<T> => {
  const [value, setValue] = createSignal(selector(state));
  const unsubscribe = subscribe((next) => {
    setValue(() => selector(next));
  });
  onCleanup(unsubscribe);
  return value;
};

export const setTransportPlaying = (isPlaying: boolean): void => {
  updateState((draft) => {
    draft.transport.isPlaying = isPlaying;
  });
};

export const setTransportStep = (step: number): void => {
  updateState((draft) => {
    draft.transport.step = step;
  });
};

export const setTransportPosition = (
  bar: number,
  beat: number,
  sixteenth: number,
): void => {
  updateState((draft) => {
    draft.transport.bar = bar;
    draft.transport.beat = beat;
    draft.transport.sixteenth = sixteenth;
  });
};

export const setTransportBpm = (bpm: number): void => {
  updateState((draft) => {
    draft.transport.bpm = bpm;
  });
};

export const setTransportTimeSignature = (timeSignature: [number, number]): void => {
  updateState((draft) => {
    draft.transport.timeSignature = timeSignature;
  });
};
