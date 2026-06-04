export const countPatternBeats = (pattern: readonly string[], beat: string): number => {
  return pattern.filter((step) => step === beat).length;
};
