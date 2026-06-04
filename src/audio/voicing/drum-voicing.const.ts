import type { Range } from './range.type';

type VoicingSetting = number | Range;

export const KickVoicing = {
  decay: { min: 0.3, max: 0.5 },
  pitchStart: 65.4,
  filterFrequency: { min: 60, max: 220 },
  filterResonance: { min: 2, max: 10 },
  bitCrusherBits: { min: 2, max: 4 },
  bitCrusherDepth: { min: 0.01, max: 0.1 },
} satisfies Record<string, VoicingSetting>;

export const SnareVoicing = {
  decay: { min: 0.08, max: 0.25 },
  bitCrusherBits: { min: 2, max: 4 },
  bitCrusherDepth: { min: 0.02, max: 0.1 },
} satisfies Record<string, Range>;

export const ClapVoicing = {
  decay: { min: 0.04, max: 0.5 },
  burstCount: { min: 3, max: 5 },
  burstSpread: { min: 0.01, max: 0.05 },
  bitCrusherBits: { min: 2, max: 5 },
  bitCrusherDepth: { min: 0.04, max: 0.18 },
} satisfies Record<string, Range>;

export const CymbalVoicing = {
  filterFrequency: { min: 2500, max: 10000 },
  filterResonance: { min: 0.1, max: 4 },
  bitCrusherBits: { min: 2, max: 4 },
  bitCrusherDepth: { min: 0.013, max: 0.055 },
} satisfies Record<string, Range>;

export const ClosedHatVoicing = {
  decay: { min: 0.02, max: 0.15 },
} satisfies Record<string, Range>;

export const OpenHatVoicing = {
  decay: { min: 0.05, max: 0.5 },
  release: { min: 0.05, max: 1.2 },
} satisfies Record<string, Range>;

export const CrashVoicing = {
  decay: { min: 1, max: 4 },
  release: { min: 1, max: 5 },
} satisfies Record<string, Range>;

export const RideVoicing = {
  decay: { min: 0.2, max: 1.5 },
  release: { min: 0.05, max: 1.5 },
} satisfies Record<string, Range>;

export const SecondaryDepthRange = 0.12;
export const SecondaryDecayMultiplier = 0.62;
