import { createSignal, onCleanup, type Accessor } from 'solid-js';

import type {
  DrumSynthId,
  DrumVoicing,
  NoteSynthId,
  NoteSynthVoicing,
  VoicingState,
} from '@audio/synths/types';
import type { TrackDna } from '@generators/dna/track-dna';
import type { Motif } from '@generators/motif/motif';
import { InitialTrack } from '@sequencer/initial-track';
import { getTrack, getTrackBlock, updateTrack, updateTrackBlock } from '@sequencer/track-service';
import type { DrumClip, NoteClip, PatternStep, SequencerState } from '@sequencer/types';
import { clamp } from '@utils/clamp';

export const VOICE_MIXER_CHANNEL_ID = 'channel-voice-main';
export const BASS_MIXER_CHANNEL_ID = 'channel-bass-main';
export const PERCUSSION_MIXER_GROUP_ID = 'group-percussion';

const MIXER_SESSION_STORAGE_KEY = 'endless-dungeon:mixer';

export interface MixerChannelState {
  id: string;
  name: string;
  volume: number;
  pan: number;
  muted: boolean;
  groupId: string | null;
}

export interface MixerGroupState {
  id: string;
  name: string;
  volume: number;
  pan: number;
  muted: boolean;
}

export interface MixerState {
  channels: Record<string, MixerChannelState>;
  groups: Record<string, MixerGroupState>;
  masterVolume: number;
}

export interface TransportState {
  bpm: number;
  timeSignature: [number, number];
  isPlaying: boolean;
  currentTick: number;
  bar: number;
  beat: number;
  sixteenth: number;
  step: number;
}

export interface DrumPatternFiltersState {
  syncopationScore: number;
  density: number;
  densitySpread: number;
}

export interface PlayerState {
  motif: Motif | undefined;
  motifAbsoluteRange: number;
}

export interface AppState {
  transport: TransportState;
  sequencer: SequencerState;
  trackDna: TrackDna;
  drumPatternFilters: DrumPatternFiltersState;
  hatsPatternFilters: DrumPatternFiltersState;
  voicing: VoicingState;
  player: PlayerState;
  mixer: MixerState;
}

type Listener = (state: AppState) => void;
type Mutator = (state: AppState) => void;

type Selector<T> = (state: AppState) => T;

type Cleanup = () => void;

type StoredMixerChannelState = Partial<Pick<MixerChannelState, 'volume' | 'pan' | 'muted'>>;
type StoredMixerState = Record<string, StoredMixerChannelState>;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const deepEqual = (left: unknown, right: unknown): boolean => {
  if (Object.is(left, right)) {
    return true;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length && left.every((value, index) => deepEqual(value, right[index]))
    );
  }

  if (isPlainObject(left) && isPlainObject(right)) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    return (
      leftKeys.length === rightKeys.length &&
      leftKeys.every(
        (key) =>
          Object.prototype.hasOwnProperty.call(right, key) && deepEqual(left[key], right[key]),
      )
    );
  }

  return false;
};

const hasSessionStorage = (): boolean => typeof sessionStorage !== 'undefined';

