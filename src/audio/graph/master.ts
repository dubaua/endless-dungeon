import * as Tone from 'tone';

import { clamp } from '@utils/clamp';

const MIN_VOLUME_DB = -60;

export interface MasterOutput {
  input: Tone.Gain;
  setState: (volume: number, pan: number, muted: boolean) => void;
  dispose: () => void;
}

const volumeToDb = (volume: number): number => {
  const clamped = clamp(volume, 0, 1);
  if (clamped === 0) {
    return MIN_VOLUME_DB;
  }

  return Tone.gainToDb(clamped);
};

export const createMasterOutput = (volume: number, pan: number, muted: boolean): MasterOutput => {
  const input = new Tone.Gain(muted ? 0 : 1);
  const panner = new Tone.Panner(clamp(pan, -1, 1));
  const output = new Tone.Volume(volumeToDb(volume)).toDestination();

  input.connect(panner);
  panner.connect(output);

  return {
    input,
    setState: (nextVolume, nextPan, nextMuted) => {
      input.gain.value = nextMuted ? 0 : 1;
      panner.pan.value = clamp(nextPan, -1, 1);
      output.volume.value = volumeToDb(nextVolume);
    },
    dispose: () => {
      input.dispose();
      panner.dispose();
      output.dispose();
    },
  };
};
