export const ModeDegreeFunctions = [
  /** Home degree: strongest point of rest and resolution. */
  'tonic',
  /** Phrase-ending degree: useful for cadential arrival or turnaround points. */
  'cadence',
  /** Consonant color degree: safe melodic target without full tonic resolution. */
  'stable',
  /** Setup degree: tends to move toward dominant or stronger tension. */
  'predominant',
  /** Pull degree: creates forward motion back toward tonic or another stable target. */
  'dominant',
  /** Character/tension degree: useful for color, usually wants resolution. */
  'tension',
  /** Connector degree: weak melodic passing tone between stronger degrees. */
  'passing',
  /** Fragile degree: usable for effect, but usually avoided as a landing point. */
  'avoid',
] as const;

export type ModeDegreeFunction = (typeof ModeDegreeFunctions)[number];
