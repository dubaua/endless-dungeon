import type { Mode } from '@harmony/mode.type';

export const PersianMode: Mode = {
  name: 'persian',
  weight: 3,
  degrees: [
    { degree: 0, interval: 0, functions: ['tonic', 'cadence'] },
    { degree: 1, interval: 1, functions: ['tension', 'passing'] },
    { degree: 2, interval: 4, functions: ['stable', 'passing'] },
    { degree: 3, interval: 5, functions: ['predominant', 'tension'] },
    { degree: 4, interval: 6, functions: ['tension', 'passing'] },
    { degree: 5, interval: 8, functions: ['tension', 'passing'] },
    { degree: 6, interval: 11, functions: ['dominant', 'cadence'] },
  ],
};
