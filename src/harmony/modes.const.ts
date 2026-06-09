import { defineModes } from '@harmony/define-modes';
import { AeolianMode } from '@harmony/modes/aeolian';
import { DorianMode } from '@harmony/modes/dorian';
import { IonianMode } from '@harmony/modes/ionian';
import { LocrianMode } from '@harmony/modes/locrian';
import { LydianMode } from '@harmony/modes/lydian';
import { MajorPentatonicMode } from '@harmony/modes/major-pentatonic';
import { MinorPentatonicMode } from '@harmony/modes/minor-pentatonic';
import { MixolydianMode } from '@harmony/modes/mixolydian';
import { OrientalMode } from '@harmony/modes/oriental';
import { PersianMode } from '@harmony/modes/persian';
import { PhrygianMode } from '@harmony/modes/phrygian';

export const Modes = defineModes({
  ionian: IonianMode,
  dorian: DorianMode,
  phrygian: PhrygianMode,
  lydian: LydianMode,
  mixolydian: MixolydianMode,
  aeolian: AeolianMode,
  locrian: LocrianMode,
  majorPentatonic: MajorPentatonicMode,
  minorPentatonic: MinorPentatonicMode,
  persian: PersianMode,
  oriental: OrientalMode,
});

export type KnownModeName = keyof typeof Modes;
