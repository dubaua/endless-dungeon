import { createMemo, createSignal, onCleanup, type Accessor } from 'solid-js';
import * as Tone from 'tone';

export interface LFOConfig {
  minPeriodSeconds: number;
  maxPeriodSeconds: number;
  initialPeriodSeconds?: number;
  type?: Tone.ToneOscillatorType;
}

export interface LFOController {
  readonly periodSeconds: Accessor<number>;
  readonly frequencyHz: Accessor<number>;
  readonly lfo: Tone.LFO;
  setPeriodSeconds: (period: number) => void;
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export const createLFOController = ({
  minPeriodSeconds,
  maxPeriodSeconds,
  initialPeriodSeconds,
  type = 'sine',
}: LFOConfig): LFOController => {
  if (minPeriodSeconds <= 0) {
    throw new Error('minPeriodSeconds must be greater than 0');
  }

  if (maxPeriodSeconds <= minPeriodSeconds) {
    throw new Error('maxPeriodSeconds must be greater than minPeriodSeconds');
  }

  const initialPeriod = clamp(initialPeriodSeconds ?? minPeriodSeconds, minPeriodSeconds, maxPeriodSeconds);

  const [periodSeconds, setPeriodSecondsSignal] = createSignal(initialPeriod);
  const lfo = new Tone.LFO({
    type,
    frequency: 1 / initialPeriod,
  }).start();

  const frequencyHz = createMemo(() => 1 / periodSeconds());

  const setPeriodSeconds = (period: number): void => {
    const nextPeriod = clamp(period, minPeriodSeconds, maxPeriodSeconds);
    setPeriodSecondsSignal(nextPeriod);
    lfo.frequency.value = 1 / nextPeriod;
  };

  onCleanup(() => {
    lfo.dispose();
  });

  return {
    periodSeconds,
    frequencyHz,
    lfo,
    setPeriodSeconds,
  };
};
