import type { Mode } from '@harmony/mode.type';

export const OrientalFunctions = ['tonic', 'cadence', 'passing', 'tension', 'dominant'] as const;

export const OrientalMode = {
  name: 'oriental',
  weight: 2,
  functions: OrientalFunctions,
  degrees: [
    { degree: 0, interval: 0, functions: ['tonic', 'cadence'] },
    { degree: 1, interval: 1, functions: ['passing', 'tension'] },
    { degree: 2, interval: 3, functions: ['tension', 'passing'] },
    { degree: 3, interval: 4, functions: ['passing', 'tension'] },
    { degree: 4, interval: 5, functions: ['dominant', 'cadence'] },
    { degree: 5, interval: 6, functions: ['tonic', 'cadence'] },
    { degree: 6, interval: 10, functions: ['tension', 'passing'] },
    { degree: 7, interval: 11, functions: ['passing', 'tension'] },
  ],
  harmonyProfile: {
    theme: {
      generator: 'contour',
      functions: ['tonic', 'passing', 'tension', 'dominant'],
      start: 'tonic',
      end: 'dominant',
      midCadence: 'cadence',
    },
    hook: {
      generator: 'loop',
      blocks: ['tonic', 'dominant'],
      variations: ['passing', 'tension'],
    },
    release: {
      generator: 'contour',
      functions: ['tonic', 'cadence', 'dominant'],
      start: 'dominant',
      end: 'tonic',
      midCadence: 'cadence',
    },
    tension: {
      generator: 'contour',
      functions: ['tension', 'dominant', 'passing'],
      start: 'tension',
      end: 'dominant',
    },
    figure: {
      generator: 'loop',
      blocks: ['passing', 'tension'],
      variations: ['dominant'],
    },
  },
} satisfies Mode<'oriental', typeof OrientalFunctions>;
