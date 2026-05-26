import * as Tone from 'tone';

import { clamp } from '../../utils/clamp';

const MIN_VOLUME_DB = -60;

export interface MasterOutput {
  input: Tone.Volume;
  setVolume: (volume: number) => void;
  dispose: () => void;
}

const volumeToDb = (volume: number): number => {
  const clamped = clamp(volume, 0, 1);
  if (clamped === 0) {
    return MIN_VOLUME_DB;
  }

  return Tone.gainToDb(clamped);
};

export const createMasterOutput = (volume: number): MasterOutput => {
  const input = new Tone.Volume(volumeToDb(volume)).toDestination();

  return {
    input,
    setVolume: (nextVolume) => {
      input.volume.value = volumeToDb(nextVolume);
    },
    dispose: () => {
      input.dispose();
    },
  };
};
