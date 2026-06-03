import { initializeMixer } from './mixer';
import { initializeSynthRegistry } from './synths/registry';

export const initializeAudioEngine = (): void => {
  initializeMixer();
  initializeSynthRegistry();
};
