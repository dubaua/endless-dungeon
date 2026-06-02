import { createMemo, createSignal, For, onMount, type Component } from 'solid-js';

import { KickSnarePatternWeights } from '../generators/drums/kick-snare-patterns';
import { generateEightBarDrumPattern } from '../generators/drums/generate-eight-bar-drum-pattern';
import {
  kickSnareChannelsToPattern,
  kickSnarePatternToChannels,
} from '../generators/drums/kick-snare-pattern-to-channels';
import { RelativePatterns } from '../generators/drums/relative-patterns';
import {
  getState,
  setDrumChannels,
  setDrumPatternFilters,
  setDrumPatternStep,
  useStore,
} from '../state/store';
import {
  KickSnarePatternNavigator,
  type KickSnarePatternFilters,
} from './KickSnarePatternNavigator';

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

const getFilteredKickSnarePatterns = (filters: KickSnarePatternFilters) => {
  return [...KickSnarePatternWeights.values()]
    .filter((weight) => {
      const minSyncopationScore = Math.max(0, filters.syncopationScore - filters.syncopationSpread);
      const maxSyncopationScore = Math.min(1, filters.syncopationScore + filters.syncopationSpread);
      const minDensity = Math.max(0, filters.density - filters.densitySpread);
      const maxDensity = Math.min(1, filters.density + filters.densitySpread);

      return (
        weight.syncopationScore >= minSyncopationScore &&
        weight.syncopationScore <= maxSyncopationScore &&
        weight.density >= minDensity &&
        weight.density <= maxDensity
      );
    })
    .sort((left, right) => left.beatCount - right.beatCount);
};

