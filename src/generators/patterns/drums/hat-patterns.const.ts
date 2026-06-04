import type { HatFamily } from './drum-layer-pattern.type';

export const HatFamilies: HatFamily[] = [
  {
    name: 'closedStraight',
    genres: ['house', 'techno', 'electro', 'disco', 'breaks'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'closedEighths',
          closeHatPattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          openHatPattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 0,
          genres: ['house', 'techno', 'electro', 'disco', 'breaks'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'closedSixteenths',
          closeHatPattern: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          openHatPattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 0,
          genres: ['techno', 'electro', 'breaks', 'drumAndBass'],
        },
      },
    ],
  },
  {
    name: 'openOffbeat',
    genres: ['house', 'techHouse', 'techno', 'disco'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'openOffbeats',
          closeHatPattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          openHatPattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
          syncopationGrade: 1,
          genres: ['house', 'techHouse', 'techno', 'disco'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'openLateOffbeats',
          closeHatPattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          openHatPattern: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          syncopationGrade: 1,
          genres: ['techHouse', 'house', 'electro'],
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
          name: 'garageSkips',
          closeHatPattern: [1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0],
          openHatPattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          syncopationGrade: 3,
          genres: ['ukGarage', 'twoStepGarage', 'futureGarage', 'breaks'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'garageShuffle',
          closeHatPattern: [1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0],
          openHatPattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          syncopationGrade: 3,
          genres: ['ukGarage', 'twoStepGarage', 'futureGarage'],
        },
      },
    ],
  },
  {
    name: 'breaks',
    genres: ['breakbeat', 'breaks', 'jungle', 'drumAndBass', 'funk'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'brokenEighths',
          closeHatPattern: [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
          openHatPattern: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 2,
          genres: ['breakbeat', 'breaks', 'funk'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'jungleTicks',
          closeHatPattern: [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
          openHatPattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          syncopationGrade: 4,
          genres: ['jungle', 'drumAndBass', 'breaks'],
        },
      },
    ],
  },
  {
    name: 'sparse',
    genres: ['trap', 'dubstep', 'halfstep', 'hipHop'],
    weightedPatterns: [
      {
        weight: 1,
        value: {
          name: 'sparseEighths',
          closeHatPattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          openHatPattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          syncopationGrade: 1,
          genres: ['trap', 'dubstep', 'halfstep', 'hipHop'],
        },
      },
      {
        weight: 1,
        value: {
          name: 'halfstepHat',
          closeHatPattern: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
          openHatPattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          syncopationGrade: 2,
          genres: ['dubstep', 'trap', 'halfstep'],
        },
      },
    ],
  },
];
