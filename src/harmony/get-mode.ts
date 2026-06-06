import { Modes } from '@/harmony/modes.const';
import type { Mode, ModeName } from '@harmony/mode.type';

/**
 * Returns the mode definition by name and fails if it is not registered.
 * Keeps TrackDna free from expanded harmony data: DNA stores the name, harmony resolves it.
 */
export const getMode = (modeName: ModeName, modes: Record<string, Mode> = Modes): Mode => {
  const mode = modes[modeName];

  if (!mode) {
    throw new Error(`Unknown mode: ${modeName}`);
  }

  return mode;
};