export const DrumsPanel: Component = () => {
  const drumChannels = useStore((state) => state.sequencer.drumChannels);
  const transport = useStore((state) => state.transport);
  const kickSnarePatternFilters = useStore((state) => state.drumPatternFilters);
  const [selectedBarIndex, setSelectedBarIndex] = createSignal(0);
  const [selectedBarPatternIndex, setSelectedBarPatternIndex] = createSignal(0);
  const kickSnarePattern = createMemo(() => kickSnareChannelsToPattern(drumChannels()));
  const kickSnareBarPatterns = createMemo(() => kickSnarePattern().match(/.{1,16}/g) ?? []);
  const selectedBarPattern = createMemo(() => kickSnareBarPatterns()[selectedBarIndex()] ?? '');
  const selectedBarRelativePatterns = createMemo(() =>
    selectedBarPattern() ? (RelativePatterns[selectedBarPattern()] ?? [selectedBarPattern()]) : [],
  );
  const filteredKickSnarePatterns = createMemo(() =>
    getFilteredKickSnarePatterns(kickSnarePatternFilters()),
  );
  const currentKickSnareWeight = createMemo(() => KickSnarePatternWeights.get(selectedBarPattern()));
  const relativeKickSnarePatternCount = createMemo(
    () => selectedBarRelativePatterns().length,
  );

  const setKickSnarePatternFromList = (
    patterns: ReturnType<typeof filteredKickSnarePatterns>,
    index: number,
  ): void => {
    if (patterns.length === 0) {
      return;
    }

    const nextIndex = (index + patterns.length) % patterns.length;
    const nextPattern = patterns[nextIndex]?.pattern;

    if (!nextPattern) {
      return;
    }

    setSelectedBarIndex(0);
    setSelectedBarPatternIndex(nextIndex);
    setDrumChannels(
      kickSnarePatternToChannels(
        generateEightBarDrumPattern(nextPattern),
        getState().sequencer.drumChannels,
      ),
    );
  };

  const setBodyKickSnarePattern = (index: number): void => {
    setKickSnarePatternFromList(filteredKickSnarePatterns(), index);
  };

  const setKickSnareBarPattern = (index: number): void => {
    const relativePatterns = selectedBarRelativePatterns();

    if (relativePatterns.length === 0) {
      return;
    }

    const nextIndex = (index + relativePatterns.length) % relativePatterns.length;
    const nextPattern = relativePatterns[nextIndex];
    const nextBarPatterns = [...kickSnareBarPatterns()];

    if (!nextPattern) {
      return;
    }

    nextBarPatterns[selectedBarIndex()] = nextPattern;
    setSelectedBarPatternIndex(nextIndex);
    setDrumChannels(
      kickSnarePatternToChannels(nextBarPatterns.join(''), getState().sequencer.drumChannels),
    );
  };

  const setKickSnareBarIndex = (index: number): void => {
    setSelectedBarIndex(index);
    setSelectedBarPatternIndex(0);
  };

  const updateKickSnarePatternFilter = (
    key: keyof KickSnarePatternFilters,
    value: number,
  ): void => {
    const nextFilters = { ...kickSnarePatternFilters(), [key]: value };

    setDrumPatternFilters(nextFilters);
    setKickSnarePatternFromList(getFilteredKickSnarePatterns(nextFilters), 0);
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

  const toggleBarStep = (voice: 'k' | 's', barIndex: number, step: number): void => {
    const absoluteStep = barIndex * 16 + step;
    const channel = drumChannels().find((drumChannel) =>
      voice === 'k' ? drumChannel.voice === 'kick' : drumChannel.voice === 'snare',
    );

    if (!channel) {
      return;
    }

    toggleStep(channel.id, absoluteStep, channel.pattern[absoluteStep] ?? 0);
  };

  onMount(() => {
    setBodyKickSnarePattern(0);
  });

  return (
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      <KickSnarePatternNavigator
        barIndex={selectedBarIndex()}
        barPattern={selectedBarPattern()}
        barPatternCount={selectedBarRelativePatterns().length}
        barPatternIndex={selectedBarPatternIndex()}
        filters={kickSnarePatternFilters()}
        pattern={kickSnarePattern()}
        relativePatternCount={relativeKickSnarePatternCount()}
        weight={currentKickSnareWeight()}
        onBarIndexInput={setKickSnareBarIndex}
        onBarPatternIndexInput={setKickSnareBarPattern}
        onFilterInput={updateKickSnarePatternFilter}
      />
      <div style={{ display: 'grid', gap: '0.4rem', overflow: 'auto' }}>
        <For each={[0, 1]}>
          {(rowIndex) => (
            <div
              style={{
                display: 'grid',
                'grid-template-columns': 'repeat(4, minmax(16rem, 1fr))',
                gap: '0.5rem',
                'min-width': '66rem',
              }}
            >
              <For each={kickSnareBarPatterns().slice(rowIndex * 4, rowIndex * 4 + 4)}>
                {(barPattern, barOffset) => {
                  const barIndex = rowIndex * 4 + barOffset();

                  return (
                    <div
                      style={{
                        display: 'grid',
                        gap: '0.3rem',
                        padding: '0.4rem',
                        border: '1px solid #d4d4d4',
                        'border-radius': '0.25rem',
                        background: '#fff',
                        'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        'font-size': '0.72rem',
                      }}
                    >
                      <div style={{ color: '#666' }}>bar {barIndex + 1} {barPattern}</div>
                      <For each={['k', 's'] as const}>
                        {(voice) => (
                          <div
                            style={{
                              display: 'grid',
                              'grid-template-columns': '1.5rem repeat(16, 1fr)',
                              gap: '0.12rem',
                              'align-items': 'center',
                            }}
                          >
                            <span>{voice}</span>
                            <For each={[...barPattern]}>
                              {(stepVoice, step) => {
                                const isActiveStep = (): boolean =>
                                  transport().isPlaying &&
                                  transport().bar % 8 === barIndex &&
                                  transport().step === step();
                                const intensity = (): number => (stepVoice === voice ? 1 : 0);
                                const isDisabled = (): boolean => intensity() <= 0 && stepVoice !== '-';

                                return (
                                  <button
                                    type="button"
                                    aria-label={`bar ${barIndex + 1} ${voice} step ${step() + 1}`}
                                    disabled={isDisabled()}
                                    onClick={() => toggleBarStep(voice, barIndex, step())}
                                    style={{
                                      height: '1.4rem',
                                      padding: 0,
                                      border: `1px solid ${getStepBorder(intensity(), isActiveStep())}`,
                                      'border-radius': '0.15rem',
                                      background: getStepBackground(intensity(), isActiveStep()),
                                      color: intensity() > 0 ? '#fff' : '#737373',
                                      cursor: isDisabled() ? 'not-allowed' : 'pointer',
                                      opacity: isDisabled() ? 0.45 : 1,
                                      'font-size': '0.6rem',
                                    }}
                                  >
                                    {intensity() > 0 ? voice : ''}
                                  </button>
                                );
                              }}
                            </For>
                          </div>
                        )}
                      </For>
                    </div>
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
