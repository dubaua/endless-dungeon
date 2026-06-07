export const HarmonyBlockFunctions = [
  'theme',
  'hook',
  'release',
  'tension',
  'figure',
] as const;

export type HarmonyBlockFunction = (typeof HarmonyBlockFunctions)[number];
