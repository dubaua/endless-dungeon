import type { Mode } from '@harmony/mode.type';

export const LydianFunctions = ['tonic', 'cadence', 'passing', 'tension', 'stable', 'dominant'] as const;

export const LydianMode = {
  name: 'lydian',
  weight: 4,
  functions: LydianFunctions,
  degrees: [
    { degree: 0, interval: 0, functions: ['tonic', 'cadence'] },
    { degree: 1, interval: 2, functions: ['passing', 'tension'] },
    { degree: 2, interval: 4, functions: ['stable', 'passing'] },
    { degree: 3, interval: 6, functions: ['tension', 'passing'] },
    { degree: 4, interval: 7, functions: ['dominant', 'cadence'] },
    { degree: 5, interval: 9, functions: ['stable', 'passing'] },
    { degree: 6, interval: 11, functions: ['tension', 'passing'] },
  ],
  harmonyProfile: {
    theme: {
      generator: 'contour',
      functions: ['tonic', 'stable', 'tension', 'dominant', 'passing'],
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
      functions: ['tension', 'dominant', 'passing'],
      start: 'tension',
      end: 'dominant',
    },
    figure: {
      generator: 'loop',
      blocks: ['stable', 'passing'],
      variations: ['tension', 'dominant'],
    },
  },
} satisfies Mode<'lydian', typeof LydianFunctions>;
