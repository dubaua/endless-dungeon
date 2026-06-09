import type { Mode } from '@harmony/mode.type';

export const MinorPentatonicFunctions = [
  'tonic',
  'cadence',
  'stable',
  'predominant',
  'dominant',
  'tension',
] as const;

export const MinorPentatonicMode = {
  name: 'minorPentatonic',
  weight: 2,
  functions: MinorPentatonicFunctions,
  degrees: [
    { degree: 0, interval: 0, functions: ['tonic', 'cadence'] },
    { degree: 1, interval: 3, functions: ['stable', 'tension'] },
    { degree: 2, interval: 5, functions: ['predominant', 'stable'] },
    { degree: 3, interval: 7, functions: ['dominant', 'cadence'] },
    { degree: 4, interval: 10, functions: ['dominant', 'tension'] },
  ],
  harmonyProfile: {
    theme: {
      generator: 'contour',
      functions: ['tonic', 'stable', 'predominant', 'dominant', 'tension'],
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
      functions: ['tension', 'predominant', 'dominant'],
      start: 'predominant',
      end: 'dominant',
    },
    figure: {
      generator: 'loop',
      blocks: ['stable', 'dominant'],
      variations: ['tension', 'cadence'],
    },
  },
} satisfies Mode<'minorPentatonic', typeof MinorPentatonicFunctions>;
