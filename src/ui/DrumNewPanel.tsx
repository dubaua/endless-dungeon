import { createSignal, For, onMount, type Component } from 'solid-js';

import type { DrumSynthId } from '../audio/synths/types';
import type { DramFamily, DrumPattern, HatFamily, HatPattern } from '../generators/patterns/drums/drum-layer-pattern.type';
import { HatFamilies } from '../generators/patterns/drums/hat-patterns.const';
import { KickPrimaryFamilies } from '../generators/patterns/drums/kick-primary-patterns.const';
import { KickSecondaryFamilies } from '../generators/patterns/drums/kick-secondary-patterns.const';
import { OffbeatPrimaryFamilies } from '../generators/patterns/drums/offbeat-primary-patterns.const';
import { OffbeatSecondaryFamilies } from '../generators/patterns/drums/offbeat-secondary-patterns.const';
import type { DrumClip } from '../sequencer/types';
import { getState, setDrumClips, setDrumPatternStep, useStore } from '../state/store';
import { takeRandom } from '../utils/take-random';
import { takeRandomItems } from '../utils/take-random-items';

const StepsPerBar = 16;
const EditorBarCount = 4;
const EditorStepCount = StepsPerBar * EditorBarCount;
const PatternPickCount = 3;

type OffbeatPrimarySynthId = 'snarePrimary' | 'clapPrimary';
type OffbeatSecondarySynthId = 'snareSecondary' | 'clapSecondary';

interface PatternBlockProps {
  title: string;
  family: DramFamily;
  patterns: readonly DrumPattern[];
  onRandomFamilyInput: () => void;
  onRandomPatternInput: () => void;
  onPreviousInput: () => void;
  onNextInput: () => void;
}

interface HatPatternBlockProps {
  title: string;
  family: HatFamily;
  patterns: readonly HatPattern[];
  onRandomFamilyInput: () => void;
  onRandomPatternInput: () => void;
  onPreviousInput: () => void;
  onNextInput: () => void;
}

interface PatternAssignment {
  pattern: readonly number[];
  synthId: DrumSynthId;
}

const DrumRows: readonly { label: string; synthId: DrumSynthId }[] = [
  { label: 'KP', synthId: 'kickPrimary' },
  { label: 'KS', synthId: 'kickSecondary' },
  { label: 'SP', synthId: 'snarePrimary' },
  { label: 'SS', synthId: 'snareSecondary' },
  { label: 'CP', synthId: 'clapPrimary' },
  { label: 'CS', synthId: 'clapSecondary' },
  { label: 'HH', synthId: 'closedHat' },
  { label: 'OH', synthId: 'openHat' },
  { label: 'RD', synthId: 'ride' },
  { label: 'CR', synthId: 'crash' },
];

const EmptyPattern = Array.from({ length: EditorStepCount }, () => 0);

const isStrongStep = (step: number): boolean => step % 4 === 0;
const isBarEndStep = (step: number): boolean => step % StepsPerBar === StepsPerBar - 1;

const getStepBackground = (
  intensity: number,
  isCurrentStep: boolean,
  isStrong: boolean,
): string => {
  if (isCurrentStep) {
    return intensity > 0 ? '#ef4444' : '#fee2e2';
  }

  if (isStrong && intensity <= 0) {
    return '#e5e7eb';
  }

  return intensity > 0 ? '#111827' : '#f5f5f5';
};

const expandPatternToEditorLength = (pattern: readonly number[]): number[] => {
  if (pattern.length === 0) {
    return EmptyPattern;
  }

  return Array.from(
    { length: EditorStepCount },
    (_, index) => pattern[index % pattern.length] ?? 0,
  );
};

const getClipPattern = (clips: readonly DrumClip[], synthId: DrumSynthId): readonly number[] => {
  const pattern = clips.find((clip) => clip.synthId === synthId && clip.startBar === 0)?.pattern;

  if (!pattern) {
    return EmptyPattern;
  }

  return expandPatternToEditorLength(pattern);
};

const getFamilyPatterns = (family: DramFamily): DrumPattern[] => {
  return family.weightedPatterns.map((option) => option.value);
};

const getHatFamilyPatterns = (family: HatFamily): HatPattern[] => {
  return family.weightedPatterns.map((option) => option.value);
};

