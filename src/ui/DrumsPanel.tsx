import { createMemo, createSignal, For, onMount, type Component } from 'solid-js';

import { KickSnarePatternWeights } from '../generators/drums/kick-snare-patterns';
import { hatsPatternToDrumClips } from '../generators/drums/hats-pattern-to-drum-clips';
import { HatsPatternWeights } from '../generators/drums/hats-patterns';
import { kickSnarePatternToDrumClips } from '../generators/drums/kick-snare-pattern-to-drum-clips';
import { RelativeHatsPatterns } from '../generators/drums/relative-hats-patterns';
import { RelativeKickSnarePatterns } from '../generators/drums/relative-kick-snare-patterns';
import type { DrumClip } from '../sequencer/types';
import {
  getState,
  setDrumClips,
  setDrumPatternFilters,
  setDrumPatternStep,
  setHatsPatternFilters,
  useStore,
} from '../state/store';
import {
  KickSnarePatternNavigator,
  type KickSnarePatternFilters,
} from './KickSnarePatternNavigator';
import { HatPatternNavigator } from './HatPatternNavigator';

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

const StepsPerBar = 16;

const getDrumClipIntensityAtStep = (
  clips: readonly DrumClip[],
  synthId: DrumClip['synthId'],
  step: number,
): number => {
  const clip = clips.find((drumClip) => {
    const startStep = drumClip.startBar * StepsPerBar;

    return (
      drumClip.synthId === synthId &&
      step >= startStep &&
      step < startStep + drumClip.pattern.length
    );
  });

  if (!clip) {
    return 0;
  }

  return clip.pattern[step - clip.startBar * StepsPerBar] ?? 0;
};

const drumClipsToKickSnarePattern = (clips: readonly DrumClip[]): string => {
  const barCount = Math.max(
    1,
    ...clips
      .filter((clip) => clip.synthId === 'kick' || clip.synthId === 'snare')
      .map((clip) => clip.startBar + Math.ceil(clip.pattern.length / StepsPerBar)),
  );

  return Array.from({ length: barCount * StepsPerBar }, (_, step) => {
    if (getDrumClipIntensityAtStep(clips, 'kick', step) > 0) {
      return 'k';
    }

    if (getDrumClipIntensityAtStep(clips, 'snare', step) > 0) {
      return 's';
    }

    return '-';
  }).join('');
};

const drumClipsToHatsPattern = (clips: readonly DrumClip[]): string => {
  const barCount = Math.max(
    1,
    ...clips
      .filter((clip) => clip.synthId === 'closedHat' || clip.synthId === 'openHat')
      .map((clip) => clip.startBar + Math.ceil(clip.pattern.length / StepsPerBar)),
  );

  return Array.from({ length: barCount * StepsPerBar }, (_, step) => {
    if (getDrumClipIntensityAtStep(clips, 'openHat', step) > 0) {
      return 'o';
    }

    if (getDrumClipIntensityAtStep(clips, 'closedHat', step) > 0) {
      return 'h';
    }

    return '-';
  }).join('');
};

const drumClipsToClapPattern = (clips: readonly DrumClip[]): string => {
  const barCount = Math.max(
    1,
    ...clips
      .filter((clip) => clip.synthId === 'clap')
      .map((clip) => clip.startBar + Math.ceil(clip.pattern.length / StepsPerBar)),
  );

  return Array.from({ length: barCount * StepsPerBar }, (_, step) => {
    if (getDrumClipIntensityAtStep(clips, 'clap', step) > 0) {
      return 'c';
    }

    return '-';
  }).join('');
};

const getFilteredKickSnarePatterns = (filters: KickSnarePatternFilters) => {
  return [...KickSnarePatternWeights.values()]
    .filter((weight) => {
      const minDensity = Math.max(0, filters.density - filters.densitySpread);
      const maxDensity = Math.min(1, filters.density + filters.densitySpread);

      return (
        weight.syncopationScore >= filters.syncopationScore &&
        weight.density >= minDensity &&
        weight.density <= maxDensity
      );
    })
    .sort((left, right) => left.syncopationScore - right.syncopationScore);
};

const getFilteredHatsPatterns = (filters: KickSnarePatternFilters) => {
  return [...HatsPatternWeights.values()]
    .filter((weight) => {
      const minDensity = Math.max(0, filters.density - filters.densitySpread);
      const maxDensity = Math.min(1, filters.density + filters.densitySpread);

      return (
        weight.syncopationScore >= filters.syncopationScore &&
        weight.density >= minDensity &&
        weight.density <= maxDensity
      );
    })
    .sort((left, right) => left.syncopationScore - right.syncopationScore);
};

