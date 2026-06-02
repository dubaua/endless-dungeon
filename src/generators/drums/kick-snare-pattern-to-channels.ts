import { InitialDrumChannels } from '../../sequencer/drum-channels';
import type { DrumChannel, KickDrumChannel, SnareDrumChannel } from '../../sequencer/types';

const getKickChannel = (channels: readonly DrumChannel[]): KickDrumChannel => {
  return (
    channels.find((channel): channel is KickDrumChannel => channel.voice === 'kick') ??
    InitialDrumChannels.find((channel): channel is KickDrumChannel => channel.voice === 'kick')
  ) as KickDrumChannel;
};

const getSnareChannel = (channels: readonly DrumChannel[]): SnareDrumChannel => {
  return (
    channels.find((channel): channel is SnareDrumChannel => channel.voice === 'snare') ??
    InitialDrumChannels.find((channel): channel is SnareDrumChannel => channel.voice === 'snare')
  ) as SnareDrumChannel;
};

export const kickSnarePatternToChannels = (
  pattern: string,
  channels: readonly DrumChannel[],
): DrumChannel[] => {
  const channelsByVoice = new Map(channels.map((channel) => [channel.voice, channel]));
  const baseChannels = InitialDrumChannels.map(
    (channel) => channelsByVoice.get(channel.voice) ?? channel,
  );
  const kickPattern = [...pattern].map((step) => (step === 'k' ? 1 : 0));
  const snarePattern = [...pattern].map((step) => (step === 's' ? 1 : 0));

  return baseChannels.map((channel) => {
    if (channel.voice === 'kick') {
      return {
        ...getKickChannel(baseChannels),
        pattern: kickPattern,
      };
    }

    if (channel.voice === 'snare') {
      return {
        ...getSnareChannel(baseChannels),
        pattern: snarePattern,
      };
    }

    return channel;
  });
};

export const kickSnareChannelsToPattern = (channels: readonly DrumChannel[]): string => {
  const kickChannel = channels.find((channel) => channel.voice === 'kick');
  const snareChannel = channels.find((channel) => channel.voice === 'snare');
  const patternLength = Math.max(kickChannel?.pattern.length ?? 0, snareChannel?.pattern.length ?? 0);

  return Array.from({ length: patternLength }, (_, index) => {
    const hasKick = (kickChannel?.pattern[index] ?? 0) > 0;
    const hasSnare = (snareChannel?.pattern[index] ?? 0) > 0;

    if (hasKick) {
      return 'k';
    }

    if (hasSnare) {
      return 's';
    }

    return '-';
  }).join('');
};
