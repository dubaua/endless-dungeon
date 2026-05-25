import { midiNoteToName } from './pitch';
import type { NoteLane } from './types';

export const DRUM_KIT_NOTES = {
  kick: 48,
  snare: 49,
  closedHat: 50,
  openHat: 51,
  crash: 52,
} as const;

export const demoDrumKitLanes: NoteLane[] = [
  { note: DRUM_KIT_NOTES.crash, label: `${midiNoteToName(DRUM_KIT_NOTES.crash)} - crash` },
  { note: DRUM_KIT_NOTES.openHat, label: `${midiNoteToName(DRUM_KIT_NOTES.openHat)} - open hat` },
  { note: DRUM_KIT_NOTES.closedHat, label: `${midiNoteToName(DRUM_KIT_NOTES.closedHat)} - closed hat` },
  { note: DRUM_KIT_NOTES.snare, label: `${midiNoteToName(DRUM_KIT_NOTES.snare)} - snare` },
  { note: DRUM_KIT_NOTES.kick, label: `${midiNoteToName(DRUM_KIT_NOTES.kick)} - kick` },
];
