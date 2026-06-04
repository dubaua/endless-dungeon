export const OscillatorTypes = ['sine', 'triangle', 'sawtooth', 'square'] as const;

export type OscillatorType = (typeof OscillatorTypes)[number];