const arrangeBarPatterns = <T,>(patterns: readonly T[]): T[] => {
  const pickedPatterns = takeRandomItems(patterns, PatternPickCount);

  return [pickedPatterns[0], pickedPatterns[1], pickedPatterns[0], pickedPatterns[2]];
};

const pickFamilyBarPatterns = (family: DramFamily): DrumPattern[] => {
  return arrangeBarPatterns(getFamilyPatterns(family));
};

const pickHatFamilyBarPatterns = (family: HatFamily): HatPattern[] => {
  return arrangeBarPatterns(getHatFamilyPatterns(family));
};

const flattenDrumPatterns = (patterns: readonly DrumPattern[]): number[] => {
  return patterns.flatMap((pattern) => pattern.pattern);
};

const flattenClosedHatPatterns = (patterns: readonly HatPattern[]): number[] => {
  return patterns.flatMap((pattern) => pattern.closeHatPattern);
};

const flattenOpenHatPatterns = (patterns: readonly HatPattern[]): number[] => {
  return patterns.flatMap((pattern) => pattern.openHatPattern);
};

const getPatternByStep = (
  family: DramFamily,
  pattern: DrumPattern,
  step: number,
): DrumPattern => {
  const patterns = getFamilyPatterns(family);
  const index = patterns.findIndex((candidate) => candidate.name === pattern.name);
  const currentIndex = index >= 0 ? index : 0;
  const nextIndex = (currentIndex + step + patterns.length) % patterns.length;

  return patterns[nextIndex];
};

const getHatPatternByStep = (
  family: HatFamily,
  pattern: HatPattern,
  step: number,
): HatPattern => {
  const patterns = getHatFamilyPatterns(family);
  const index = patterns.findIndex((candidate) => candidate.name === pattern.name);
  const currentIndex = index >= 0 ? index : 0;
  const nextIndex = (currentIndex + step + patterns.length) % patterns.length;

  return patterns[nextIndex];
};

const setAssignedPatterns = (
  assignments: readonly PatternAssignment[],
  clearSynthIds: readonly DrumSynthId[] = [],
): void => {
  const assignmentMap = new Map(
    assignments.map((assignment) => [assignment.synthId, assignment.pattern]),
  );
  const clearSynthIdSet = new Set(clearSynthIds);

  setDrumClips(
    getState().sequencer.drumClips.map((clip) => {
      if (clip.startBar !== 0) {
        return clip;
      }

      const pattern = assignmentMap.get(clip.synthId);

      if (pattern) {
        return {
          ...clip,
          pattern: expandPatternToEditorLength(pattern),
        };
      }

      if (clearSynthIdSet.has(clip.synthId)) {
        return {
          ...clip,
          pattern: EmptyPattern,
        };
      }

      return clip;
    }),
  );
};

const PatternBlock: Component<PatternBlockProps> = (props) => (
  <section
    style={{
      display: 'grid',
      gap: '0.35rem',
      padding: '0.5rem',
      border: '1px solid #d4d4d4',
      'border-radius': '0.25rem',
      background: '#fff',
    }}
  >
    <header style={{ display: 'flex', gap: '0.5rem', 'align-items': 'center' }}>
      <h3 style={{ margin: 0, 'font-size': '0.95rem' }}>{props.title}</h3>
      <button type="button" onClick={props.onRandomFamilyInput}>
        Random Family
      </button>
      <button type="button" onClick={props.onRandomPatternInput}>
        Random Pattern
      </button>
      <button type="button" onClick={props.onPreviousInput}>
        Prev
      </button>
      <button type="button" onClick={props.onNextInput}>
        Next
      </button>
    </header>
    <div
      style={{
        'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        'font-size': '0.78rem',
      }}
    >
      {props.family.name} / {props.patterns.map((pattern) => pattern.name).join(' | ')}
    </div>
    <div style={{ color: '#666', 'font-size': '0.75rem' }}>{props.family.genres.join(', ')}</div>
  </section>
);

