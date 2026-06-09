import { defineMode } from '@harmony/define-mode';
import type { Mode } from '@harmony/mode.type';

export const MinorPentatonicFunctions = [
  'tonic',
  'cadence',
  'stable',
  'predominant',
  'dominant',
  'tension',
] as const;

export const MinorPentatonicMode = defineMode({
  name: 'minorPentatonic',
  weight: 2,
  functions: MinorPentatonicFunctions,
  intervals: ['1P', '3m', '4P', '5P', '7m'],
  intervalFunctions: {
    '1P': ['tonic', 'cadence'],
    '3m': ['stable', 'tension'],
    '4P': ['predominant', 'stable'],
    '5P': ['dominant', 'cadence'],
    '7m': ['dominant', 'tension'],
  },
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
}) satisfies Mode<'minorPentatonic', typeof MinorPentatonicFunctions>;
