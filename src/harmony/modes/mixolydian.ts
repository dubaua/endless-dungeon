import { defineMode } from '@harmony/define-mode';
import type { Mode } from '@harmony/mode.type';

export const MixolydianFunctions = ['tonic', 'cadence', 'passing', 'tension', 'stable', 'predominant', 'dominant'] as const;

export const MixolydianMode = defineMode({
  name: 'mixolydian',
  weight: 3,
  functions: MixolydianFunctions,
  intervals: ['1P', '2M', '3M', '4P', '5P', '6M', '7m'],
  intervalFunctions: {
    '1P': ['tonic', 'cadence'],
    '2M': ['passing', 'tension'],
    '3M': ['stable', 'passing'],
    '4P': ['predominant', 'tension'],
    '5P': ['dominant', 'cadence'],
    '6M': ['stable', 'passing'],
    '7m': ['dominant', 'cadence'],
  },
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
}) satisfies Mode<'mixolydian', typeof MixolydianFunctions>;
