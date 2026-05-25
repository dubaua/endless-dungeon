import { BAR_TICKS, DEFAULT_CLIP_LENGTH_TICKS, PPQ } from './timing';
import { DRUM_KIT_NOTES, demoDrumKitLanes } from './drumKit';
import { midiNoteToName } from './pitch';
import type { Clip, Note, Track } from './types';

const note = (
  id: string,
  midiNote: number,
  description: string,
  startTick: number,
  durationTicks: number,
  velocity: number,
): Note => ({
  id,
  note: midiNote,
  description,
  startTick,
  durationTicks,
  velocity,
});

const melodicNote = (
  id: string,
  midiNote: number,
  startTick: number,
  durationTicks: number,
  velocity: number,
): Note => note(id, midiNote, midiNoteToName(midiNote), startTick, durationTicks, velocity);

const drumNote = (
  id: string,
  midiNote: number,
  drumName: string,
  startTick: number,
  durationTicks: number,
  velocity: number,
): Note =>
  note(
    id,
    midiNote,
    `${midiNoteToName(midiNote)} - ${drumName}`,
    startTick,
    durationTicks,
    velocity,
  );

const pianoPhrase: Note[] = [
  melodicNote('piano-c4-1', 60, 0, PPQ, 0.75),
  melodicNote('piano-e4-1', 64, PPQ, PPQ, 0.75),
  melodicNote('piano-g4-1', 67, PPQ * 2, PPQ, 0.75),
  melodicNote('piano-b4-1', 71, PPQ * 3, PPQ, 0.75),
  melodicNote('piano-a4-2', 69, BAR_TICKS, PPQ, 0.75),
  melodicNote('piano-g4-2', 67, BAR_TICKS + PPQ, PPQ, 0.75),
  melodicNote('piano-e4-2', 64, BAR_TICKS + PPQ * 2, PPQ, 0.75),
  melodicNote('piano-d4-2', 62, BAR_TICKS + PPQ * 3, PPQ, 0.75),
  melodicNote('piano-f4-3', 65, BAR_TICKS * 2, PPQ * 2, 0.75),
  melodicNote('piano-a4-3', 69, BAR_TICKS * 2 + PPQ * 2, PPQ, 0.75),
  melodicNote('piano-g4-3', 67, BAR_TICKS * 2 + PPQ * 3, PPQ, 0.75),
  melodicNote('piano-c5-4', 72, BAR_TICKS * 3, PPQ * 2, 0.75),
  melodicNote('piano-b4-4', 71, BAR_TICKS * 3 + PPQ * 2, PPQ, 0.75),
  melodicNote('piano-g4-4', 67, BAR_TICKS * 3 + PPQ * 3, PPQ, 0.75),
];

const drumNotes: Note[] = [
  drumNote('drum-crash-1', DRUM_KIT_NOTES.crash, 'crash', 0, PPQ / 2, 0.9),
  drumNote('drum-kick-1', DRUM_KIT_NOTES.kick, 'kick', 0, PPQ / 2, 0.95),
  drumNote('drum-kick-1-and', DRUM_KIT_NOTES.kick, 'kick', PPQ + PPQ / 2, PPQ / 2, 0.74),
  drumNote('drum-snare-1-2', DRUM_KIT_NOTES.snare, 'snare', PPQ, PPQ / 2, 0.86),
  drumNote('drum-snare-1-4', DRUM_KIT_NOTES.snare, 'snare', PPQ * 3, PPQ / 2, 0.88),
  drumNote(
    'drum-open-hat-1-4-and',
    DRUM_KIT_NOTES.openHat,
    'open hat',
    PPQ * 3 + PPQ / 2,
    PPQ / 2,
    0.64,
  ),
  drumNote('drum-kick-2', DRUM_KIT_NOTES.kick, 'kick', BAR_TICKS, PPQ / 2, 0.92),
  drumNote('drum-kick-2-3', DRUM_KIT_NOTES.kick, 'kick', BAR_TICKS + PPQ * 2, PPQ / 2, 0.78),
  drumNote('drum-snare-2-2', DRUM_KIT_NOTES.snare, 'snare', BAR_TICKS + PPQ, PPQ / 2, 0.84),
  drumNote('drum-snare-2-4', DRUM_KIT_NOTES.snare, 'snare', BAR_TICKS + PPQ * 3, PPQ / 2, 0.9),
  drumNote('drum-kick-3', DRUM_KIT_NOTES.kick, 'kick', BAR_TICKS * 2, PPQ / 2, 0.96),
  drumNote(
    'drum-kick-3-and',
    DRUM_KIT_NOTES.kick,
    'kick',
    BAR_TICKS * 2 + PPQ * 2 + PPQ / 2,
    PPQ / 2,
    0.76,
  ),
  drumNote('drum-snare-3-2', DRUM_KIT_NOTES.snare, 'snare', BAR_TICKS * 2 + PPQ, PPQ / 2, 0.86),
  drumNote('drum-snare-3-4', DRUM_KIT_NOTES.snare, 'snare', BAR_TICKS * 2 + PPQ * 3, PPQ / 2, 0.9),
  drumNote('drum-crash-4', DRUM_KIT_NOTES.crash, 'crash', BAR_TICKS * 3, PPQ / 2, 0.86),
  drumNote('drum-kick-4', DRUM_KIT_NOTES.kick, 'kick', BAR_TICKS * 3, PPQ / 2, 0.94),
  drumNote('drum-snare-4-2', DRUM_KIT_NOTES.snare, 'snare', BAR_TICKS * 3 + PPQ, PPQ / 2, 0.85),
  drumNote('drum-snare-4-4', DRUM_KIT_NOTES.snare, 'snare', BAR_TICKS * 3 + PPQ * 3, PPQ / 2, 0.92),
];

const hatNotes: Note[] = Array.from({ length: 32 }, (_, index) =>
  drumNote(
    `drum-hat-${index + 1}`,
    DRUM_KIT_NOTES.closedHat,
    'closed hat',
    index * (PPQ / 2),
    PPQ / 4,
    index % 2 === 0 ? 0.58 : 0.42,
  ),
);

export const demoClips: Clip[] = [
  {
    id: 'clip-piano-phrase',
    type: 'midi',
    view: 'pianoRoll',
    startTick: 0,
    lengthTicks: DEFAULT_CLIP_LENGTH_TICKS,
    notes: pianoPhrase,
  },
  {
    id: 'clip-drum-pattern',
    type: 'midi',
    view: 'drumGrid',
    startTick: 0,
    lengthTicks: DEFAULT_CLIP_LENGTH_TICKS,
    notes: [...drumNotes, ...hatNotes].sort((a, b) => a.startTick - b.startTick),
  },
];

export const demoTracks: Track[] = [
  {
    id: 'track-piano',
    name: 'Dungeon Keys',
    type: 'pianoRoll',
    clips: [demoClips[0]],
  },
  {
    id: 'track-drums',
    name: 'Dungeon Kit',
    type: 'drumKit',
    noteLanes: demoDrumKitLanes,
    clips: [demoClips[1]],
  },
];
