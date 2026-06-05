import { initializeMixer } from '@audio/mixer';
import { initializeSynthRegistry } from '@audio/synths/registry';

export const initializeAudioEngine = (): void => {
  initializeMixer();
  initializeSynthRegistry();
};
