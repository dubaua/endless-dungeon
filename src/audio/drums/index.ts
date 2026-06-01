import * as Tone from 'tone';

import type { DrumChannel } from '../../sequencer';
import { getState, subscribe } from '../../state/store';
import { createDrumVoiceInstance, type DrumVoiceRuntimeInstance } from '../graph/drumVoice';
import { createMasterOutput, type MasterOutput } from '../graph/master';
import { createMeteredMixerChannel, type MeteredMixerChannel } from '../mixer';

interface DrumChannelRuntime {
  channel: DrumChannel;
  channelOutput: MeteredMixerChannel;
  chain: DrumVoiceRuntimeInstance;
}

let initialized = false;
let masterOutput: MasterOutput | null = null;
let runtimes = new Map<string, DrumChannelRuntime>();
let mixerSubscribed = false;

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
      const channelOutput = createMeteredMixerChannel(
        channel.outputChannelId,
        mixerChannel?.volume ?? 1,
        mixerChannel?.muted ?? false,
        masterInput,
      );

      chain.output.connect(channelOutput.input);

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

const handleMixerChanges = (): void => {
  if (mixerSubscribed) {
    return;
  }

  mixerSubscribed = true;
  let lastMixer = JSON.stringify(getState().mixer);

  subscribe((next) => {
    const nextMixer = JSON.stringify(next.mixer);

    if (nextMixer === lastMixer) {
      return;
    }

    lastMixer = nextMixer;

    runtimes.forEach((runtime) => {
      const mixerChannel = next.mixer.channels[runtime.channel.outputChannelId];

      runtime.channelOutput.setGain(mixerChannel?.volume ?? 1, mixerChannel?.muted ?? false);
    });
  });
};

export const initializeDrums = (): void => {
  if (initialized) {
    return;
  }

  initialized = true;
  ensureDrumVoices();
  handleMixerChanges();
};

export const triggerDrumsAtStep = (step: number, time: Tone.Unit.Time): void => {
  ensureDrumVoices();

  const state = getState();
  const closedHatRuntime = [...runtimes.values()].find((runtime) => runtime.channel.voice === 'closedHat');
  const closedHatChannel = state.sequencer.drumChannels.find((channel) => channel.voice === 'closedHat');
  const closedHatIntensity = closedHatRuntime
    ? (closedHatChannel?.pattern[step % closedHatChannel.pattern.length] ?? 0)
    : 0;
  const openHatRuntime = [...runtimes.values()].find((runtime) => runtime.channel.voice === 'openHat');

  if (closedHatIntensity > 0) {
    openHatRuntime?.chain.choke?.(time);
  }

  runtimes.forEach((runtime) => {
    const channel = state.sequencer.drumChannels.find((nextChannel) => nextChannel.id === runtime.channel.id);

    if (!channel) {
      return;
    }

    const patternIndex = step % channel.pattern.length;
    const intensity = channel.pattern[patternIndex] ?? 0;

    if (intensity > 0) {
      runtime.chain.trigger(time, intensity);
    }
  });
};
