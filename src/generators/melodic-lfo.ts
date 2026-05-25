import * as Tone from 'tone';

export interface MelodicLfo {
  readonly lfo: Tone.LFO;
  getValue: () => number;
  getInvertedValue: () => number;
  dispose: () => void;
}

type LfoWithValue = Tone.LFO & { value: number };

export const createMelodicLfo = (): MelodicLfo => {
  const lfo = new Tone.LFO({
    frequency: 0.22,
    type: 'sine',
    min: -1,
    max: 1,
  }) as LfoWithValue;

  lfo.start();

  const getValue = (): number => lfo.value;
  const getInvertedValue = (): number => -getValue();

  const dispose = (): void => {
    lfo.dispose();
  };

  return {
    lfo,
    getValue,
    getInvertedValue,
    dispose,
  };
};
