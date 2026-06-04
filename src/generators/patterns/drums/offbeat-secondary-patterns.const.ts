import type { DramFamily } from './drum-layer-pattern.type';

export const OffbeatSecondaryFamilies: DramFamily[] = [
  {
    name: 'empty',
    genres: ['house', 'techno', 'dubstep', 'trap', 'dembow', 'breaks', 'ukGarage'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'empty',
          pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 0,
          genres: ['house', 'techno', 'dubstep', 'trap', 'dembow', 'breaks', 'ukGarage'],
        },
      },
    ],
  },
  {
    name: 'ghost',
    genres: ['breakbeat', 'breaks', 'drumAndBass', 'jungle', 'funk', 'electro'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'ghostBeforeBackbeat',
          pattern: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
          syncopationGrade: 3,
          genres: ['breakbeat', 'breaks', 'drumAndBass', 'jungle', 'funk'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'ghostAfterBackbeat',
          pattern: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
          syncopationGrade: 3,
          genres: ['breakbeat', 'breaks', 'funk', 'electro'],
        },
      },
    ],
  },
  {
    name: 'clapAfter',
    genres: ['house', 'techHouse', 'techno', 'electro'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'doubleClapAfter',
          pattern: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          syncopationGrade: 2,
          genres: ['house', 'techHouse', 'techno', 'electro'],
        },
      },
    ],
  },
  {
    name: 'answer',
    genres: ['electro', 'funk', 'breaks', 'techHouse', 'house'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'eighthAnswer',
          pattern: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          syncopationGrade: 1,
          genres: ['electro', 'funk', 'breaks', 'techHouse'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'lateAnswer',
          pattern: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          syncopationGrade: 2,
          genres: ['house', 'techHouse', 'breaks', 'electro'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'earlyAnswer',
          pattern: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
          syncopationGrade: 3,
          genres: ['breaks', 'ukGarage', 'twoStepGarage', 'jungle'],
        },
      },
    ],
  },
  {
    name: 'sixteenthChatter',
    genres: ['jungle', 'drumAndBass', 'breaks', 'ukGarage'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'sixteenthChatterA',
          pattern: [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 4,
          genres: ['jungle', 'drumAndBass', 'breaks'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'sixteenthChatterB',
          pattern: [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 4,
          genres: ['jungle', 'drumAndBass', 'breaks', 'ukGarage'],
        },
      },
    ],
  },
  {
    name: 'fill',
    genres: ['breaks', 'jungle', 'drumAndBass', 'electro'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'endBarFill!',
          pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
          syncopationGrade: 4,
          genres: ['breaks', 'jungle', 'drumAndBass', 'electro'],
        },
      },
    ],
  },
  {
    name: 'garage',
    genres: ['ukGarage', 'twoStepGarage', 'futureGarage', 'breaks'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'garageGhost',
          pattern: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
          syncopationGrade: 3,
          genres: ['ukGarage', 'twoStepGarage', 'futureGarage', 'breaks'],
        },
      },
    ],
  },
  {
    name: 'busy',
    genres: ['jungle', 'drumAndBass', 'breaks', 'experimentalBreaks'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'busyGhost',
          pattern: [0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
          syncopationGrade: 4,
          genres: ['jungle', 'drumAndBass', 'breaks', 'experimentalBreaks'],
        },
      },
    ],
  },
];
