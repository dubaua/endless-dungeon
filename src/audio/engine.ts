import { initializeDrums } from './drums';
import { initializeVoice } from './voice';

export const initializeAudioEngine = (): void => {
  initializeVoice();
  initializeDrums();
};