const readStoredMixerState = (): StoredMixerState => {
  if (!hasSessionStorage()) {
    return {};
  }

  try {
    const raw = sessionStorage.getItem(MIXER_SESSION_STORAGE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;

    return isPlainObject(parsed) ? (parsed as StoredMixerState) : {};
  } catch {
    return {};
  }
};

const writeStoredMixerState = (mixer: MixerState): void => {
  if (!hasSessionStorage()) {
    return;
  }

  const stored: StoredMixerState = Object.fromEntries(
    Object.entries(mixer.channels).map(([id, channel]) => [
      id,
      {
        volume: channel.volume,
        pan: channel.pan,
        muted: channel.muted,
      },
    ]),
  );

  sessionStorage.setItem(MIXER_SESSION_STORAGE_KEY, JSON.stringify(stored));
};

const createDefaultMixerChannels = (): Record<string, MixerChannelState> =>
  Object.fromEntries(
    [
      {
        id: VOICE_MIXER_CHANNEL_ID,
        name: 'Voice',
        volume: 1,
        pan: 0,
        muted: false,
        groupId: null,
      },
      {
        id: BASS_MIXER_CHANNEL_ID,
        name: 'Bass',
        volume: 1,
        pan: 0,
        muted: false,
        groupId: null,
      },
      {
        id: 'channel-drum-kick-primary',
        name: 'Kick Primary',
        volume: 1,
        pan: 0,
        muted: false,
        groupId: null,
      },
      {
        id: 'channel-drum-kick-secondary',
        name: 'Kick Secondary',
        volume: 0.8,
        pan: 0,
        muted: false,
        groupId: null,
      },
      {
        id: 'channel-drum-snare-primary',
        name: 'Snare Primary',
        volume: 1,
        pan: 0,
        muted: false,
        groupId: null,
      },
      {
        id: 'channel-drum-snare-secondary',
        name: 'Snare Secondary',
        volume: 0.8,
        pan: 0,
        muted: false,
        groupId: null,
      },
      {
        id: 'channel-drum-clap-primary',
        name: 'Clap Primary',
        volume: 1,
        pan: 0,
        muted: false,
        groupId: null,
      },
      {
        id: 'channel-drum-clap-secondary',
        name: 'Clap Secondary',
        volume: 0.8,
        pan: 0,
        muted: false,
        groupId: null,
      },
      {
        id: 'channel-drum-closed-hat',
        name: 'Closed Hat',
        volume: 1,
        pan: 0,
        muted: false,
        groupId: PERCUSSION_MIXER_GROUP_ID,
      },
      {
        id: 'channel-drum-open-hat',
        name: 'Open Hat',
        volume: 1,
        pan: 0,
        muted: false,
        groupId: PERCUSSION_MIXER_GROUP_ID,
      },
      {
        id: 'channel-drum-ride',
        name: 'Ride',
        volume: 1,
        pan: 0,
        muted: false,
        groupId: PERCUSSION_MIXER_GROUP_ID,
      },
      {
        id: 'channel-drum-crash',
        name: 'Crash',
        volume: 1,
        pan: 0,
        muted: false,
        groupId: PERCUSSION_MIXER_GROUP_ID,
      },
    ].map((channel) => [channel.id, channel]),
  );

const createDefaultMixerGroups = (): Record<string, MixerGroupState> => ({
  [PERCUSSION_MIXER_GROUP_ID]: {
    id: PERCUSSION_MIXER_GROUP_ID,
    name: 'Percussion',
    volume: 0.9,
    pan: 0,
    muted: false,
  },
});

const createInitialMixerState = (): MixerState => {
  const channels = createDefaultMixerChannels();
  const stored = readStoredMixerState();

  Object.entries(stored).forEach(([id, settings]) => {
    const channel = channels[id];

    if (!channel) {
      return;
    }

    channels[id] = {
      ...channel,
      volume: typeof settings.volume === 'number' ? clamp(settings.volume, 0, 1) : channel.volume,
      pan: typeof settings.pan === 'number' ? clamp(settings.pan, -1, 1) : channel.pan,
      muted: typeof settings.muted === 'boolean' ? settings.muted : channel.muted,
    };
  });

  return { channels, groups: createDefaultMixerGroups(), masterVolume: 1 };
};

const InitialTrackBlock = InitialTrack.blocks[0];

const updateActiveTrackBlock = (
  sequencer: SequencerState,
  noteClips: NoteClip[],
  drumClips: DrumClip[],
  voicing: VoicingState,
): SequencerState => {
  const activeBlock = getTrackBlock(sequencer.activeTrackId, sequencer.activeBlockId);

  if (activeBlock) {
    updateTrackBlock(sequencer.activeTrackId, {
      ...activeBlock,
      noteClips,
      drumClips,
      voicing,
    });
  }

  return {
    ...sequencer,
    noteClips,
    drumClips,
  };
};

const state: AppState = {
  transport: {
    bpm: 120,
    timeSignature: [4, 4],
    isPlaying: false,
    currentTick: 0,
    bar: 0,
    beat: 0,
    sixteenth: 0,
    step: 0,
  },
  sequencer: {
    activeTrackId: InitialTrack.id,
    activeBlockId: InitialTrackBlock.id,
    noteClips: InitialTrackBlock.noteClips,
    drumClips: InitialTrackBlock.drumClips,
  },
  trackDna: InitialTrack.dna,
  drumPatternFilters: {
    syncopationScore: 0,
    density: 0.5,
    densitySpread: 0.1,
  },
  hatsPatternFilters: {
    syncopationScore: 0,
    density: 0.5,
    densitySpread: 0.1,
  },
  voicing: InitialTrackBlock.voicing,
  player: {
    motif: undefined,
    motifAbsoluteRange: 8,
  },
  mixer: createInitialMixerState(),
};

const listeners = new Set<Listener>();

const snapshotState = (): AppState => state;

export const getState = (): AppState => state;

const notifyListeners = (): void => {
  const snapshot = snapshotState();
  listeners.forEach((listener) => {
    listener(snapshot);
  });
};

export const updateState = (mutator: Mutator): void => {
  mutator(state);
  notifyListeners();
};

export const subscribe = (listener: Listener): Cleanup => {
  listeners.add(listener);
  listener(snapshotState());
  return () => {
    listeners.delete(listener);
  };
};

export const useStore = <T>(selector: Selector<T>): Accessor<T> => {
  let selected = selector(snapshotState());
  const [value, setValue] = createSignal(selected);
  const unsubscribe = subscribe((next) => {
    const nextSelected = selector(next);

    if (!deepEqual(selected, nextSelected)) {
      selected = nextSelected;
      setValue(() => nextSelected);
    }
  });
  onCleanup(unsubscribe);
  return value;
};

export const setTransportPlaying = (isPlaying: boolean): void => {
  updateState((draft) => {
    draft.transport = { ...draft.transport, isPlaying };
  });
};

export const setTransportStep = (step: number): void => {
  updateState((draft) => {
    draft.transport = { ...draft.transport, step };
  });
};

export const setTransportTick = (currentTick: number): void => {
  updateState((draft) => {
    draft.transport = { ...draft.transport, currentTick };
  });
};

export const setTransportPosition = (bar: number, beat: number, sixteenth: number): void => {
  updateState((draft) => {
    draft.transport = { ...draft.transport, bar, beat, sixteenth };
  });
};

export const setTransportBpm = (bpm: number): void => {
  updateState((draft) => {
    draft.transport = { ...draft.transport, bpm };
  });
};

export const setTransportTimeSignature = (timeSignature: [number, number]): void => {
  updateState((draft) => {
    draft.transport = { ...draft.transport, timeSignature };
  });
};

export const setTrackDna = (trackDna: TrackDna): void => {
  updateState((draft) => {
    draft.trackDna = trackDna;
    const track = getTrack(draft.sequencer.activeTrackId);

    if (track) {
      updateTrack({
        ...track,
        dna: trackDna,
      });
    }
  });
};

export const setDrumPatternFilters = (filters: Partial<DrumPatternFiltersState>): void => {
  updateState((draft) => {
    draft.drumPatternFilters = { ...draft.drumPatternFilters, ...filters };
  });
};

export const setHatsPatternFilters = (filters: Partial<DrumPatternFiltersState>): void => {
  updateState((draft) => {
    draft.hatsPatternFilters = { ...draft.hatsPatternFilters, ...filters };
  });
};

export const loadTrackBlock = (trackId: string, blockId: string): void => {
  updateState((draft) => {
    const track = getTrack(trackId);
    const block = getTrackBlock(trackId, blockId);

    if (!track || !block) {
      return;
    }

    draft.sequencer = {
      ...draft.sequencer,
      activeTrackId: track.id,
      activeBlockId: block.id,
      noteClips: block.noteClips,
      drumClips: block.drumClips,
    };
    draft.trackDna = track.dna;
    draft.voicing = block.voicing;
  });
};

export const setVoicePattern = (pattern: PatternStep[]): void => {
  updateState((draft) => {
    const noteClips = draft.sequencer.noteClips.map((clip) => {
      if (clip.synthId !== 'voice') {
        return clip;
      }

      return {
        ...clip,
        startTick: 0,
        pattern,
      };
    });

    draft.sequencer = updateActiveTrackBlock(
      draft.sequencer,
      noteClips,
      draft.sequencer.drumClips,
      draft.voicing,
    );
  });
};

export const setDrumPatternStep = (clipId: string, step: number, intensity: number): void => {
  updateState((draft) => {
    const drumClips = draft.sequencer.drumClips.map((clip) => {
      if (clip.id !== clipId) {
        return clip;
      }

      return {
        ...clip,
        pattern: clip.pattern.map((value, index) => {
          if (index !== step) {
            return value;
          }

          return intensity;
        }),
      };
    });

    draft.sequencer = updateActiveTrackBlock(
      draft.sequencer,
      draft.sequencer.noteClips,
      drumClips,
      draft.voicing,
    );
  });
};

export const setDrumClips = (drumClips: DrumClip[]): void => {
  updateState((draft) => {
    draft.sequencer = updateActiveTrackBlock(
      draft.sequencer,
      draft.sequencer.noteClips,
      drumClips,
      draft.voicing,
    );
  });
};

export const setNoteSynthVoicing = (
  synthId: NoteSynthId,
  voicing: Partial<NoteSynthVoicing>,
): void => {
  updateState((draft) => {
    const nextVoicing = {
      ...draft.voicing,
      [synthId]: {
        ...draft.voicing[synthId],
        ...voicing,
      },
    };

    draft.voicing = nextVoicing;
    draft.sequencer = updateActiveTrackBlock(
      draft.sequencer,
      draft.sequencer.noteClips,
      draft.sequencer.drumClips,
      nextVoicing,
    );
  });
};

export const setDrumSynthVoicing = (synthId: DrumSynthId, voicing: Partial<DrumVoicing>): void => {
  updateState((draft) => {
    const getSecondarySynthId = (): DrumSynthId | null => {
      if (synthId === 'kickPrimary') {
        return 'kickSecondary';
      }

      if (synthId === 'snarePrimary') {
        return 'snareSecondary';
      }

      if (synthId === 'clapPrimary') {
        return 'clapSecondary';
      }

      return null;
    };
    const secondarySynthId = getSecondarySynthId();
    const nextPrimaryVoicing = {
      ...draft.voicing.drums[synthId],
      ...voicing,
    };
    const nextSecondaryVoicing = secondarySynthId
      ? ({
          ...nextPrimaryVoicing,
          decay: nextPrimaryVoicing.decay * 0.75,
          bitCrusherDepth: nextPrimaryVoicing.bitCrusherDepth * 1.08,
        } as DrumVoicing)
      : undefined;
    const nextVoicing = {
      ...draft.voicing,
      drums: {
        ...draft.voicing.drums,
        [synthId]: nextPrimaryVoicing,
        ...(secondarySynthId && nextSecondaryVoicing
          ? { [secondarySynthId]: nextSecondaryVoicing }
          : {}),
      },
    };

    draft.voicing = nextVoicing;
    draft.sequencer = updateActiveTrackBlock(
      draft.sequencer,
      draft.sequencer.noteClips,
      draft.sequencer.drumClips,
      nextVoicing,
    );
  });
};

export const setVoicing = (voicing: VoicingState): void => {
  updateState((draft) => {
    draft.voicing = voicing;
    draft.sequencer = updateActiveTrackBlock(
      draft.sequencer,
      draft.sequencer.noteClips,
      draft.sequencer.drumClips,
      voicing,
    );
  });
};

export const setPlayerMotif = (motif: Motif, motifAbsoluteRange: number): void => {
  updateState((draft) => {
    draft.player = { motif, motifAbsoluteRange };
  });
};

export const setMixerChannelState = (
  channelId: string,
  settings: Partial<Pick<MixerChannelState, 'volume' | 'pan' | 'muted'>>,
): void => {
  updateState((draft) => {
    const channel = draft.mixer.channels[channelId];

    if (!channel) {
      return;
    }

    draft.mixer = {
      ...draft.mixer,
      channels: {
        ...draft.mixer.channels,
        [channelId]: {
          ...channel,
          ...settings,
        },
      },
    };
    writeStoredMixerState(draft.mixer);
  });
};
