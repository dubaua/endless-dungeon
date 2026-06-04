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

const isStrongStep = (step: number): boolean => step % 4 === 0;

const getStepBackground = (intensity: number, isCurrentStep: boolean, isStrong: boolean): string => {
  if (isCurrentStep) {
    return intensity > 0 ? '#ef4444' : '#fee2e2';
  }

  if (isStrong && intensity <= 0) {
    return '#e5e7eb';
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
      .filter((clip) => clip.synthId === 'kickPrimary' || clip.synthId === 'snarePrimary')
      .map((clip) => clip.startBar + Math.ceil(clip.pattern.length / StepsPerBar)),
  );

  return Array.from({ length: barCount * StepsPerBar }, (_, step) => {
    if (getDrumClipIntensityAtStep(clips, 'kickPrimary', step) > 0) {
      return 'k';
    }

    if (getDrumClipIntensityAtStep(clips, 'snarePrimary', step) > 0) {
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

const drumClipsToDrumPattern = (
  clips: readonly DrumClip[],
  synthId: DrumClip['synthId'],
  activeStep: string,
): string => {
  const barCount = Math.max(
    1,
    ...clips
      .filter((clip) => clip.synthId === synthId)
      .map((clip) => clip.startBar + Math.ceil(clip.pattern.length / StepsPerBar)),
  );

  return Array.from({ length: barCount * StepsPerBar }, (_, step) => {
    if (getDrumClipIntensityAtStep(clips, synthId, step) > 0) {
      return activeStep;
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
  const kickPrimaryPattern = createMemo(() => drumClipsToDrumPattern(drumClips(), 'kickPrimary', 'K'));
  const kickSecondaryPattern = createMemo(() => drumClipsToDrumPattern(drumClips(), 'kickSecondary', 'K'));
  const snarePrimaryPattern = createMemo(() => drumClipsToDrumPattern(drumClips(), 'snarePrimary', 'S'));
  const snareSecondaryPattern = createMemo(() => drumClipsToDrumPattern(drumClips(), 'snareSecondary', 'S'));
  const clapPrimaryPattern = createMemo(() => drumClipsToDrumPattern(drumClips(), 'clapPrimary', 'P'));
  const clapSecondaryPattern = createMemo(() => drumClipsToDrumPattern(drumClips(), 'clapSecondary', 'C'));
  const closedHatPattern = createMemo(() => drumClipsToDrumPattern(drumClips(), 'closedHat', 'H'));
  const openHatPattern = createMemo(() => drumClipsToDrumPattern(drumClips(), 'openHat', 'O'));
  const ridePattern = createMemo(() => drumClipsToDrumPattern(drumClips(), 'ride', 'R'));
  const crashPattern = createMemo(() => drumClipsToDrumPattern(drumClips(), 'crash', 'C'));
  const kickSnareBarPatterns = createMemo(() => kickSnarePattern().match(/.{1,16}/g) ?? []);
  const hatsBarPatterns = createMemo(() => hatsPattern().match(/.{1,16}/g) ?? []);
  const kickPrimaryBarPatterns = createMemo(() => kickPrimaryPattern().match(/.{1,16}/g) ?? []);
  const kickSecondaryBarPatterns = createMemo(() => kickSecondaryPattern().match(/.{1,16}/g) ?? []);
  const snarePrimaryBarPatterns = createMemo(() => snarePrimaryPattern().match(/.{1,16}/g) ?? []);
  const snareSecondaryBarPatterns = createMemo(() => snareSecondaryPattern().match(/.{1,16}/g) ?? []);
  const clapPrimaryBarPatterns = createMemo(() => clapPrimaryPattern().match(/.{1,16}/g) ?? []);
  const clapSecondaryBarPatterns = createMemo(() => clapSecondaryPattern().match(/.{1,16}/g) ?? []);
  const closedHatBarPatterns = createMemo(() => closedHatPattern().match(/.{1,16}/g) ?? []);
  const openHatBarPatterns = createMemo(() => openHatPattern().match(/.{1,16}/g) ?? []);
  const rideBarPatterns = createMemo(() => ridePattern().match(/.{1,16}/g) ?? []);
  const crashBarPatterns = createMemo(() => crashPattern().match(/.{1,16}/g) ?? []);
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

  const toggleStep = (
    channelId: string,
    patternStep: number,
    intensity: number,
  ): void => {
    setDrumPatternStep(channelId, patternStep, intensity > 0 ? 0 : 1);
  };

  const toggleHatStep = (
    channelId: string,
    patternStep: number,
    intensity: number,
  ): void => {
    setDrumPatternStep(channelId, patternStep, intensity > 0 ? 0 : 1);
  };

  const toggleBarStep = (voice: 'k' | 's', barIndex: number, step: number): void => {
    const absoluteStep = barIndex * 16 + step;
    const channel = drumClips().find((drumChannel) => {
      const startStep = drumChannel.startBar * StepsPerBar;
      const isVoice =
        voice === 'k' ? drumChannel.synthId === 'kickPrimary' : drumChannel.synthId === 'snarePrimary';

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
      absoluteStep - channel.startBar * StepsPerBar,
      getDrumClipIntensityAtStep([channel], channel.synthId, absoluteStep),
    );
  };

  const toggleDrumBarStep = (synthId: DrumClip['synthId'], barIndex: number, step: number): void => {
    const absoluteStep = barIndex * 16 + step;
    const channel = drumClips().find((drumChannel) => {
      const startStep = drumChannel.startBar * StepsPerBar;

      return (
        drumChannel.synthId === synthId &&
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

  const resetPrimaryBarPattern = (voice: 'k' | 's', barIndex: number): void => {
    const nextBarPatterns = [...kickSnareBarPatterns()];
    const barPattern = nextBarPatterns[barIndex] ?? '';

    nextBarPatterns[barIndex] = [...barPattern]
      .map((stepVoice) => (stepVoice === voice ? '-' : stepVoice))
      .join('');
    setDrumClips(kickSnarePatternToDrumClips(nextBarPatterns.join(''), getState().sequencer.drumClips));
  };

  const resetHatBarPattern = (voice: 'h' | 'o', barIndex: number): void => {
    const nextBarPatterns = [...hatsBarPatterns()];
    const barPattern = nextBarPatterns[barIndex] ?? '';

    nextBarPatterns[barIndex] = [...barPattern]
      .map((stepVoice) => (stepVoice === voice ? '-' : stepVoice))
      .join('');
    setDrumClips(hatsPatternToDrumClips(nextBarPatterns.join(''), getState().sequencer.drumClips));
  };

  const resetDrumBarPattern = (synthId: DrumClip['synthId'], barIndex: number): void => {
    const channel = drumClips().find((drumChannel) => drumChannel.synthId === synthId && drumChannel.startBar === barIndex);

    if (!channel) {
      return;
    }

    channel.pattern.forEach((intensity, step) => {
      if (intensity > 0) {
        setDrumPatternStep(channel.id, step, 0);
      }
    });
  };

  onMount(() => {
    setBodyKickSnarePattern(0);
    setBodyHatsPattern(0);
  });

  return (
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      <KickSnarePatternNavigator
        barIndex={selectedBarIndex()}
        barPatternCount={filteredKickSnarePatterns().length}
        barPatternIndex={selectedBarPatternIndex()}
        filters={kickSnarePatternFilters()}
        relativePatternCount={relativeKickSnarePatternCount()}
        syncopationScore={currentKickSnareSyncopationScore()}
        weight={currentKickSnareWeight()}
        onBarPatternIndexInput={setBodyKickSnarePattern}
        onFilterInput={updateKickSnarePatternFilter}
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
                {(_, barOffset) => {
                  const barIndex = (): number => rowIndex * 4 + barOffset();
                  const drumRows = () => [
                    {
                      type: 'numeric',
                      label: 'KP',
                      synthId: 'kickPrimary' as const,
                      pattern: kickPrimaryBarPatterns()[barIndex()] ?? '',
                      activeStep: 'K',
                    },
                    {
                      type: 'numeric',
                      label: 'KS',
                      synthId: 'kickSecondary' as const,
                      pattern: kickSecondaryBarPatterns()[barIndex()] ?? '',
                      activeStep: 'K',
                    },
                    {
                      type: 'numeric',
                      label: 'SP',
                      synthId: 'snarePrimary' as const,
                      pattern: snarePrimaryBarPatterns()[barIndex()] ?? '',
                      activeStep: 'S',
                    },
                    {
                      type: 'numeric',
                      label: 'SS',
                      synthId: 'snareSecondary' as const,
                      pattern: snareSecondaryBarPatterns()[barIndex()] ?? '',
                      activeStep: 'S',
                    },
                    {
                      type: 'numeric',
                      label: 'CP',
                      synthId: 'clapPrimary' as const,
                      pattern: clapPrimaryBarPatterns()[barIndex()] ?? '',
                      activeStep: 'P',
                    },
                    {
                      type: 'numeric',
                      label: 'CS',
                      synthId: 'clapSecondary' as const,
                      pattern: clapSecondaryBarPatterns()[barIndex()] ?? '',
                      activeStep: 'C',
                    },
                    {
                      type: 'numeric',
                      label: 'H',
                      synthId: 'closedHat' as const,
                      pattern: closedHatBarPatterns()[barIndex()] ?? '',
                      activeStep: 'H',
                    },
                    {
                      type: 'numeric',
                      label: 'O',
                      synthId: 'openHat' as const,
                      pattern: openHatBarPatterns()[barIndex()] ?? '',
                      activeStep: 'O',
                    },
                    {
                      type: 'numeric',
                      label: 'R',
                      synthId: 'ride' as const,
                      pattern: rideBarPatterns()[barIndex()] ?? '',
                      activeStep: 'R',
                    },
                    {
                      type: 'numeric',
                      label: 'C',
                      synthId: 'crash' as const,
                      pattern: crashBarPatterns()[barIndex()] ?? '',
                      activeStep: 'C',
                    },
                  ];

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
                        bar {barIndex() + 1}
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          'grid-template-columns': '1.5rem repeat(16, 1fr) 3.6rem',
                          gap: '0.12rem',
                          'align-items': 'center',
                          color: '#737373',
                          'font-size': '0.58rem',
                        }}
                      >
                        <span />
                        <For each={Array.from({ length: 16 }, (_, index) => index)}>
                          {(step) => (
                            <span
                              style={{
                                'text-align': 'center',
                                background: isStrongStep(step) ? '#e5e7eb' : 'transparent',
                                'border-radius': '0.12rem',
                              }}
                            >
                              {step + 1}
                            </span>
                          )}
                        </For>
                        <span />
                      </div>
                      <For each={drumRows()}>
                        {(row) => (
                          <div
                            style={{
                              display: 'grid',
                              'grid-template-columns': '1.5rem repeat(16, 1fr) 3.6rem',
                              gap: '0.12rem',
                              'align-items': 'center',
                            }}
                          >
                            <span>{row.label}</span>
                            <For each={[...row.pattern]}>
                              {(stepVoice, step) => {
                                const isActiveStep = (): boolean =>
                                  transport().isPlaying &&
                                  transport().bar % kickSnareBarPatterns().length === barIndex() &&
                                  transport().step === step();
                                const intensity = (): number => (stepVoice === row.activeStep ? 1 : 0);

                                return (
                                  <button
                                    type="button"
                                    aria-label={`bar ${barIndex() + 1} ${row.label} step ${step() + 1}`}
                                    onClick={() => {
                                      toggleDrumBarStep(row.synthId as DrumClip['synthId'], barIndex(), step());
                                    }}
                                    style={{
                                      height: '1.4rem',
                                      padding: 0,
                                      border: `1px solid ${getStepBorder(intensity(), isActiveStep())}`,
                                      'border-radius': '0.15rem',
                                      background: getStepBackground(intensity(), isActiveStep(), isStrongStep(step())),
                                      color: intensity() > 0 ? '#fff' : '#737373',
                                      cursor: 'pointer',
                                      opacity: 1,
                                      'font-size': '0.6rem',
                                    }}
                                  >
                                    {intensity() > 0 ? row.label : ''}
                                  </button>
                                );
                              }}
                            </For>
                            <button
                              type="button"
                              onClick={() => {
                                resetDrumBarPattern(row.synthId as DrumClip['synthId'], barIndex());
                              }}
                              style={{
                                height: '1.4rem',
                                padding: '0 0.35rem',
                                border: '1px solid #d4d4d4',
                                'border-radius': '0.15rem',
                                background: '#fff',
                                color: '#525252',
                                cursor: 'pointer',
                                'font-size': '0.6rem',
                              }}
                            >
                              reset
                            </button>
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
