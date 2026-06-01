import { createMemo, createSignal, For, onMount, type Component } from 'solid-js';

import { KickSnarePatterns } from '../generators/drums/kick-snare-patterns';
import {
  kickSnareChannelsToPattern,
  kickSnarePatternToChannels,
} from '../generators/drums/kick-snare-pattern-to-channels';
import { getState, setDrumChannels, setDrumPatternStep, useStore } from '../state/store';
import { KickSnarePatternNavigator } from './KickSnarePatternNavigator';

const getStepBackground = (intensity: number, isCurrentStep: boolean): string => {
  if (isCurrentStep) {
    return intensity > 0 ? '#ef4444' : '#fee2e2';
  }

  return intensity > 0 ? '#111827' : '#f5f5f5';
};

const getStepBorder = (intensity: number, isCurrentStep: boolean): string => {
  if (isCurrentStep) {
    return '#b91c1c';
  }

  return intensity > 0 ? '#111827' : '#d4d4d4';
};

export const DrumsPanel: Component = () => {
  const drumChannels = useStore((state) => state.sequencer.drumChannels);
  const transport = useStore((state) => state.transport);
  const [kickSnarePatternIndex, setKickSnarePatternIndex] = createSignal(0);
  const kickSnarePattern = createMemo(() => kickSnareChannelsToPattern(drumChannels()));

  const setKickSnarePattern = (index: number): void => {
    const nextIndex = (index + KickSnarePatterns.length) % KickSnarePatterns.length;
    const nextPattern = KickSnarePatterns[nextIndex];

    if (!nextPattern) {
      return;
    }

    setKickSnarePatternIndex(nextIndex);
    setDrumChannels(kickSnarePatternToChannels(nextPattern, getState().sequencer.drumChannels));
  };

  const hasOtherDrumAtStep = (channelId: string, step: number): boolean => {
    const channel = drumChannels().find((drumChannel) => drumChannel.id === channelId);

    if (!channel || (channel.voice !== 'kick' && channel.voice !== 'snare')) {
      return false;
    }

    return drumChannels().some((drumChannel) => {
      if (drumChannel.id === channelId) {
        return false;
      }

      if (drumChannel.voice !== 'kick' && drumChannel.voice !== 'snare') {
        return false;
      }

      return (drumChannel.pattern[step] ?? 0) > 0;
    });
  };

  const toggleStep = (channelId: string, step: number, intensity: number): void => {
    if (intensity <= 0 && hasOtherDrumAtStep(channelId, step)) {
      return;
    }

    setDrumPatternStep(channelId, step, intensity > 0 ? 0 : 1);
  };

  onMount(() => {
    setKickSnarePattern(0);
  });

  return (
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      <KickSnarePatternNavigator
        pattern={kickSnarePattern()}
        onPrevious={() => setKickSnarePattern(kickSnarePatternIndex() - 1)}
        onNext={() => setKickSnarePattern(kickSnarePatternIndex() + 1)}
      />
      <div
        style={{
          display: 'grid',
          gap: '0.35rem',
          overflow: 'auto',
          'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          'font-size': '0.78rem',
        }}
      >
        <For each={drumChannels()}>
          {(channel) => (
            <div
              style={{
                display: 'grid',
                'grid-template-columns': '8rem repeat(16, 1.8rem)',
                gap: '0.2rem',
                'align-items': 'center',
                'min-width': '38rem',
              }}
            >
              <span style={{ 'white-space': 'nowrap' }}>{channel.name}</span>
              <For each={channel.pattern}>
                {(intensity, step) => {
                  const isCurrentStep = (): boolean =>
                    transport().isPlaying && step() === transport().step % channel.pattern.length;
                  const isDisabled = (): boolean =>
                    intensity <= 0 && hasOtherDrumAtStep(channel.id, step());

                  return (
                    <button
                      type="button"
                      aria-label={`${channel.name} step ${step() + 1}`}
                      disabled={isDisabled()}
                      onClick={() => toggleStep(channel.id, step(), intensity)}
                      style={{
                        width: '1.8rem',
                        height: '1.8rem',
                        padding: 0,
                        border: `1px solid ${getStepBorder(intensity, isCurrentStep())}`,
                        'border-radius': '0.2rem',
                        background: getStepBackground(intensity, isCurrentStep()),
                        color: intensity > 0 ? '#fff' : '#737373',
                        cursor: isDisabled() ? 'not-allowed' : 'pointer',
                        opacity: isDisabled() ? 0.45 : 1,
                        'font-size': '0.65rem',
                        'font-variant-numeric': 'tabular-nums',
                      }}
                    >
                      {intensity > 0 ? intensity : ''}
                    </button>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>
    </section>
  );
};
