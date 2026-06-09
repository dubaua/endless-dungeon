import { defineMode } from '@harmony/define-mode';
import type { Mode } from '@harmony/mode.type';

export const OrientalFunctions = ['tonic', 'cadence', 'passing', 'tension', 'dominant'] as const;

export const OrientalMode = defineMode({
  name: 'oriental',
  weight: 2,
  functions: OrientalFunctions,
  intervals: ['1P', '2m', '3m', '3M', '4P', '4A', '7m', '7M'],
  intervalFunctions: {
    '1P': ['tonic', 'cadence'],
    '2m': ['passing', 'tension'],
    '3m': ['tension', 'passing'],
    '3M': ['passing', 'tension'],
    '4P': ['dominant', 'cadence'],
    '4A': ['tonic', 'cadence'],
    '7m': ['tension', 'passing'],
    '7M': ['passing', 'tension'],
  },
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
}) satisfies Mode<'oriental', typeof OrientalFunctions>;
