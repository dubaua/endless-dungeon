import { OrientalMode } from '@/harmony/modes/oriental';
import { AeolianMode } from '@harmony/modes/aeolian';
import { DorianMode } from '@harmony/modes/dorian';
import { IonianMode } from '@harmony/modes/ionian';
import { LocrianMode } from '@harmony/modes/locrian';
import { LydianMode } from '@harmony/modes/lydian';
import { MajorMode } from '@harmony/modes/major';
import { MinorMode } from '@harmony/modes/minor';
import { MixolydianMode } from '@harmony/modes/mixolydian';
import { PersianMode } from '@harmony/modes/persian';
import { PhrygianMode } from '@harmony/modes/phrygian';

export const Modes = {
  major: MajorMode,
  minor: MinorMode,
  ionian: IonianMode,
  dorian: DorianMode,
  phrygian: PhrygianMode,
  lydian: LydianMode,
  mixolydian: MixolydianMode,
  aeolian: AeolianMode,
  locrian: LocrianMode,
  persian: PersianMode,
  oriental: OrientalMode,
} as const;

export type KnownModeName = keyof typeof Modes;
