import { defineMode } from '@harmony/define-mode';
import type { Mode } from '@harmony/mode.type';

export const MajorPentatonicFunctions = [
  'tonic',
  'cadence',
  'stable',
  'predominant',
  'dominant',
  'tension',
] as const;

export const MajorPentatonicMode = defineMode({
  name: 'majorPentatonic',
  weight: 2,
  functions: MajorPentatonicFunctions,
  intervals: ['1P', '2M', '3M', '5P', '6M'],
  intervalFunctions: {
    '1P': ['tonic', 'cadence'],
    '2M': ['stable', 'tension'],
    '3M': ['stable', 'predominant'],
    '5P': ['dominant', 'cadence'],
    '6M': ['stable', 'tension'],
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
}) satisfies Mode<'majorPentatonic', typeof MajorPentatonicFunctions>;
