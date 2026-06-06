import type { Mode } from '@harmony/mode.type';

export const OrientalMode: Mode = {
  name: 'eastern-tritone',
  weight: 2,
  degrees: [
    { degree: 0, interval: 0, functions: ['tonic', 'cadence'] },
    { degree: 1, interval: 1, functions: ['passing', 'tension'] },
    { degree: 2, interval: 3, functions: ['tension', 'passing'] },
    { degree: 3, interval: 4, functions: ['passing', 'tension'] },
    { degree: 4, interval: 5, functions: ['dominant', 'cadence'] },
    { degree: 5, interval: 6, functions: ['tonic', 'cadence'] },
    { degree: 6, interval: 10, functions: ['tension', 'passing'] },
    { degree: 7, interval: 11, functions: ['passing', 'tension'] },
  ],
};
