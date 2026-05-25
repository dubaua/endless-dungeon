import * as Tone from 'tone';

import type { DrumChannel, DrumVoiceKey } from '../../sequencer';
import { getState, subscribe } from '../../state/store';
import { createDrumVoiceInstance, type DrumVoiceInstance } from '../graph/drumVoice';
import { createMasterOutput, type MasterOutput } from '../graph/master';

type Cleanup = () => void;

interface DrumChannelRuntime {
  channel: DrumChannel;
  channelOutput: Tone.Gain;
  chain: DrumVoiceInstance;
}

let initialized = false;
let cleanups: Cleanup[] = [];
let masterOutput: MasterOutput | null = null;
let runtimes = new Map<DrumVoiceKey, DrumChannelRuntime>();

const getMixerGain = (volume: number, muted: boolean): number => (muted ? 0 : Math.max(0, Math.min(1, volume)));

const ensureDrumVoices = (): void => {
  if (masterOutput && runtimes.size > 0) {
    return;
  }

  const state = getState();
  masterOutput = createMasterOutput(0.9);
  const masterInput = masterOutput.input;

  runtimes = new Map(
    state.sequencer.drumChannels.map((channel) => {
      const chain = createDrumVoiceInstance(channel.voice, state.drumVoices[channel.voice]);
      const mixerChannel = state.mixer.channels[channel.outputChannelId];
      const channelOutput = new Tone.Gain(getMixerGain(mixerChannel?.volume ?? 1, mixerChannel?.muted ?? false));

      chain.output.connect(channelOutput);
      channelOutput.connect(masterInput);

      return [
        channel.voice,
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
  let lastDrumVoices = JSON.stringify(getState().drumVoices);
  let lastMixer = JSON.stringify(getState().mixer);

  const unsubscribe = subscribe((next) => {
    const nextDrumVoices = JSON.stringify(next.drumVoices);
    const nextMixer = JSON.stringify(next.mixer);

    if (nextDrumVoices === lastDrumVoices && nextMixer === lastMixer) {
      return;
    }

    lastDrumVoices = nextDrumVoices;
    lastMixer = nextMixer;

    runtimes.forEach((runtime, voice) => {
      const mixerChannel = next.mixer.channels[runtime.channel.outputChannelId];

      runtime.chain.update(next.drumVoices[voice]);
      runtime.channelOutput.gain.value = getMixerGain(mixerChannel?.volume ?? 1, mixerChannel?.muted ?? false);
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
