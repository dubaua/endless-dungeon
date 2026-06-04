import type { DramFamily } from './drum-layer-pattern.type';

export const KickPrimaryFamilies: DramFamily[] = [
  {
    name: 'straight',
    genres: ['house', 'techno', 'electro', 'disco', 'dembow', 'reggaeton', 'hardstyle'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'straightFour',
          pattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          syncopationGrade: 0,
          genres: ['house', 'techno', 'electro', 'disco', 'dembow', 'reggaeton', 'hardstyle'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'drivingEighths',
          pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          syncopationGrade: 0,
          genres: ['techno', 'hardstyle', 'punk', 'metal', 'electro', 'disco'],
        },
      },
    ],
  },
  {
    name: 'halfTime',
    genres: ['dubstep', 'trap', 'halfstep', 'drumAndBass', 'jungle', 'hipHop'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'halfTimeAnchor',
          pattern: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 0,
          genres: ['dubstep', 'trap', 'halfstep', 'drumAndBass', 'jungle', 'hipHop'],
        },
      },
    ],
  },
  {
    name: 'techHouse',
    genres: ['techHouse', 'house', 'electro', 'breaks'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'techHouseLight1',
          pattern: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
          syncopationGrade: 1,
          genres: ['techHouse', 'house', 'electro', 'breaks'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'techHouseLight2',
          pattern: [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 1,
          genres: ['techHouse', 'house', 'electro', 'breaks'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'techHousePair1',
          pattern: [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
          syncopationGrade: 1,
          genres: ['techHouse', 'house', 'electro', 'breaks'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'techHousePair2',
          pattern: [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 1,
          genres: ['techHouse', 'house', 'electro', 'breaks'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'techHousePairAndTripple',
          pattern: [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
          syncopationGrade: 1,
          genres: ['techHouse', 'house', 'electro', 'breaks'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'lateBarDrive',
          pattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
          syncopationGrade: 2,
          genres: ['techHouse', 'house', 'breaks', 'electro'],
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
          name: 'garageSkip',
          pattern: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          syncopationGrade: 2,
          genres: ['ukGarage', 'twoStepGarage', 'breaks', 'futureGarage'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'garageSkip3',
          pattern: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
          syncopationGrade: 2,
          genres: ['ukGarage', 'twoStepGarage', 'breaks', 'futureGarage'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'garageSkip2',
          pattern: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
          syncopationGrade: 2,
          genres: ['ukGarage', 'twoStepGarage', 'breaks', 'futureGarage'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'garageSkip2Long',
          pattern: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0],
          syncopationGrade: 2,
          genres: ['ukGarage', 'twoStepGarage', 'breaks', 'futureGarage'],
        },
      },
    ],
  },
  {
    name: 'breakbeat',
    genres: ['breakbeat', 'breaks', 'jungle', 'funk', 'hipHop'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'oneThreeFour',
          pattern: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          syncopationGrade: 1,
          genres: ['breakbeat', 'breaks', 'hipHop', 'boomBap', 'electro'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'breakbeatAnchorA',
          pattern: [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          syncopationGrade: 2,
          genres: ['breakbeat', 'breaks', 'jungle', 'funk', 'hipHop'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'breakbeatAnchorB',
          pattern: [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
          syncopationGrade: 2,
          genres: ['breakbeat', 'breaks', 'drumAndBass', 'jungle'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'syncopatedPush',
          pattern: [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
          syncopationGrade: 3,
          genres: ['breaks', 'ukGarage', 'twoStepGarage', 'electro', 'funk'],
        },
      },
    ],
  },
];
