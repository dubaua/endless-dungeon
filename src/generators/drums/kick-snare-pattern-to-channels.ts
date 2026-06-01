import { demoDrumChannels } from '../../sequencer';
import type { DrumChannel, KickDrumChannel, SnareDrumChannel } from '../../sequencer';

const getKickChannel = (channels: readonly DrumChannel[]): KickDrumChannel => {
  return (
    channels.find((channel): channel is KickDrumChannel => channel.voice === 'kick') ??
    demoDrumChannels.find((channel): channel is KickDrumChannel => channel.voice === 'kick')
  ) as KickDrumChannel;
};

const getSnareChannel = (channels: readonly DrumChannel[]): SnareDrumChannel => {
  return (
    channels.find((channel): channel is SnareDrumChannel => channel.voice === 'snare') ??
    demoDrumChannels.find((channel): channel is SnareDrumChannel => channel.voice === 'snare')
  ) as SnareDrumChannel;
};

export const kickSnarePatternToChannels = (
  pattern: string,
  channels: readonly DrumChannel[],
): DrumChannel[] => {
  const kickChannel = getKickChannel(channels);
  const snareChannel = getSnareChannel(channels);
  const kickPattern = [...pattern].map((step) => (step === 'k' ? 1 : 0));
  const snarePattern = [...pattern].map((step) => (step === 's' ? 1 : 0));

  return [
    {
      ...kickChannel,
      pattern: kickPattern,
    },
    {
      ...snareChannel,
      pattern: snarePattern,
    },
  ];
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
