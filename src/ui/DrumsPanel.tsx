import { createMemo, createSignal, For, onMount, type Component } from 'solid-js';

import { KickOffbeatPatternWeights } from '../generators/drums/kick-offbeat-patterns';
import { hatsPatternToDrumClips } from '../generators/drums/hats-pattern-to-drum-clips';
import { HatsPatternWeights } from '../generators/drums/hats-patterns';
import { RelativeHatsPatterns } from '../generators/drums/relative-hats-patterns';
import { RelativeKickOffbeatPatterns } from '../generators/drums/relative-kick-offbeat-patterns';
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
  KickOffbeatPatternNavigator,
  type KickOffbeatPatternFilters,
} from './KickOffbeatPatternNavigator';
import { HatPatternNavigator } from './HatPatternNavigator';
import { takeRandomItems } from '../utils/take-random-items';

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

const StepsPerBar = 16;
const EditorBarCount = 4;
const EditorStepCount = StepsPerBar * EditorBarCount;
const EmptyBarPattern = '-'.repeat(StepsPerBar);
const RelativePatternPickCount = 2;

type OffbeatPrimarySynthId = 'snarePrimary' | 'clapPrimary';
type OffbeatSecondarySynthId = 'snareSecondary' | 'clapSecondary';

const DrumRows: readonly { label: string; synthId: DrumClip['synthId']; patternStep: string }[] = [
  { label: 'KP', synthId: 'kickPrimary', patternStep: 'K' },
  { label: 'KS', synthId: 'kickSecondary', patternStep: 'K' },
  { label: 'SP', synthId: 'snarePrimary', patternStep: 'S' },
  { label: 'SS', synthId: 'snareSecondary', patternStep: 'S' },
  { label: 'CP', synthId: 'clapPrimary', patternStep: 'P' },
  { label: 'CS', synthId: 'clapSecondary', patternStep: 'C' },
  { label: 'HH', synthId: 'closedHat', patternStep: 'H' },
  { label: 'OH', synthId: 'openHat', patternStep: 'O' },
  { label: 'RD', synthId: 'ride', patternStep: 'R' },
  { label: 'CR', synthId: 'crash', patternStep: 'C' },
];

const arrangeRelativeBeatPatterns = (
  pattern: string,
  relativePatterns: readonly string[],
): string[] => {
  const pickedPatterns = takeRandomItems(
    relativePatterns.length > 0 ? relativePatterns : [pattern],
    RelativePatternPickCount,
  );

  return [pattern, pickedPatterns[0], pattern, pickedPatterns[1]];
};

const arrangeRelativeKickOffbeatPatterns = (pattern: string): string[] => {
  return arrangeRelativeBeatPatterns(pattern, RelativeKickOffbeatPatterns[pattern] ?? []);
};

const arrangeRelativeHatsPatterns = (pattern: string): string[] => {
  return arrangeRelativeBeatPatterns(pattern, RelativeHatsPatterns[pattern] ?? []);
};

const fillEditorPattern = (pattern: string): string => {
  return `${pattern}${EmptyBarPattern.repeat(EditorBarCount)}`.slice(0, EditorStepCount);
};

const isBarEndStep = (step: number): boolean => step % StepsPerBar === StepsPerBar - 1;

const patternToClips = (synthId: DrumClip['synthId'], pattern: number[]): DrumClip[] =>
  Array.from({ length: Math.ceil(pattern.length / StepsPerBar) }, (_, index) => ({
    id: `drum-${synthId}-bar-${index + 1}`,
    synthId,
    startBar: index,
    pattern: pattern.slice(index * StepsPerBar, (index + 1) * StepsPerBar),
  }));

