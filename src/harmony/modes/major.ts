import type { Mode } from '@harmony/mode.type';

export const MajorMode: Mode = {
  name: 'major',
  weight: 5,
  degrees: [
    { degree: 0, interval: 0, functions: ['tonic', 'cadence'] },
    { degree: 1, interval: 2, functions: ['passing', 'tension'] },
    { degree: 2, interval: 4, functions: ['stable', 'passing'] },
    { degree: 3, interval: 5, functions: ['predominant', 'tension'] },
    { degree: 4, interval: 7, functions: ['dominant', 'cadence'] },
    { degree: 5, interval: 9, functions: ['stable', 'passing'] },
    { degree: 6, interval: 11, functions: ['tension', 'passing'] },
  ],
};
