import { defineMode } from '@harmony/define-mode';
import type { Mode } from '@harmony/mode.type';

export const LocrianFunctions = ['tonic', 'cadence', 'tension', 'passing', 'stable', 'predominant', 'avoid', 'dominant'] as const;

export const LocrianMode = defineMode({
  name: 'locrian',
  weight: 1,
  functions: LocrianFunctions,
  intervals: ['1P', '2m', '3m', '4P', '5d', '6m', '7m'],
  intervalFunctions: {
    '1P': ['tonic', 'cadence'],
    '2m': ['tension', 'passing'],
    '3m': ['stable', 'passing'],
    '4P': ['predominant', 'tension'],
    '5d': ['avoid', 'tension'],
    '6m': ['tension', 'passing'],
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
}) satisfies Mode<'locrian', typeof LocrianFunctions>;
