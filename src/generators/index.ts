import { createMelodicLfo, type MelodicLfo } from './melodic-lfo';
import { setMelodicGeneratorValues } from '../state/store';

let initialized = false;
let melodicLfo: MelodicLfo | null = null;
let rafId: number | null = null;

const updateLoop = (): void => {
  if (!melodicLfo) {
    return;
  }

  const value = melodicLfo.getValue();
  const inverted = melodicLfo.getInvertedValue();
  setMelodicGeneratorValues(value, inverted);

  rafId = window.requestAnimationFrame(updateLoop);
};

export const initializeGenerators = (): void => {
  if (initialized) {
    return;
  }

  melodicLfo = createMelodicLfo();
  initialized = true;
  updateLoop();
};

export const disposeGenerators = (): void => {
  if (!initialized) {
    return;
  }

  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }

  melodicLfo?.dispose();
  melodicLfo = null;
  initialized = false;
};
