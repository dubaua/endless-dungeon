import type { Mode } from '@harmony/mode.type';
import type { ModeDegreeFunction } from '@harmony/mode-degree-function.type';

export const getModeFunctions = (mode: Mode): ModeDegreeFunction[] => {
  return [...mode.functions];
};
