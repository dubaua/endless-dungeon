import * as Tone from 'tone';

import {
  BASS_MIXER_CHANNEL_ID,
  getState,
  subscribe,
  VOICE_MIXER_CHANNEL_ID,
  type MixerChannelState,
  type MixerGroupState,
} from '../state/store';
import { clamp } from '../utils/clamp';
import { createMasterOutput, type MasterOutput } from './graph/master';
import type { SynthId } from './synths/types';

interface RuntimeMixerChannel {
  input: Tone.Gain;
  gain: Tone.Gain;
  panner: Tone.Panner;
  meter: Tone.Meter;
  setState: (state: MixerChannelState) => void;
}

interface RuntimeMixerGroup {
  input: Tone.Gain;
  gain: Tone.Gain;
  panner: Tone.Panner;
  setState: (state: MixerGroupState) => void;
}

type Cleanup = () => void;

const meters = new Map<string, Tone.Meter>();
const channels = new Map<string, RuntimeMixerChannel>();
const groups = new Map<string, RuntimeMixerGroup>();
const SynthMixerChannelIds: Record<SynthId, string> = {
  voice: VOICE_MIXER_CHANNEL_ID,
  bass: BASS_MIXER_CHANNEL_ID,
  kick: 'channel-drum-kick',
  snare: 'channel-drum-snare',
  clap: 'channel-drum-clap',
  closedHat: 'channel-drum-closed-hat',
  openHat: 'channel-drum-open-hat',
  crash: 'channel-drum-crash',
  ride: 'channel-drum-ride',
};

let initialized = false;
let masterOutput: MasterOutput | null = null;
let cleanups: Cleanup[] = [];

const getMixerGain = (volume: number, muted: boolean): number =>
  muted ? 0 : clamp(volume, 0, 1);

const createRuntimeMixerGroup = (
  group: MixerGroupState,
  destination: Tone.InputNode,
): RuntimeMixerGroup => {
  const input = new Tone.Gain();
  const gain = new Tone.Gain(getMixerGain(group.volume, group.muted));
  const panner = new Tone.Panner(clamp(group.pan, -1, 1));

  input.connect(gain);
  gain.connect(panner);
  panner.connect(destination);

  return {
    input,
    gain,
    panner,
    setState: (state) => {
      gain.gain.value = getMixerGain(state.volume, state.muted);
      panner.pan.value = clamp(state.pan, -1, 1);
    },
  };
};

const createRuntimeMixerChannel = (
  channel: MixerChannelState,
  destination: Tone.InputNode,
): RuntimeMixerChannel => {
  const input = new Tone.Gain();
  const gain = new Tone.Gain(getMixerGain(channel.volume, channel.muted));
  const panner = new Tone.Panner(clamp(channel.pan, -1, 1));
  const meter = new Tone.Meter({ normalRange: true, smoothing: 0.78 });

  input.connect(gain);
  gain.connect(panner);
  panner.connect(meter);
  panner.connect(destination);
  meters.set(channel.id, meter);

  return {
    input,
    gain,
    panner,
    meter,
    setState: (state) => {
      gain.gain.value = getMixerGain(state.volume, state.muted);
      panner.pan.value = clamp(state.pan, -1, 1);
    },
  };
};

const getChannelDestination = (channel: MixerChannelState): Tone.InputNode => {
  if (!masterOutput) {
    throw new Error('Mixer master output is not initialized');
  }

  if (channel.groupId) {
    return groups.get(channel.groupId)?.input ?? masterOutput.input;
  }

  return masterOutput.input;
};

const ensureMixer = (): void => {
  if (masterOutput) {
    return;
  }

  const state = getState();
  masterOutput = createMasterOutput(state.mixer.masterVolume);

  Object.values(state.mixer.groups).forEach((group) => {
    groups.set(group.id, createRuntimeMixerGroup(group, masterOutput!.input));
  });

  Object.values(state.mixer.channels).forEach((channel) => {
    const destination = getChannelDestination(channel);

    if (!destination) {
      return;
    }

    channels.set(channel.id, createRuntimeMixerChannel(channel, destination));
  });
};

const handleMixerChanges = (): void => {
  let lastMixer = JSON.stringify(getState().mixer);

  const unsubscribe = subscribe((next) => {
    const nextMixer = JSON.stringify(next.mixer);

    if (nextMixer === lastMixer) {
      return;
    }

    lastMixer = nextMixer;
    masterOutput?.setVolume(next.mixer.masterVolume);
    Object.values(next.mixer.groups).forEach((group) => {
      groups.get(group.id)?.setState(group);
    });
    Object.values(next.mixer.channels).forEach((channel) => {
      channels.get(channel.id)?.setState(channel);
    });
  });

  cleanups.push(unsubscribe);
};

export const getMixerChannelIdForSynth = (synthId: SynthId): string => SynthMixerChannelIds[synthId];

export const initializeMixer = (): void => {
  if (initialized) {
    return;
  }

  initialized = true;
  ensureMixer();
  handleMixerChanges();
};

export const connectMixerChannelInput = (channelId: string, output: Tone.Gain): void => {
  ensureMixer();
  const channel = channels.get(channelId);

  if (!channel) {
    return;
  }

  output.connect(channel.input);
};

export const getMixerMeterLevel = (channelId: string): number => {
  const meter = meters.get(channelId);

  if (!meter) {
    return 0;
  }

  const value = meter.getValue();
  const level = Array.isArray(value) ? Math.max(...value) : value;

  return Number.isFinite(level) ? clamp(level, 0, 1) : 0;
};

export const disposeMixer = (): void => {
  cleanups.forEach((cleanup) => cleanup());
  cleanups = [];
  channels.forEach((channel) => {
    channel.input.dispose();
    channel.gain.dispose();
    channel.panner.dispose();
    channel.meter.dispose();
  });
  groups.forEach((group) => {
    group.input.dispose();
    group.gain.dispose();
    group.panner.dispose();
  });
  channels.clear();
  groups.clear();
  meters.clear();
  masterOutput?.dispose();
  masterOutput = null;
  initialized = false;
};