export const DrumsPanel: Component = () => {
  const drumClips = useStore((state) => state.sequencer.drumClips);
  const transport = useStore((state) => state.transport);
  const kickSnarePatternFilters = useStore((state) => state.drumPatternFilters);
  const hatsPatternFilters = useStore((state) => state.hatsPatternFilters);
  const [selectedBarIndex, setSelectedBarIndex] = createSignal(0);
  const [selectedBarPatternIndex, setSelectedBarPatternIndex] = createSignal(0);
  const [selectedHatsBarIndex, setSelectedHatsBarIndex] = createSignal(0);
  const [selectedHatsBarPatternIndex, setSelectedHatsBarPatternIndex] = createSignal(0);
  const kickSnarePattern = createMemo(() => drumClipsToKickSnarePattern(drumClips()));
  const hatsPattern = createMemo(() => drumClipsToHatsPattern(drumClips()));
  const clapPattern = createMemo(() => drumClipsToClapPattern(drumClips()));
  const kickSnareBarPatterns = createMemo(() => kickSnarePattern().match(/.{1,16}/g) ?? []);
  const hatsBarPatterns = createMemo(() => hatsPattern().match(/.{1,16}/g) ?? []);
  const clapBarPatterns = createMemo(() => clapPattern().match(/.{1,16}/g) ?? []);
  const selectedBarPattern = createMemo(() => kickSnareBarPatterns()[selectedBarIndex()] ?? '');
  const selectedHatsBarPattern = createMemo(() => hatsBarPatterns()[selectedHatsBarIndex()] ?? '');
  const selectedBarRelativePatterns = createMemo(() =>
    selectedBarPattern()
      ? (RelativeKickSnarePatterns[selectedBarPattern()] ?? [selectedBarPattern()])
      : [],
  );
  const selectedHatsBarRelativePatterns = createMemo(() =>
    selectedHatsBarPattern()
      ? (RelativeHatsPatterns[selectedHatsBarPattern()] ?? [selectedHatsBarPattern()])
      : [],
  );
  const filteredKickSnarePatterns = createMemo(() =>
    getFilteredKickSnarePatterns(kickSnarePatternFilters()),
  );
  const filteredHatsPatterns = createMemo(() => getFilteredHatsPatterns(hatsPatternFilters()));
  const currentKickSnareWeight = createMemo(() =>
    KickSnarePatternWeights.get(selectedBarPattern()),
  );
  const currentKickSnareSyncopationScore = createMemo(() => currentKickSnareWeight()?.syncopationScore);
  const currentHatsWeight = createMemo(() => HatsPatternWeights.get(selectedHatsBarPattern()));
  const relativeKickSnarePatternCount = createMemo(() => selectedBarRelativePatterns().length);
  const relativeHatsPatternCount = createMemo(() => selectedHatsBarRelativePatterns().length);

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
    setDrumClips(kickSnarePatternToDrumClips(nextPattern, getState().sequencer.drumClips));
  };

  const setHatsPatternFromList = (
    patterns: ReturnType<typeof filteredHatsPatterns>,
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

    setSelectedHatsBarIndex(0);
    setSelectedHatsBarPatternIndex(nextIndex);
    setDrumClips(hatsPatternToDrumClips(nextPattern, getState().sequencer.drumClips));
  };

  const setBodyKickSnarePattern = (index: number): void => {
    setKickSnarePatternFromList(filteredKickSnarePatterns(), index);
  };

  const setKickSnarePatternFromInput = (pattern: string): void => {
    if (!/^[ks-]{16}$/.test(pattern)) {
      return;
    }

    setSelectedBarIndex(0);
    setDrumClips(kickSnarePatternToDrumClips(pattern, getState().sequencer.drumClips));
  };

  const randomizeBodyKickSnarePattern = (): void => {
    const patterns = filteredKickSnarePatterns();

    if (patterns.length === 0) {
      return;
    }

    setKickSnarePatternFromList(patterns, Math.floor(Math.random() * patterns.length));
  };

  const setBodyHatsPattern = (index: number): void => {
    setHatsPatternFromList(filteredHatsPatterns(), index);
  };

  const randomizeBodyHatsPattern = (): void => {
    const patterns = filteredHatsPatterns();

    if (patterns.length === 0) {
      return;
    }

    setHatsPatternFromList(patterns, Math.floor(Math.random() * patterns.length));
  };

  const updateKickSnarePatternFilter = (
    key: keyof KickSnarePatternFilters,
    value: number,
  ): void => {
    const nextFilters = { ...kickSnarePatternFilters(), [key]: value };

    setDrumPatternFilters(nextFilters);
    setKickSnarePatternFromList(getFilteredKickSnarePatterns(nextFilters), 0);
  };

  const updateHatsPatternFilter = (key: keyof KickSnarePatternFilters, value: number): void => {
    const nextFilters = { ...hatsPatternFilters(), [key]: value };

    setHatsPatternFilters(nextFilters);
    setHatsPatternFromList(getFilteredHatsPatterns(nextFilters), 0);
  };

  const hasOtherDrumAtStep = (channelId: string, step: number): boolean => {
    const channel = drumClips().find((drumChannel) => drumChannel.id === channelId);

    if (!channel || (channel.synthId !== 'kick' && channel.synthId !== 'snare')) {
      return false;
    }

    return drumClips().some((drumChannel) => {
      if (drumChannel.id === channelId) {
        return false;
      }

      if (drumChannel.synthId !== 'kick' && drumChannel.synthId !== 'snare') {
        return false;
      }

      return getDrumClipIntensityAtStep([drumChannel], drumChannel.synthId, step) > 0;
    });
  };

  const hasOtherHatAtStep = (channelId: string, step: number): boolean => {
    const channel = drumClips().find((drumChannel) => drumChannel.id === channelId);

    if (!channel || (channel.synthId !== 'closedHat' && channel.synthId !== 'openHat')) {
      return false;
    }

    return drumClips().some((drumChannel) => {
      if (drumChannel.id === channelId) {
        return false;
      }

      if (drumChannel.synthId !== 'closedHat' && drumChannel.synthId !== 'openHat') {
        return false;
      }

      return getDrumClipIntensityAtStep([drumChannel], drumChannel.synthId, step) > 0;
    });
  };

  const toggleStep = (
    channelId: string,
    step: number,
    patternStep: number,
    intensity: number,
  ): void => {
    if (intensity <= 0 && hasOtherDrumAtStep(channelId, step)) {
      return;
    }

    setDrumPatternStep(channelId, patternStep, intensity > 0 ? 0 : 1);
  };

  const toggleHatStep = (
    channelId: string,
    step: number,
    patternStep: number,
    intensity: number,
  ): void => {
    if (intensity <= 0 && hasOtherHatAtStep(channelId, step)) {
      return;
    }

    setDrumPatternStep(channelId, patternStep, intensity > 0 ? 0 : 1);
  };

  const toggleBarStep = (voice: 'k' | 's', barIndex: number, step: number): void => {
    const absoluteStep = barIndex * 16 + step;
    const channel = drumClips().find((drumChannel) => {
      const startStep = drumChannel.startBar * StepsPerBar;
      const isVoice =
        voice === 'k' ? drumChannel.synthId === 'kick' : drumChannel.synthId === 'snare';

      return (
        isVoice &&
        absoluteStep >= startStep &&
        absoluteStep < startStep + drumChannel.pattern.length
      );
    });

    if (!channel) {
      return;
    }

    toggleStep(
      channel.id,
      absoluteStep,
      absoluteStep - channel.startBar * StepsPerBar,
      getDrumClipIntensityAtStep([channel], channel.synthId, absoluteStep),
    );
  };

  const toggleHatBarStep = (voice: 'h' | 'o', barIndex: number, step: number): void => {
    const absoluteStep = barIndex * 16 + step;
    const channel = drumClips().find((drumChannel) => {
      const startStep = drumChannel.startBar * StepsPerBar;
      const isVoice =
        voice === 'h' ? drumChannel.synthId === 'closedHat' : drumChannel.synthId === 'openHat';

      return (
        isVoice &&
        absoluteStep >= startStep &&
        absoluteStep < startStep + drumChannel.pattern.length
      );
    });

    if (!channel) {
      return;
    }

    toggleHatStep(
      channel.id,
      absoluteStep,
      absoluteStep - channel.startBar * StepsPerBar,
      getDrumClipIntensityAtStep([channel], channel.synthId, absoluteStep),
    );
  };

  const toggleClapBarStep = (barIndex: number, step: number): void => {
    const absoluteStep = barIndex * 16 + step;
    const channel = drumClips().find((drumChannel) => {
      const startStep = drumChannel.startBar * StepsPerBar;

      return (
        drumChannel.synthId === 'clap' &&
        absoluteStep >= startStep &&
        absoluteStep < startStep + drumChannel.pattern.length
      );
    });

    if (!channel) {
      return;
    }

    setDrumPatternStep(
      channel.id,
      absoluteStep - channel.startBar * StepsPerBar,
      getDrumClipIntensityAtStep([channel], channel.synthId, absoluteStep) > 0 ? 0 : 1,
    );
  };

  onMount(() => {
    setBodyKickSnarePattern(0);
    setBodyHatsPattern(0);
  });

  return (
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      <KickSnarePatternNavigator
        barIndex={selectedBarIndex()}
        barPattern={selectedBarPattern()}
        barPatternCount={filteredKickSnarePatterns().length}
        barPatternIndex={selectedBarPatternIndex()}
        filters={kickSnarePatternFilters()}
        pattern={kickSnarePattern()}
        relativePatternCount={relativeKickSnarePatternCount()}
        syncopationScore={currentKickSnareSyncopationScore()}
        weight={currentKickSnareWeight()}
        onBarPatternIndexInput={setBodyKickSnarePattern}
        onFilterInput={updateKickSnarePatternFilter}
        onPatternInput={setKickSnarePatternFromInput}
        onRandomPatternInput={randomizeBodyKickSnarePattern}
      />
      <HatPatternNavigator
        barIndex={selectedHatsBarIndex()}
        barPattern={selectedHatsBarPattern()}
        barPatternCount={filteredHatsPatterns().length}
        barPatternIndex={selectedHatsBarPatternIndex()}
        filters={hatsPatternFilters()}
        pattern={hatsPattern()}
        relativePatternCount={relativeHatsPatternCount()}
        weight={currentHatsWeight()}
        onBarPatternIndexInput={setBodyHatsPattern}
        onFilterInput={updateHatsPatternFilter}
        onRandomPatternInput={randomizeBodyHatsPattern}
      />
      <div style={{ display: 'grid', gap: '0.4rem', overflow: 'auto' }}>
        <For each={[0]}>
          {(rowIndex) => (
            <div
              style={{
                display: 'grid',
                'grid-template-columns': 'minmax(16rem, 1fr)',
                gap: '0.5rem',
                'min-width': '16rem',
              }}
            >
              <For each={kickSnareBarPatterns().slice(rowIndex * 4, rowIndex * 4 + 4)}>
                {(barPattern, barOffset) => {
                  const barIndex = (): number => rowIndex * 4 + barOffset();
                  const hatsBarPattern = (): string => hatsBarPatterns()[barIndex()] ?? '';
                  const clapBarPattern = (): string => clapBarPatterns()[barIndex()] ?? '';

                  return (
                    <div
                      style={{
                        display: 'grid',
                        gap: '0.3rem',
                        padding: '0.4rem',
                        border: '1px solid #d4d4d4',
                        'border-radius': '0.25rem',
                        background: '#fff',
                        'font-family':
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        'font-size': '0.72rem',
                      }}
                    >
                      <div style={{ color: '#666' }}>
                        bar {barIndex() + 1} {barPattern} {clapBarPattern()} {hatsBarPattern()}
                      </div>
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
                                  transport().bar % kickSnareBarPatterns().length === barIndex() &&
                                  transport().step === step();
                                const intensity = (): number => (stepVoice === voice ? 1 : 0);
                                const isDisabled = (): boolean =>
                                  intensity() <= 0 && stepVoice !== '-';

                                return (
                                  <button
                                    type="button"
                                    aria-label={`bar ${barIndex() + 1} ${voice} step ${step() + 1}`}
                                    disabled={isDisabled()}
                                    onClick={() => toggleBarStep(voice, barIndex(), step())}
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
                      <div
                        style={{
                          display: 'grid',
                          'grid-template-columns': '1.5rem repeat(16, 1fr)',
                          gap: '0.12rem',
                          'align-items': 'center',
                        }}
                      >
                        <span>c</span>
                        <For each={[...clapBarPattern()]}>
                          {(stepVoice, step) => {
                            const isActiveStep = (): boolean =>
                              transport().isPlaying &&
                              transport().bar % clapBarPatterns().length === barIndex() &&
                              transport().step === step();
                            const intensity = (): number => (stepVoice === 'c' ? 1 : 0);

                            return (
                              <button
                                type="button"
                                aria-label={`bar ${barIndex() + 1} clap step ${step() + 1}`}
                                onClick={() => toggleClapBarStep(barIndex(), step())}
                                style={{
                                  height: '1.4rem',
                                  padding: 0,
                                  border: `1px solid ${getStepBorder(intensity(), isActiveStep())}`,
                                  'border-radius': '0.15rem',
                                  background: getStepBackground(intensity(), isActiveStep()),
                                  color: intensity() > 0 ? '#fff' : '#737373',
                                  cursor: 'pointer',
                                  opacity: 1,
                                  'font-size': '0.6rem',
                                }}
                              >
                                {intensity() > 0 ? 'c' : ''}
                              </button>
                            );
                          }}
                        </For>
                      </div>
                      <For each={['h', 'o'] as const}>
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
                            <For each={[...hatsBarPattern()]}>
                              {(stepVoice, step) => {
                                const isActiveStep = (): boolean =>
                                  transport().isPlaying &&
                                  transport().bar % hatsBarPatterns().length === barIndex() &&
                                  transport().step === step();
                                const intensity = (): number => (stepVoice === voice ? 1 : 0);
                                const isDisabled = (): boolean =>
                                  intensity() <= 0 && stepVoice !== '-';

                                return (
                                  <button
                                    type="button"
                                    aria-label={`bar ${barIndex() + 1} ${voice} step ${step() + 1}`}
                                    disabled={isDisabled()}
                                    onClick={() => toggleHatBarStep(voice, barIndex(), step())}
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
