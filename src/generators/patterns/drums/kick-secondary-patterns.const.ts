import type { DramFamily } from './drum-layer-pattern.type';

export const KickSecondaryFamilies: DramFamily[] = [
  {
    name: 'empty',
    genres: ['house', 'techno', 'dubstep', 'trap', 'dembow', 'reggaeton', 'breaks'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'empty',
          pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 0,
          genres: ['house', 'techno', 'dubstep', 'trap', 'dembow', 'reggaeton', 'breaks'],
        },
      },
    ],
  },
  {
    name: 'eighthPickup',
    genres: ['techHouse', 'house', 'electro', 'breakbeat', 'funk'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'earlyEighthPickup',
          pattern: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 1,
          genres: ['techHouse', 'house', 'electro', 'breakbeat'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'lateEighthPickup',
          pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          syncopationGrade: 1,
          genres: ['techHouse', 'house', 'dembow', 'reggaeton', 'breaks'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'doubleEighthPickup',
          pattern: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          syncopationGrade: 1,
          genres: ['techHouse', 'electro', 'breaks', 'funk'],
        },
      },
    ],
  },
  {
    name: 'preQuarter',
    genres: ['breaks', 'ukGarage', 'twoStepGarage', 'jungle', 'drumAndBass'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'preSecondQuarter',
          pattern: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 3,
          genres: ['breaks', 'ukGarage', 'twoStepGarage', 'jungle'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'preFourthQuarter',
          pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
          syncopationGrade: 3,
          genres: ['breaks', 'ukGarage', 'twoStepGarage', 'drumAndBass'],
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
          name: 'garageDoubleSkip',
          pattern: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          syncopationGrade: 2,
          genres: ['ukGarage', 'twoStepGarage', 'breaks', 'futureGarage'],
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
          name: 'dembowExtraKick',
          pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          syncopationGrade: 1,
          genres: ['dembow', 'reggaeton', 'dancehall', 'afrobeat'],
        },
      },
    ],
  },
  {
    name: 'sixteenthFlick',
    genres: ['jungle', 'drumAndBass', 'breaks', 'ukGarage'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'firstSixteenthFlick',
          pattern: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 4,
          genres: ['jungle', 'drumAndBass', 'breaks', 'ukGarage'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'thirdSixteenthFlick',
          pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 4,
          genres: ['jungle', 'drumAndBass', 'breaks', 'ukGarage'],
        },
      },
    ],
  },
  {
    name: 'endBar',
    genres: ['techHouse', 'breaks', 'ukGarage', 'electro'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'endBarPush',
          pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          syncopationGrade: 2,
          genres: ['techHouse', 'breaks', 'ukGarage', 'electro'],
        },
      },
    ],
  },
  {
    name: 'busyBroken',
    genres: ['breaks', 'jungle', 'drumAndBass', 'ukGarage'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'busyBrokenHelper',
          pattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
          syncopationGrade: 4,
          genres: ['breaks', 'jungle', 'drumAndBass', 'ukGarage'],
        },
      },
    ],
  },
];
