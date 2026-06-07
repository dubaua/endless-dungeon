import type { Mode } from '@harmony/mode.type';

export const defineModes = <const Modes extends {
  [Name in keyof Modes]: Mode<Name & string>;
}>(
  modes: Modes,
): Modes => modes;
