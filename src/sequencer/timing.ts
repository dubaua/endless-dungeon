export const PPQ = 480;
export const BEATS_PER_BAR = 4;
export const BAR_TICKS = PPQ * BEATS_PER_BAR;
export const STEP_TICKS = PPQ / 4;
export const DEFAULT_CLIP_BARS = 4;
export const DEFAULT_CLIP_LENGTH_TICKS = BAR_TICKS * DEFAULT_CLIP_BARS;

export const ticksToBars = (ticks: number): number => ticks / BAR_TICKS;
