import * as Tone from 'tone';

import type { DrumChannel } from '../../sequencer';
import { getState, subscribe } from '../../state/store';
import { createDrumVoiceInstance, type DrumVoiceRuntimeInstance } from '../graph/drumVoice';
import { createMasterOutput, type MasterOutput } from '../graph/master';

type Cleanup = () => void;

interface DrumChannelRuntime {
  channel: DrumChannel;
  channelOutput: Tone.Gain;
  chain: DrumVoiceRuntimeInstance;
}

let initialized = false;
let cleanups: Cleanup[] = [];
let masterOutput: MasterOutput | null = null;
let runtimes = new Map<string, DrumChannelRuntime>();

const getMixerGain = (volume: number, muted: boolean): number =>
  muted ? 0 : Math.max(0, Math.min(1, volume));

const ensureDrumVoices = (): void => {
  if (masterOutput && runtimes.size > 0) {
    return;
  }

  const state = getState();
  masterOutput = createMasterOutput(0.9);
  const masterInput = masterOutput.input;

  runtimes = new Map(
    state.sequencer.drumChannels.map((channel) => {
      const chain = createDrumVoiceInstance(channel);
      const mixerChannel = state.mixer.channels[channel.outputChannelId];
      const channelOutput = new Tone.Gain(
        getMixerGain(mixerChannel?.volume ?? 1, mixerChannel?.muted ?? false),
      );

      chain.output.connect(channelOutput);
      channelOutput.connect(masterInput);

      return [
        channel.id,
        {
          channel,
          channelOutput,
          chain,
        },
      ];
    }),
  );
};

const handleStateChanges = (): void => {
  let lastDrumChannels = JSON.stringify(getState().sequencer.drumChannels);
  let lastMixer = JSON.stringify(getState().mixer);

  const unsubscribe = subscribe((next) => {
    const nextDrumChannels = JSON.stringify(next.sequencer.drumChannels);
    const nextMixer = JSON.stringify(next.mixer);

    if (nextDrumChannels === lastDrumChannels && nextMixer === lastMixer) {
      return;
    }

    lastDrumChannels = nextDrumChannels;
    lastMixer = nextMixer;

    runtimes.forEach((runtime, channelId) => {
      const nextChannel = next.sequencer.drumChannels.find((channel) => channel.id === channelId);

      if (nextChannel) {
        runtime.channel = nextChannel;
        runtime.chain.update(nextChannel.voicing);
      }

      const mixerChannel = next.mixer.channels[runtime.channel.outputChannelId];

      runtime.channelOutput.gain.value = getMixerGain(
        mixerChannel?.volume ?? 1,
        mixerChannel?.muted ?? false,
      );
    });
  });

  cleanups.push(unsubscribe);
};

export const initializeDrums = (): void => {
  if (initialized) {
    return;
  }

  initialized = true;
  ensureDrumVoices();
  handleStateChanges();
};

export const triggerDrumsAtStep = (step: number, time: Tone.Unit.Time): void => {
  ensureDrumVoices();

  runtimes.forEach((runtime) => {
    const patternIndex = step % runtime.channel.pattern.length;
    const intensity = runtime.channel.pattern[patternIndex] ?? 0;

    if (intensity > 0) {
      runtime.chain.trigger(time, intensity);
    }
  });
};

export const disposeDrums = (): void => {
  cleanups.forEach((cleanup) => {
    cleanup();
  });
  cleanups = [];

  runtimes.forEach((runtime) => {
    runtime.chain.dispose();
    runtime.channelOutput.dispose();
  });
  runtimes.clear();
  masterOutput?.dispose();
  masterOutput = null;
  initialized = false;
};