const kickOffbeatPatternToConfiguredDrumClips = (
  pattern: string,
  clips: readonly DrumClip[],
  primarySynthId: OffbeatPrimarySynthId,
  secondarySynthId: OffbeatSecondarySynthId,
): DrumClip[] => {
  const kickPattern = [...pattern].map((step) => (step === 'k' || step === 'x' ? 1 : 0));
  const primaryOffbeatPattern = [...pattern].map((step) => (step === 'O' || step === 'x' ? 1 : 0));
  const secondaryOffbeatPattern = [...pattern].map((step) => (step === 'o' ? 1 : 0));

  return [
    ...patternToClips('kickPrimary', kickPattern),
    ...patternToClips(primarySynthId, primaryOffbeatPattern),
    ...patternToClips(secondarySynthId, secondaryOffbeatPattern),
    ...clips.filter(
      (clip) =>
        clip.synthId !== 'kickPrimary' &&
        clip.synthId !== 'snarePrimary' &&
        clip.synthId !== 'snareSecondary' &&
        clip.synthId !== 'clapPrimary' &&
        clip.synthId !== 'clapSecondary',
    ),
  ];
};

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

const drumClipsToKickOffbeatPattern = (
  clips: readonly DrumClip[],
  primarySynthId: OffbeatPrimarySynthId,
  secondarySynthId: OffbeatSecondarySynthId,
): string => {
  const barCount = Math.max(
    1,
    ...clips
      .filter(
        (clip) =>
          clip.synthId === 'kickPrimary' ||
          clip.synthId === primarySynthId ||
          clip.synthId === secondarySynthId,
      )
      .map((clip) => clip.startBar + Math.ceil(clip.pattern.length / StepsPerBar)),
  );

  return Array.from({ length: barCount * StepsPerBar }, (_, step) => {
    const hasKick = getDrumClipIntensityAtStep(clips, 'kickPrimary', step) > 0;
    const hasPrimaryOffbeat = getDrumClipIntensityAtStep(clips, primarySynthId, step) > 0;
    const hasSecondaryOffbeat = getDrumClipIntensityAtStep(clips, secondarySynthId, step) > 0;

    if (hasKick && hasPrimaryOffbeat) {
      return 'x';
    }

    if (hasPrimaryOffbeat) {
      return 'O';
    }

    if (hasSecondaryOffbeat) {
      return 'o';
    }

    if (hasKick) {
      return 'k';
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

const getFilteredKickOffbeatPatterns = (filters: KickOffbeatPatternFilters) => {
  return [...KickOffbeatPatternWeights.values()]
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

const getFilteredHatsPatterns = (filters: KickOffbeatPatternFilters) => {
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
  const kickOffbeatPatternFilters = useStore((state) => state.drumPatternFilters);
  const hatsPatternFilters = useStore((state) => state.hatsPatternFilters);
  const [selectedBarIndex, setSelectedBarIndex] = createSignal(0);
  const [selectedBarPatternIndex, setSelectedBarPatternIndex] = createSignal(0);
  const [selectedHatsBarIndex, setSelectedHatsBarIndex] = createSignal(0);
  const [selectedHatsBarPatternIndex, setSelectedHatsBarPatternIndex] = createSignal(0);
  const [offbeatPrimarySynthId, setOffbeatPrimarySynthId] =
    createSignal<OffbeatPrimarySynthId>('snarePrimary');
  const [offbeatSecondarySynthId, setOffbeatSecondarySynthId] =
    createSignal<OffbeatSecondarySynthId>('snareSecondary');
  const kickOffbeatPattern = createMemo(() =>
    drumClipsToKickOffbeatPattern(drumClips(), offbeatPrimarySynthId(), offbeatSecondarySynthId()),
  );
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
  const kickOffbeatBarPatterns = createMemo(() => kickOffbeatPattern().match(/.{1,16}/g) ?? []);
  const hatsBarPatterns = createMemo(() => hatsPattern().match(/.{1,16}/g) ?? []);
  const selectedBarPattern = createMemo(() => kickOffbeatBarPatterns()[selectedBarIndex()] ?? '');
  const selectedHatsBarPattern = createMemo(() => hatsBarPatterns()[selectedHatsBarIndex()] ?? '');
  const selectedBarRelativePatterns = createMemo(() => {
    if (!selectedBarPattern()) {
      return [];
    }

    const relativePatterns = RelativeKickOffbeatPatterns[selectedBarPattern()];

    if (!relativePatterns) {
      return [selectedBarPattern()];
    }

    return relativePatterns;
  });
  const selectedHatsBarRelativePatterns = createMemo(() =>
    selectedHatsBarPattern()
      ? (RelativeHatsPatterns[selectedHatsBarPattern()] ?? [selectedHatsBarPattern()])
      : [],
  );
  const filteredKickOffbeatPatterns = createMemo(() =>
    getFilteredKickOffbeatPatterns(kickOffbeatPatternFilters()),
  );
  const filteredHatsPatterns = createMemo(() => getFilteredHatsPatterns(hatsPatternFilters()));
  const currentKickOffbeatWeight = createMemo(() =>
    KickOffbeatPatternWeights.get(selectedBarPattern()),
  );
  const currentKickOffbeatSyncopationScore = createMemo(() => currentKickOffbeatWeight()?.syncopationScore);
  const currentHatsWeight = createMemo(() => HatsPatternWeights.get(selectedHatsBarPattern()));
  const relativeKickOffbeatPatternCount = createMemo(() => selectedBarRelativePatterns().length);
  const relativeHatsPatternCount = createMemo(() => selectedHatsBarRelativePatterns().length);

  const setKickOffbeatPattern = (
    pattern: string,
    primarySynthId = offbeatPrimarySynthId(),
    secondarySynthId = offbeatSecondarySynthId(),
  ): void => {
    setDrumClips(
      kickOffbeatPatternToConfiguredDrumClips(
        pattern,
        getState().sequencer.drumClips,
        primarySynthId,
        secondarySynthId,
      ),
    );
  };

  const randomizeOffbeatSynthConfig = (): [
    OffbeatPrimarySynthId,
    OffbeatSecondarySynthId,
  ] => {
    const nextOffbeatPrimarySynthId = takeRandomItems(['snarePrimary', 'clapPrimary'] as const, 1)[0];
    const nextOffbeatSecondarySynthId = takeRandomItems(['snareSecondary', 'clapSecondary'] as const, 1)[0];

    setOffbeatPrimarySynthId(nextOffbeatPrimarySynthId);
    setOffbeatSecondarySynthId(nextOffbeatSecondarySynthId);

    return [nextOffbeatPrimarySynthId, nextOffbeatSecondarySynthId];
  };

  const randomizeAndApplyOffbeatSynthConfig = (): void => {
    const pattern = kickOffbeatPattern();

    if (!pattern) {
      return;
    }

    const [nextOffbeatPrimarySynthId, nextOffbeatSecondarySynthId] = randomizeOffbeatSynthConfig();

    setKickOffbeatPattern(pattern, nextOffbeatPrimarySynthId, nextOffbeatSecondarySynthId);
  };

  const setKickOffbeatPatternFromList = (
    patterns: ReturnType<typeof filteredKickOffbeatPatterns>,
    index: number,
    primarySynthId = offbeatPrimarySynthId(),
    secondarySynthId = offbeatSecondarySynthId(),
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
    setKickOffbeatPattern(
      arrangeRelativeKickOffbeatPatterns(nextPattern).join(''),
      primarySynthId,
      secondarySynthId,
    );
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
    setDrumClips(
      hatsPatternToDrumClips(
        arrangeRelativeHatsPatterns(nextPattern).join(''),
        getState().sequencer.drumClips,
      ),
    );
  };

  const setBodyKickOffbeatPattern = (index: number): void => {
    setKickOffbeatPatternFromList(filteredKickOffbeatPatterns(), index);
  };

  const randomizeBodyKickOffbeatPattern = (): void => {
    const patterns = filteredKickOffbeatPatterns();

    if (patterns.length === 0) {
      return;
    }

    const [nextOffbeatPrimarySynthId, nextOffbeatSecondarySynthId] = randomizeOffbeatSynthConfig();

    setKickOffbeatPatternFromList(
      patterns,
      Math.floor(Math.random() * patterns.length),
      nextOffbeatPrimarySynthId,
      nextOffbeatSecondarySynthId,
    );
  };

  const randomizeKickOffbeatRelativePatterns = (): void => {
    const pattern = kickOffbeatBarPatterns()[0];

    if (!pattern) {
      return;
    }

    setKickOffbeatPattern(arrangeRelativeKickOffbeatPatterns(pattern).join(''));
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

  const randomizeHatsRelativePatterns = (): void => {
    const pattern = hatsBarPatterns()[0];

    if (!pattern) {
      return;
    }

    setDrumClips(
      hatsPatternToDrumClips(
        arrangeRelativeHatsPatterns(pattern).join(''),
        getState().sequencer.drumClips,
      ),
    );
  };

  const updateKickOffbeatPatternFilter = (
    key: keyof KickOffbeatPatternFilters,
    value: number,
  ): void => {
    const nextFilters = { ...kickOffbeatPatternFilters(), [key]: value };

    setDrumPatternFilters(nextFilters);
    setKickOffbeatPatternFromList(getFilteredKickOffbeatPatterns(nextFilters), 0);
  };

  const updateHatsPatternFilter = (key: keyof KickOffbeatPatternFilters, value: number): void => {
    const nextFilters = { ...hatsPatternFilters(), [key]: value };

    setHatsPatternFilters(nextFilters);
    setHatsPatternFromList(getFilteredHatsPatterns(nextFilters), 0);
  };

  const toggleDrumStep = (synthId: DrumClip['synthId'], step: number): void => {
    const channel = drumClips().find((drumChannel) => {
      const startStep = drumChannel.startBar * StepsPerBar;

      return (
        drumChannel.synthId === synthId &&
        step >= startStep &&
        step < startStep + drumChannel.pattern.length
      );
    });

    if (!channel) {
      return;
    }

    setDrumPatternStep(
      channel.id,
      step - channel.startBar * StepsPerBar,
      getDrumClipIntensityAtStep([channel], channel.synthId, step) > 0 ? 0 : 1,
    );
  };

  const resetDrumPattern = (synthId: DrumClip['synthId']): void => {
    drumClips().forEach((channel) => {
      if (channel.synthId !== synthId) {
        return;
      }

      channel.pattern.forEach((intensity, step) => {
        if (intensity > 0) {
          setDrumPatternStep(channel.id, step, 0);
        }
      });
    });
  };

  onMount(() => {
    setBodyKickOffbeatPattern(0);
    setBodyHatsPattern(0);
  });

  return (
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      <section
        style={{ display: 'flex', gap: '0.75rem', 'align-items': 'end', 'flex-wrap': 'wrap' }}
      >
        <button type="button" onClick={randomizeAndApplyOffbeatSynthConfig}>
          Random clap/snare
        </button>
        <label style={{ display: 'grid', gap: '0.2rem', 'font-size': '0.78rem' }}>
          <span>primary offbeat</span>
          <select
            value={offbeatPrimarySynthId()}
            onInput={(event) => {
              const nextSynthId = event.currentTarget.value as OffbeatPrimarySynthId;
              const pattern = kickOffbeatPattern();

              setOffbeatPrimarySynthId(nextSynthId);
              setKickOffbeatPattern(pattern, nextSynthId, offbeatSecondarySynthId());
            }}
          >
            <option value="snarePrimary">snarePrimary</option>
            <option value="clapPrimary">clapPrimary</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: '0.2rem', 'font-size': '0.78rem' }}>
          <span>secondary offbeat</span>
          <select
            value={offbeatSecondarySynthId()}
            onInput={(event) => {
              const nextSynthId = event.currentTarget.value as OffbeatSecondarySynthId;
              const pattern = kickOffbeatPattern();

              setOffbeatSecondarySynthId(nextSynthId);
              setKickOffbeatPattern(pattern, offbeatPrimarySynthId(), nextSynthId);
            }}
          >
            <option value="snareSecondary">snareSecondary</option>
            <option value="clapSecondary">clapSecondary</option>
          </select>
        </label>
      </section>
      <KickOffbeatPatternNavigator
        barIndex={selectedBarIndex()}
        barPatternCount={filteredKickOffbeatPatterns().length}
        barPatternIndex={selectedBarPatternIndex()}
        filters={kickOffbeatPatternFilters()}
        relativePatternCount={relativeKickOffbeatPatternCount()}
        syncopationScore={currentKickOffbeatSyncopationScore()}
        weight={currentKickOffbeatWeight()}
        onBarPatternIndexInput={setBodyKickOffbeatPattern}
        onFilterInput={updateKickOffbeatPatternFilter}
        onRandomPatternInput={randomizeBodyKickOffbeatPattern}
        onRandomRelativePatternsInput={randomizeKickOffbeatRelativePatterns}
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
        onRandomRelativePatternsInput={randomizeHatsRelativePatterns}
      />
      <section
        style={{
          display: 'grid',
          gap: '3px 0',
          background: '#fff',
          'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          'font-size': '0.72rem',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            'grid-template-columns': '1.5rem repeat(64, minmax(0.45rem, 1fr)) 3.6rem',
            gap: 0,
            'align-items': 'center',
            'min-width': '34rem',
            color: '#737373',
            'font-size': '0.58rem',
          }}
        >
          <span />
          <For each={Array.from({ length: EditorStepCount }, (_, index) => index)}>
            {(step) => (
              <span
                style={{
                  'text-align': 'center',
                  background: isStrongStep(step) ? '#e5e7eb' : 'transparent',
                  'margin-right': isBarEndStep(step) ? '3px' : 0,
                }}
              >
                {(step % StepsPerBar) + 1}
              </span>
            )}
          </For>
          <span />
        </div>
        <For each={DrumRows}>
          {(row) => {
            const rowPattern = (): string => {
              if (row.synthId === 'kickPrimary') {
                return fillEditorPattern(kickPrimaryPattern());
              }

              if (row.synthId === 'kickSecondary') {
                return fillEditorPattern(kickSecondaryPattern());
              }

              if (row.synthId === 'snarePrimary') {
                return fillEditorPattern(snarePrimaryPattern());
              }

              if (row.synthId === 'snareSecondary') {
                return fillEditorPattern(snareSecondaryPattern());
              }

              if (row.synthId === 'clapPrimary') {
                return fillEditorPattern(clapPrimaryPattern());
              }

              if (row.synthId === 'clapSecondary') {
                return fillEditorPattern(clapSecondaryPattern());
              }

              if (row.synthId === 'closedHat') {
                return fillEditorPattern(closedHatPattern());
              }

              if (row.synthId === 'openHat') {
                return fillEditorPattern(openHatPattern());
              }

              if (row.synthId === 'ride') {
                return fillEditorPattern(ridePattern());
              }

              return fillEditorPattern(crashPattern());
            };

            return (
              <div
                style={{
                  display: 'grid',
                  'grid-template-columns': '1.5rem repeat(64, minmax(0.45rem, 1fr)) 3.6rem',
                  gap: 0,
                  'align-items': 'center',
                  'min-width': '34rem',
                }}
              >
                <span style={{ 'font-size': '10px', 'text-align': 'center' }}>{row.label}</span>
                <For each={[...rowPattern()]}>
                  {(stepVoice, step) => {
                    const isActiveStep = (): boolean =>
                      transport().isPlaying &&
                      (transport().bar % EditorBarCount) * StepsPerBar + transport().step === step();
                    const intensity = (): number => (stepVoice === row.patternStep ? 1 : 0);

                    return (
                      <button
                        type="button"
                        aria-label={`${row.label} step ${step() + 1}`}
                        onClick={() => toggleDrumStep(row.synthId, step())}
                        style={{
                          height: '100%',
                          padding: 0,
                          border: 'none',
                          'border-radius': 0,
                          background: getStepBackground(intensity(), isActiveStep(), isStrongStep(step())),
                          'margin-right': isBarEndStep(step()) ? '3px' : 0,
                          color: intensity() > 0 ? '#fff' : '#737373',
                          cursor: 'pointer',
                        }}
                      />
                    );
                  }}
                </For>
                <button
                  type="button"
                  onClick={() => resetDrumPattern(row.synthId)}
                  style={{
                    height: '1.4rem',
                    padding: 0,
                    border: 'none',
                    'border-radius': 0,
                    background: '#fff',
                    color: '#525252',
                    cursor: 'pointer',
                    'font-size': '0.6rem',
                  }}
                >
                  reset
                </button>
              </div>
            );
          }}
        </For>
      </section>
    </section>
  );
};