const HatPatternBlock: Component<HatPatternBlockProps> = (props) => (
  <section
    style={{
      display: 'grid',
      gap: '0.35rem',
      padding: '0.5rem',
      border: '1px solid #d4d4d4',
      'border-radius': '0.25rem',
      background: '#fff',
    }}
  >
    <header style={{ display: 'flex', gap: '0.5rem', 'align-items': 'center' }}>
      <h3 style={{ margin: 0, 'font-size': '0.95rem' }}>{props.title}</h3>
      <button type="button" onClick={props.onRandomFamilyInput}>
        Random Family
      </button>
      <button type="button" onClick={props.onRandomPatternInput}>
        Random Pattern
      </button>
      <button type="button" onClick={props.onPreviousInput}>
        Prev
      </button>
      <button type="button" onClick={props.onNextInput}>
        Next
      </button>
    </header>
    <div
      style={{
        'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        'font-size': '0.78rem',
      }}
    >
      {props.family.name} / {props.patterns.map((pattern) => pattern.name).join(' | ')}
    </div>
    <div style={{ color: '#666', 'font-size': '0.75rem' }}>{props.family.genres.join(', ')}</div>
  </section>
);

export const DrumNewPanel: Component = () => {
  const drumClips = useStore((state) => state.sequencer.drumClips);
  const transport = useStore((state) => state.transport);
  const initialKickPrimaryFamily = takeRandom(KickPrimaryFamilies);
  const initialKickSecondaryFamily = takeRandom(KickSecondaryFamilies);
  const initialOffbeatPrimaryFamily = takeRandom(OffbeatPrimaryFamilies);
  const initialOffbeatSecondaryFamily = takeRandom(OffbeatSecondaryFamilies);
  const initialHatFamily = takeRandom(HatFamilies);
  const [kickPrimaryFamily, setKickPrimaryFamily] = createSignal(initialKickPrimaryFamily);
  const [kickSecondaryFamily, setKickSecondaryFamily] = createSignal(initialKickSecondaryFamily);
  const [offbeatPrimaryFamily, setOffbeatPrimaryFamily] = createSignal(initialOffbeatPrimaryFamily);
  const [offbeatSecondaryFamily, setOffbeatSecondaryFamily] = createSignal(initialOffbeatSecondaryFamily);
  const [hatFamily, setHatFamily] = createSignal(initialHatFamily);
  const [kickPrimaryPatterns, setKickPrimaryPatterns] = createSignal(
    pickFamilyBarPatterns(initialKickPrimaryFamily),
  );
  const [kickSecondaryPatterns, setKickSecondaryPatterns] = createSignal(
    pickFamilyBarPatterns(initialKickSecondaryFamily),
  );
  const [offbeatPrimaryPatterns, setOffbeatPrimaryPatterns] = createSignal(
    pickFamilyBarPatterns(initialOffbeatPrimaryFamily),
  );
  const [offbeatSecondaryPatterns, setOffbeatSecondaryPatterns] = createSignal(
    pickFamilyBarPatterns(initialOffbeatSecondaryFamily),
  );
  const [hatPatterns, setHatPatterns] = createSignal(pickHatFamilyBarPatterns(initialHatFamily));
  const [offbeatPrimarySynthId, setOffbeatPrimarySynthId] =
    createSignal<OffbeatPrimarySynthId>('snarePrimary');
  const [offbeatSecondarySynthId, setOffbeatSecondarySynthId] =
    createSignal<OffbeatSecondarySynthId>('snareSecondary');

  const applyKickPrimaryPatterns = (patterns: readonly DrumPattern[]): void => {
    setKickPrimaryPatterns([...patterns]);
    setAssignedPatterns([{ synthId: 'kickPrimary', pattern: flattenDrumPatterns(patterns) }]);
  };

  const applyKickPrimaryFamily = (family: DramFamily): void => {
    const patterns = pickFamilyBarPatterns(family);

    setKickPrimaryFamily(family);
    applyKickPrimaryPatterns(patterns);
  };

  const applyKickSecondaryPatterns = (patterns: readonly DrumPattern[]): void => {
    setKickSecondaryPatterns([...patterns]);
    setAssignedPatterns([{ synthId: 'kickSecondary', pattern: flattenDrumPatterns(patterns) }]);
  };

  const applyKickSecondaryFamily = (family: DramFamily): void => {
    const patterns = pickFamilyBarPatterns(family);

    setKickSecondaryFamily(family);
    applyKickSecondaryPatterns(patterns);
  };

  const applyOffbeatPrimaryPatterns = (
    patterns: readonly DrumPattern[],
    synthId = offbeatPrimarySynthId(),
  ): void => {
    setOffbeatPrimaryPatterns([...patterns]);
    setAssignedPatterns(
      [{ synthId, pattern: flattenDrumPatterns(patterns) }],
      ['snarePrimary', 'clapPrimary'].filter(
        (clearSynthId) => clearSynthId !== synthId,
      ) as DrumSynthId[],
    );
  };

  const applyOffbeatPrimaryFamily = (family: DramFamily): void => {
    const patterns = pickFamilyBarPatterns(family);

    setOffbeatPrimaryFamily(family);
    applyOffbeatPrimaryPatterns(patterns);
  };

  const applyOffbeatSecondaryPatterns = (
    patterns: readonly DrumPattern[],
    synthId = offbeatSecondarySynthId(),
  ): void => {
    setOffbeatSecondaryPatterns([...patterns]);
    setAssignedPatterns(
      [{ synthId, pattern: flattenDrumPatterns(patterns) }],
      ['snareSecondary', 'clapSecondary'].filter(
        (clearSynthId) => clearSynthId !== synthId,
      ) as DrumSynthId[],
    );
  };

  const applyOffbeatSecondaryFamily = (family: DramFamily): void => {
    const patterns = pickFamilyBarPatterns(family);

    setOffbeatSecondaryFamily(family);
    applyOffbeatSecondaryPatterns(patterns);
  };

  const applyHatPatterns = (patterns: readonly HatPattern[]): void => {
    setHatPatterns([...patterns]);
    setAssignedPatterns([
      { synthId: 'closedHat', pattern: flattenClosedHatPatterns(patterns) },
      { synthId: 'openHat', pattern: flattenOpenHatPatterns(patterns) },
    ]);
  };

  const applyHatFamily = (family: HatFamily): void => {
    const patterns = pickHatFamilyBarPatterns(family);

    setHatFamily(family);
    applyHatPatterns(patterns);
  };

  const stepKickPrimaryPattern = (step: number): void => {
    applyKickPrimaryPatterns(
      kickPrimaryPatterns().map((pattern) => getPatternByStep(kickPrimaryFamily(), pattern, step)),
    );
  };

  const stepKickSecondaryPattern = (step: number): void => {
    applyKickSecondaryPatterns(
      kickSecondaryPatterns().map((pattern) => getPatternByStep(kickSecondaryFamily(), pattern, step)),
    );
  };

  const stepOffbeatPrimaryPattern = (step: number): void => {
    applyOffbeatPrimaryPatterns(
      offbeatPrimaryPatterns().map((pattern) => getPatternByStep(offbeatPrimaryFamily(), pattern, step)),
    );
  };

  const stepOffbeatSecondaryPattern = (step: number): void => {
    applyOffbeatSecondaryPatterns(
      offbeatSecondaryPatterns().map((pattern) => getPatternByStep(offbeatSecondaryFamily(), pattern, step)),
    );
  };

  const stepHatPattern = (step: number): void => {
    applyHatPatterns(
      hatPatterns().map((pattern) => getHatPatternByStep(hatFamily(), pattern, step)),
    );
  };

  const randomizeAll = (): void => {
    const nextKickPrimaryFamily = takeRandom(KickPrimaryFamilies);
    const nextKickSecondaryFamily = takeRandom(KickSecondaryFamilies);
    const nextOffbeatPrimaryFamily = takeRandom(OffbeatPrimaryFamilies);
    const nextOffbeatSecondaryFamily = takeRandom(OffbeatSecondaryFamilies);
    const nextHatFamily = takeRandom(HatFamilies);
    const nextKickPrimaryPatterns = pickFamilyBarPatterns(nextKickPrimaryFamily);
    const nextKickSecondaryPatterns = pickFamilyBarPatterns(nextKickSecondaryFamily);
    const nextOffbeatPrimaryPatterns = pickFamilyBarPatterns(nextOffbeatPrimaryFamily);
    const nextOffbeatSecondaryPatterns = pickFamilyBarPatterns(nextOffbeatSecondaryFamily);
    const nextHatPatterns = pickHatFamilyBarPatterns(nextHatFamily);
    const nextOffbeatPrimarySynthId = takeRandom(['snarePrimary', 'clapPrimary'] as const);
    const nextOffbeatSecondarySynthId = takeRandom(['snareSecondary', 'clapSecondary'] as const);

    setKickPrimaryFamily(nextKickPrimaryFamily);
    setKickSecondaryFamily(nextKickSecondaryFamily);
    setOffbeatPrimaryFamily(nextOffbeatPrimaryFamily);
    setOffbeatSecondaryFamily(nextOffbeatSecondaryFamily);
    setHatFamily(nextHatFamily);
    setKickPrimaryPatterns(nextKickPrimaryPatterns);
    setKickSecondaryPatterns(nextKickSecondaryPatterns);
    setOffbeatPrimaryPatterns(nextOffbeatPrimaryPatterns);
    setOffbeatSecondaryPatterns(nextOffbeatSecondaryPatterns);
    setHatPatterns(nextHatPatterns);
    setOffbeatPrimarySynthId(nextOffbeatPrimarySynthId);
    setOffbeatSecondarySynthId(nextOffbeatSecondarySynthId);
    setAssignedPatterns(
      [
        { synthId: 'kickPrimary', pattern: flattenDrumPatterns(nextKickPrimaryPatterns) },
        { synthId: 'kickSecondary', pattern: flattenDrumPatterns(nextKickSecondaryPatterns) },
        { synthId: nextOffbeatPrimarySynthId, pattern: flattenDrumPatterns(nextOffbeatPrimaryPatterns) },
        { synthId: nextOffbeatSecondarySynthId, pattern: flattenDrumPatterns(nextOffbeatSecondaryPatterns) },
        { synthId: 'closedHat', pattern: flattenClosedHatPatterns(nextHatPatterns) },
        { synthId: 'openHat', pattern: flattenOpenHatPatterns(nextHatPatterns) },
      ],
      [
        nextOffbeatPrimarySynthId === 'snarePrimary' ? 'clapPrimary' : 'snarePrimary',
        nextOffbeatSecondarySynthId === 'snareSecondary' ? 'clapSecondary' : 'snareSecondary',
      ],
    );
  };

  const toggleStep = (synthId: DrumSynthId, step: number): void => {
    const clip = drumClips().find(
      (drumClip) => drumClip.synthId === synthId && drumClip.startBar === 0,
    );

    if (!clip) {
      return;
    }

    setDrumPatternStep(clip.id, step, (clip.pattern[step] ?? 0) > 0 ? 0 : 1);
  };

  const resetPattern = (synthId: DrumSynthId): void => {
    const clip = drumClips().find(
      (drumClip) => drumClip.synthId === synthId && drumClip.startBar === 0,
    );

    if (!clip) {
      return;
    }

    setAssignedPatterns([{ synthId, pattern: EmptyPattern }]);
  };

  onMount(() => {
    setAssignedPatterns(
      [
        ...DrumRows.map((row) => ({ synthId: row.synthId, pattern: EmptyPattern })),
        { synthId: 'kickPrimary', pattern: flattenDrumPatterns(kickPrimaryPatterns()) },
        { synthId: 'kickSecondary', pattern: flattenDrumPatterns(kickSecondaryPatterns()) },
        { synthId: offbeatPrimarySynthId(), pattern: flattenDrumPatterns(offbeatPrimaryPatterns()) },
        { synthId: offbeatSecondarySynthId(), pattern: flattenDrumPatterns(offbeatSecondaryPatterns()) },
        { synthId: 'closedHat', pattern: flattenClosedHatPatterns(hatPatterns()) },
        { synthId: 'openHat', pattern: flattenOpenHatPatterns(hatPatterns()) },
      ],
      ['clapPrimary', 'clapSecondary'],
    );
  });

  return (
    <section style={{ display: 'grid', gap: '0.75rem' }}>
      <section
        style={{ display: 'flex', gap: '0.75rem', 'align-items': 'end', 'flex-wrap': 'wrap' }}
      >
        <button type="button" onClick={randomizeAll}>
          Random All
        </button>
        <label style={{ display: 'grid', gap: '0.2rem', 'font-size': '0.78rem' }}>
          <span>primary offbeat</span>
          <select
            value={offbeatPrimarySynthId()}
            onInput={(event) => {
              const nextSynthId = event.currentTarget.value as OffbeatPrimarySynthId;

              setOffbeatPrimarySynthId(nextSynthId);
              applyOffbeatPrimaryPatterns(offbeatPrimaryPatterns(), nextSynthId);
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

              setOffbeatSecondarySynthId(nextSynthId);
              applyOffbeatSecondaryPatterns(offbeatSecondaryPatterns(), nextSynthId);
            }}
          >
            <option value="snareSecondary">snareSecondary</option>
            <option value="clapSecondary">clapSecondary</option>
          </select>
        </label>
      </section>
      <section
        style={{
          display: 'grid',
          'grid-template-columns': 'repeat(auto-fit, minmax(13rem, 1fr))',
          gap: '0.5rem',
        }}
      >
        <PatternBlock
          title="Kick Primary"
          family={kickPrimaryFamily()}
          patterns={kickPrimaryPatterns()}
          onRandomFamilyInput={() => applyKickPrimaryFamily(takeRandom(KickPrimaryFamilies))}
          onRandomPatternInput={() => applyKickPrimaryPatterns(pickFamilyBarPatterns(kickPrimaryFamily()))}
          onPreviousInput={() => stepKickPrimaryPattern(-1)}
          onNextInput={() => stepKickPrimaryPattern(1)}
        />
        <PatternBlock
          title="Kick Secondary"
          family={kickSecondaryFamily()}
          patterns={kickSecondaryPatterns()}
          onRandomFamilyInput={() => applyKickSecondaryFamily(takeRandom(KickSecondaryFamilies))}
          onRandomPatternInput={() => applyKickSecondaryPatterns(pickFamilyBarPatterns(kickSecondaryFamily()))}
          onPreviousInput={() => stepKickSecondaryPattern(-1)}
          onNextInput={() => stepKickSecondaryPattern(1)}
        />
        <PatternBlock
          title="Offbeat Primary"
          family={offbeatPrimaryFamily()}
          patterns={offbeatPrimaryPatterns()}
          onRandomFamilyInput={() => applyOffbeatPrimaryFamily(takeRandom(OffbeatPrimaryFamilies))}
          onRandomPatternInput={() => applyOffbeatPrimaryPatterns(pickFamilyBarPatterns(offbeatPrimaryFamily()))}
          onPreviousInput={() => stepOffbeatPrimaryPattern(-1)}
          onNextInput={() => stepOffbeatPrimaryPattern(1)}
        />
        <PatternBlock
          title="Offbeat Secondary"
          family={offbeatSecondaryFamily()}
          patterns={offbeatSecondaryPatterns()}
          onRandomFamilyInput={() => applyOffbeatSecondaryFamily(takeRandom(OffbeatSecondaryFamilies))}
          onRandomPatternInput={() => applyOffbeatSecondaryPatterns(pickFamilyBarPatterns(offbeatSecondaryFamily()))}
          onPreviousInput={() => stepOffbeatSecondaryPattern(-1)}
          onNextInput={() => stepOffbeatSecondaryPattern(1)}
        />
        <HatPatternBlock
          title="Hats"
          family={hatFamily()}
          patterns={hatPatterns()}
          onRandomFamilyInput={() => applyHatFamily(takeRandom(HatFamilies))}
          onRandomPatternInput={() => applyHatPatterns(pickHatFamilyBarPatterns(hatFamily()))}
          onPreviousInput={() => stepHatPattern(-1)}
          onNextInput={() => stepHatPattern(1)}
        />
      </section>
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
          {(row) => (
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
              <For each={[...getClipPattern(drumClips(), row.synthId)]}>
                {(intensity, step) => {
                  const isActiveStep = (): boolean =>
                    transport().isPlaying &&
                    (transport().bar % EditorBarCount) * StepsPerBar + transport().step === step();

                  return (
                    <button
                      type="button"
                      aria-label={`${row.label} step ${step() + 1}`}
                      onClick={() => toggleStep(row.synthId, step())}
                      style={{
                        height: '100%',
                        padding: 0,
                        border: 'none',
                        'border-radius': 0,
                        background: getStepBackground(
                          intensity,
                          isActiveStep(),
                          isStrongStep(step()),
                        ),
                        'margin-right': isBarEndStep(step()) ? '3px' : 0,
                        color: intensity > 0 ? '#fff' : '#737373',
                        cursor: 'pointer',
                      }}
                    />
                  );
                }}
              </For>
              <button
                type="button"
                onClick={() => resetPattern(row.synthId)}
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
          )}
        </For>
      </section>
    </section>
  );
};
