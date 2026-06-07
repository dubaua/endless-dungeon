import type { Mode } from '@harmony/mode.type';

export const PersianFunctions = ['tonic', 'cadence', 'tension', 'passing', 'stable', 'predominant', 'dominant'] as const;

export const PersianMode = {
  name: 'persian',
  weight: 3,
  functions: PersianFunctions,
  degrees: [
    { degree: 0, interval: 0, functions: ['tonic', 'cadence'] },
    { degree: 1, interval: 1, functions: ['tension', 'passing'] },
    { degree: 2, interval: 4, functions: ['stable', 'passing'] },
    { degree: 3, interval: 5, functions: ['predominant', 'tension'] },
    { degree: 4, interval: 6, functions: ['tension', 'passing'] },
    { degree: 5, interval: 8, functions: ['tension', 'passing'] },
    { degree: 6, interval: 11, functions: ['dominant', 'cadence'] },
  ],
  harmonyProfile: {
    theme: {
      generator: 'contour',
      functions: ['tonic', 'stable', 'predominant', 'dominant', 'passing', 'tension'],
      start: 'tonic',
      end: 'dominant',
      midCadence: 'cadence',
    },
    hook: {
      generator: 'loop',
      blocks: ['tonic', 'dominant'],
      variations: ['cadence', 'stable'],
    },
    release: {
      generator: 'contour',
      functions: ['tonic', 'cadence', 'stable'],
      start: 'dominant',
      end: 'tonic',
      midCadence: 'cadence',
    },
    tension: {
      generator: 'contour',
      functions: ['tension', 'predominant', 'dominant', 'passing'],
      start: 'predominant',
      end: 'dominant',
    },
    figure: {
      generator: 'loop',
      blocks: ['stable', 'passing'],
      variations: ['tension', 'dominant'],
    },
  },
} satisfies Mode<'persian', typeof PersianFunctions>;
