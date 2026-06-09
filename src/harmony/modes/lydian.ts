import { defineMode } from '@harmony/define-mode';
import type { Mode } from '@harmony/mode.type';

export const LydianFunctions = ['tonic', 'cadence', 'passing', 'tension', 'stable', 'dominant'] as const;

export const LydianMode = defineMode({
  name: 'lydian',
  weight: 4,
  functions: LydianFunctions,
  intervals: ['1P', '2M', '3M', '4A', '5P', '6M', '7M'],
  intervalFunctions: {
    '1P': ['tonic', 'cadence'],
    '2M': ['passing', 'tension'],
    '3M': ['stable', 'passing'],
    '4A': ['tension', 'passing'],
    '5P': ['dominant', 'cadence'],
    '6M': ['stable', 'passing'],
    '7M': ['tension', 'passing'],
  },
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
}) satisfies Mode<'lydian', typeof LydianFunctions>;
