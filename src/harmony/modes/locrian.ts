import type { Mode } from '@harmony/mode.type';

export const LocrianMode: Mode = {
  name: 'locrian',
  weight: 1,
  degrees: [
    { degree: 0, interval: 0, functions: ['tonic', 'cadence'] },
    { degree: 1, interval: 1, functions: ['tension', 'passing'] },
    { degree: 2, interval: 3, functions: ['stable', 'passing'] },
    { degree: 3, interval: 5, functions: ['predominant', 'tension'] },
    { degree: 4, interval: 6, functions: ['avoid', 'tension'] },
    { degree: 5, interval: 8, functions: ['tension', 'passing'] },
    { degree: 6, interval: 10, functions: ['dominant', 'cadence'] },
  ],
};
