import type { Mode } from '@harmony/mode.type';

export const MajorPentatonicFunctions = [
  'tonic',
  'cadence',
  'stable',
  'predominant',
  'dominant',
  'tension',
] as const;

export const MajorPentatonicMode = {
  name: 'majorPentatonic',
  weight: 2,
  functions: MajorPentatonicFunctions,
  degrees: [
    { degree: 0, interval: 0, functions: ['tonic', 'cadence'] },
    { degree: 1, interval: 2, functions: ['stable', 'tension'] },
    { degree: 2, interval: 4, functions: ['stable', 'predominant'] },
    { degree: 3, interval: 7, functions: ['dominant', 'cadence'] },
    { degree: 4, interval: 9, functions: ['stable', 'tension'] },
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
} satisfies Mode<'majorPentatonic', typeof MajorPentatonicFunctions>;
