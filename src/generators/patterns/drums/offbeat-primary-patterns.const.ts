import type { DramFamily } from './drum-layer-pattern.type';

export const OffbeatPrimaryFamilies: DramFamily[] = [
  {
    name: 'backbeat',
    genres: ['house', 'techno', 'breakbeat', 'breaks', 'hipHop', 'funk', 'electro'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'backbeat',
          pattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          syncopationGrade: 0,
          genres: ['house', 'techno', 'breakbeat', 'breaks', 'hipHop', 'funk', 'electro'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'fourAndEight',
          pattern: [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 0,
          genres: ['breakbeat', 'hipHop', 'electro', 'funk'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'backbeatWithLateAccent',
          pattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
          syncopationGrade: 1,
          genres: ['house', 'techHouse', 'breaks', 'electro'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'busyBackbeat',
          pattern: [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
          syncopationGrade: 2,
          genres: ['breakbeat', 'breaks', 'funk', 'electro'],
        },
      },
    ],
  },
  {
    name: 'halfstep',
    genres: ['dubstep', 'trap', 'halfstep', 'drumAndBass'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'halfstep',
          pattern: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 0,
          genres: ['dubstep', 'trap', 'halfstep', 'drumAndBass'],
        },
      },
    ],
  },
  {
    name: 'dembow',
    genres: ['dembow', 'reggaeton', 'dancehall', 'afrobeat'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'dembowAnswer',
          pattern: [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
          syncopationGrade: 3,
          genres: ['dembow', 'reggaeton', 'dancehall', 'afrobeat'],
        },
      },
    ],
  },
  {
    name: 'garage',
    genres: ['ukGarage', 'twoStepGarage', 'breaks', 'futureGarage'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'garageAnswer',
          pattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          syncopationGrade: 2,
          genres: ['ukGarage', 'twoStepGarage', 'breaks', 'futureGarage'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'twoStepAnswer',
          pattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          syncopationGrade: 2,
          genres: ['twoStepGarage', 'ukGarage', 'breaks'],
        },
      },
    ],
  },
  {
    name: 'shiftedBackbeat',
    genres: ['breaks', 'jungle', 'drumAndBass', 'ukGarage', 'electro', 'funk'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'earlyBackbeat',
          pattern: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
          syncopationGrade: 3,
          genres: ['breaks', 'jungle', 'drumAndBass', 'ukGarage'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'lateBackbeat',
          pattern: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
          syncopationGrade: 3,
          genres: ['breaks', 'electro', 'ukGarage', 'funk'],
        },
      },
    ],
  },
  {
    name: 'offbeatEighths',
    genres: ['electro', 'funk', 'techno', 'breaks'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'offbeatEighths',
          pattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
          syncopationGrade: 1,
          genres: ['electro', 'funk', 'techno', 'breaks'],
        },
      },
    ],
  },
  {
    name: 'syncopated',
    genres: ['breaks', 'jungle', 'drumAndBass', 'ukGarage'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'syncopatedAnswer',
          pattern: [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
          syncopationGrade: 4,
          genres: ['breaks', 'jungle', 'drumAndBass', 'ukGarage'],
        },
      },
    ],
  },
];
