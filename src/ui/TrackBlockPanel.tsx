import { createMemo, For, type Component } from 'solid-js';
import { Note } from 'tonal';

import type { Motif } from '@generators/motif/motif.type';
import type { PatternStep } from '@sequencer';
import { getTrackBlocks } from '@sequencer/track-service';
import type { DrumClip } from '@sequencer/types';
import type { DrumSynthId } from '@audio/synths/types';
import { loadTrackBlock, useStore } from '@state/store';

interface TrackBlockPanelProps {
  motif: Motif | undefined;
  absoluteRange: number;
}

interface NoteEvent {
  label: string;
  row: number;
  startStep: number;
  stepCount: number;
}

interface NoteEventSegment {
  label: string;
  row: number;
  startStep: number;
  stepCount: number;
}

interface PianoRollEvent {
  label: string;
  row: number;
  startStep: number;
  stepCount: number;
}

interface PianoRollBarProps {
  activeStep: number;
  columnCount: number;
  columnWidthRem: number;
  events: PianoRollEvent[];
  rowCount: number;
}

const StepsPerBar = 16;
const MotifStepsPerBar = 8;
const CellSizeRem = 1;
const LabelWidthRem = 2;
const BarSeparator = '2px solid #9ca3af';
const PianoRollRowHeight = '0.38rem';
const DrumClipLabels: Record<DrumSynthId, string> = {
  kickPrimary: 'Kick P',
  kickSecondary: 'Kick S',
  snarePrimary: 'Snare P',
  snareSecondary: 'Snare S',
  clapPrimary: 'Clap P',
  clapSecondary: 'Clap S',
  closedHat: 'Closed Hat',
  openHat: 'Open Hat',
  ride: 'Ride',
  crash: 'Crash',
};

const getPositiveModulo = (value: number, modulo: number): number => {
  return ((value % modulo) + modulo) % modulo;
};

const getMotifStepRow = (degree: number, absoluteRange: number): number => {
  return absoluteRange - degree + 1;
};

const getMotifRowsCount = (absoluteRange: number): number => {
  return absoluteRange * 2 + 1;
};

const getNoteMidi = (note: string): number => {
  return Note.midi(note) ?? 0;
};

const getNoteEvents = (pattern: PatternStep[]): NoteEvent[] => {
  const notes = pattern.map(([note]) => note).filter((note): note is string => note !== null);
  const uniqueNotes = [...new Set(notes)].sort(
    (left, right) => getNoteMidi(left) - getNoteMidi(right),
  );
  let cursorStep = 0;

  return pattern.flatMap(([note, stepCount]) => {
    const startStep = cursorStep;
    cursorStep += stepCount;

    if (!note) {
      return [];
    }

    return [
      {
        label: note,
        row: uniqueNotes.length - uniqueNotes.indexOf(note),
        startStep,
        stepCount,
      },
    ];
  });
};

const getNoteRowsCount = (events: NoteEvent[]): number => {
  const rows = events.map((event) => event.row);

  return Math.max(1, ...rows);
};

const getNoteEventSegments = (events: NoteEvent[], barIndex: number): NoteEventSegment[] => {
  const barStartStep = barIndex * StepsPerBar;
  const barEndStep = barStartStep + StepsPerBar;

  return events.flatMap((event) => {
    const eventEndStep = event.startStep + event.stepCount;
    const segmentStartStep = Math.max(event.startStep, barStartStep);
    const segmentEndStep = Math.min(eventEndStep, barEndStep);

    if (segmentStartStep >= segmentEndStep) {
      return [];
    }

    return [
      {
        label: event.startStep === segmentStartStep ? event.label : '',
        row: event.row,
        startStep: segmentStartStep - barStartStep,
        stepCount: segmentEndStep - segmentStartStep,
      },
    ];
  });
};

const getDrumStepBackground = (intensity: number, isCurrentStep: boolean): string => {
  if (isCurrentStep) {
    return '#ef4444';
  }

  if (intensity >= 1) {
    return '#f97316';
  }

  if (intensity > 0) {
    return '#facc15';
  }

  return '#fff';
};

const getDrumClipsBarCount = (clips: readonly DrumClip[]): number => {
  const clipEndBars = clips.map((clip) =>
    clip.startBar + Math.ceil(clip.pattern.length / StepsPerBar),
  );

  return Math.max(1, ...clipEndBars);
};

const getDrumClipIntensity = (
  clips: readonly DrumClip[],
  synthId: DrumSynthId,
  absoluteStep: number,
): number => {
  const clip = clips.find((nextClip) => {
    const startStep = nextClip.startBar * StepsPerBar;

    return (
      nextClip.synthId === synthId &&
      absoluteStep >= startStep &&
      absoluteStep < startStep + nextClip.pattern.length
    );
  });

  if (!clip) {
    return 0;
  }

  return clip.pattern[absoluteStep - clip.startBar * StepsPerBar] ?? 0;
};

const PianoRollBar: Component<PianoRollBarProps> = (props) => {
  return (
    <div
      style={{
        display: 'grid',
        'grid-template-columns': `repeat(${props.columnCount}, ${props.columnWidthRem}rem)`,
        'grid-template-rows': `repeat(${props.rowCount}, ${PianoRollRowHeight})`,
        gap: '1px',
        background: `repeating-linear-gradient(to bottom, #f5f5f5 0, #f5f5f5 ${PianoRollRowHeight}, #ededed ${PianoRollRowHeight}, #ededed calc(${PianoRollRowHeight} + 1px))`,
      }}
    >
      <For each={props.events}>
        {(event) => {
          const isCurrentStep = createMemo(
            () =>
              props.activeStep >= event.startStep &&
              props.activeStep < event.startStep + event.stepCount,
          );

          return (
            <div
              style={{
                position: 'relative',
                'grid-column': `${event.startStep + 1} / span ${event.stepCount}`,
                'grid-row': event.row,
                background: isCurrentStep() ? '#ef4444' : '#60a5fa',
                border: isCurrentStep() ? '1px solid #b91c1c' : '1px solid #1d4ed8',
                color: '#0f172a',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  'align-items': 'center',
                  'justify-content': 'center',
                  'font-size': '0.55rem',
                  'line-height': '1',
                  '-webkit-text-stroke': '3px #fff',
                  'paint-order': 'stroke fill',
                }}
              >
                {event.label}
              </span>
            </div>
          );
        }}
      </For>
    </div>
  );
};

export const TrackBlockPanel: Component<TrackBlockPanelProps> = (props) => {
  const sequencer = useStore((state) => state.sequencer);
  const transport = useStore((state) => state.transport);
  const sequenceBlocks = createMemo(() =>
    getTrackBlocks(sequencer().activeTrackId),
  );
  const voicePattern = createMemo(
    () => sequencer().noteClips.find((clip) => clip.synthId === 'voice')?.pattern ?? [],
  );
  const bassPattern = createMemo(
    () => sequencer().noteClips.find((clip) => clip.synthId === 'bass')?.pattern ?? [],
  );
  const drumSynthIds = createMemo(() => [
    ...new Set(sequencer().drumClips.map((clip) => clip.synthId)),
  ]);
  const voiceEvents = createMemo(() => getNoteEvents(voicePattern()));
  const bassEvents = createMemo(() => getNoteEvents(bassPattern()));
  const voiceRowsCount = createMemo(() => getNoteRowsCount(voiceEvents()));
  const bassRowsCount = createMemo(() => getNoteRowsCount(bassEvents()));
  const barCount = createMemo(() => {
    const motifBars = props.motif?.length ?? 0;
    const voiceBars = Math.ceil(
      Math.max(0, ...voiceEvents().map((event) => event.startStep + event.stepCount)) / StepsPerBar,
    );
    const bassBars = Math.ceil(
      Math.max(0, ...bassEvents().map((event) => event.startStep + event.stepCount)) / StepsPerBar,
    );
    const drumBars = Math.max(
      0,
      getDrumClipsBarCount(sequencer().drumClips),
    );

    return Math.max(1, motifBars, voiceBars, bassBars, drumBars);
  });
  const barIndexes = createMemo(() => Array.from({ length: barCount() }, (_, index) => index));
  const stepIndexes = createMemo(() =>
    Array.from({ length: barCount() * StepsPerBar }, (_, index) => index),
  );
  const currentBarIndex = createMemo(() => transport().bar % barCount());

  return (
    <section style={{ display: 'grid', gap: '0.45rem' }}>
      <header style={{ display: 'flex', gap: '0.5rem', 'align-items': 'center', 'flex-wrap': 'wrap' }}>
        <h2 style={{ margin: 0 }}>Block</h2>
        <For each={sequenceBlocks()}>
          {(block) => (
            <button
              type="button"
              onClick={() => loadTrackBlock(sequencer().activeTrackId, block.id)}
              style={{
                border:
                  block.id === sequencer().activeBlockId ? '1px solid #2563eb' : '1px solid #d4d4d4',
                background: block.id === sequencer().activeBlockId ? '#dbeafe' : '#fff',
                padding: '0.2rem 0.45rem',
              }}
            >
              {block.function}
            </button>
          )}
        </For>
      </header>
      <div style={{ overflow: 'auto' }}>
        <table
          style={{
            'border-collapse': 'collapse',
            'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            'font-size': '0.65rem',
            'table-layout': 'fixed',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: `${LabelWidthRem}rem`,
                  'min-width': `${LabelWidthRem}rem`,
                  border: '1px solid #d4d4d4',
                  padding: '0.25rem',
                  'text-align': 'left',
                  background: '#f5f5f5',
                }}
              />
              <For each={barIndexes()}>
                {(barIndex) => (
                  <th
                    colspan={StepsPerBar}
                    style={{
                      border: '1px solid #d4d4d4',
                      'border-right':
                        barIndex === barCount() - 1 ? '1px solid #d4d4d4' : BarSeparator,
                      padding: '0.25rem',
                      'text-align': 'left',
                      background: '#f5f5f5',
                      'font-weight': 500,
                    }}
                  >
                    bar {barIndex + 1}
                  </th>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th
                style={{
                  border: '1px solid #d4d4d4',
                  padding: '0.25rem',
                  'text-align': 'left',
                  background: '#fafafa',
                  'vertical-align': 'top',
                }}
              >
                motif
              </th>
              <For each={barIndexes()}>
                {(barIndex) => {
                  const motifBar = createMemo(() => props.motif?.[barIndex]);
                  const motifEvents = createMemo<PianoRollEvent[]>(
                    () =>
                      motifBar()?.steps.map((degree, stepIndex) => ({
                        label: String(degree),
                        row: getMotifStepRow(degree, props.absoluteRange),
                        startStep: stepIndex,
                        stepCount: 1,
                      })) ?? [],
                  );
                  const activeStep = createMemo(() =>
                    transport().isPlaying && currentBarIndex() === barIndex
                      ? Math.floor(transport().step / 2)
                      : -1,
                  );

                  return (
                    <td
                      colspan={StepsPerBar}
                      style={{
                        border: '1px solid #d4d4d4',
                        'border-right':
                          barIndex === barCount() - 1 ? '1px solid #d4d4d4' : BarSeparator,
                        padding: 0,
                        width: `${StepsPerBar * CellSizeRem}rem`,
                        'min-width': `${StepsPerBar * CellSizeRem}rem`,
                      }}
                    >
                      <PianoRollBar
                        activeStep={activeStep()}
                        columnCount={MotifStepsPerBar}
                        columnWidthRem={CellSizeRem * 2}
                        events={motifEvents()}
                        rowCount={getMotifRowsCount(props.absoluteRange)}
                      />
                    </td>
                  );
                }}
              </For>
            </tr>
            <tr>
              <th
                style={{
                  border: '1px solid #d4d4d4',
                  padding: '0.25rem',
                  'text-align': 'left',
                  background: '#fafafa',
                  'vertical-align': 'top',
                }}
              >
                voice
              </th>
              <For each={barIndexes()}>
                {(barIndex) => (
                  <td
                    colspan={StepsPerBar}
                    style={{
                      border: '1px solid #d4d4d4',
                      'border-right':
                        barIndex === barCount() - 1 ? '1px solid #d4d4d4' : BarSeparator,
                      padding: 0,
                      width: `${StepsPerBar * CellSizeRem}rem`,
                      'min-width': `${StepsPerBar * CellSizeRem}rem`,
                    }}
                  >
                    <PianoRollBar
                      activeStep={
                        transport().isPlaying && currentBarIndex() === barIndex
                          ? transport().step
                          : -1
                      }
                      columnCount={StepsPerBar}
                      columnWidthRem={CellSizeRem}
                      events={getNoteEventSegments(voiceEvents(), barIndex)}
                      rowCount={voiceRowsCount()}
                    />
                  </td>
                )}
              </For>
            </tr>
            <tr>
              <th
                style={{
                  border: '1px solid #d4d4d4',
                  padding: '0.25rem',
                  'text-align': 'left',
                  background: '#fafafa',
                  'vertical-align': 'top',
                }}
              >
                bass
              </th>
              <For each={barIndexes()}>
                {(barIndex) => (
                  <td
                    colspan={StepsPerBar}
                    style={{
                      border: '1px solid #d4d4d4',
                      'border-right':
                        barIndex === barCount() - 1 ? '1px solid #d4d4d4' : BarSeparator,
                      padding: 0,
                      width: `${StepsPerBar * CellSizeRem}rem`,
                      'min-width': `${StepsPerBar * CellSizeRem}rem`,
                    }}
                  >
                    <PianoRollBar
                      activeStep={
                        transport().isPlaying && currentBarIndex() === barIndex
                          ? transport().step
                          : -1
                      }
                      columnCount={StepsPerBar}
                      columnWidthRem={CellSizeRem}
                      events={getNoteEventSegments(bassEvents(), barIndex)}
                      rowCount={bassRowsCount()}
                    />
                  </td>
                )}
              </For>
            </tr>
            <For each={drumSynthIds()}>
              {(synthId) => (
                <tr>
                  <th
                    style={{
                      border: '1px solid #d4d4d4',
                      padding: '0.25rem',
                      'text-align': 'left',
                      background: '#fafafa',
                      'white-space': 'nowrap',
                    }}
                  >
                    {DrumClipLabels[synthId]}
                  </th>
                  <For each={stepIndexes()}>
                    {(absoluteStep) => {
                      const intensity = createMemo(() =>
                        getDrumClipIntensity(sequencer().drumClips, synthId, absoluteStep),
                      );
                      const barIndex = createMemo(() => Math.floor(absoluteStep / StepsPerBar));
                      const stepIndex = createMemo(() =>
                        getPositiveModulo(absoluteStep, StepsPerBar),
                      );
                      const isCurrentStep = createMemo(
                        () =>
                          transport().isPlaying &&
                          currentBarIndex() === barIndex() &&
                          transport().step === stepIndex(),
                      );

                      return (
                        <td
                          style={{
                            width: `${CellSizeRem}rem`,
                            height: `${CellSizeRem}rem`,
                            'min-width': `${CellSizeRem}rem`,
                            border: '1px solid #d4d4d4',
                            'border-right':
                              stepIndex() === StepsPerBar - 1 && barIndex() !== barCount() - 1
                                ? BarSeparator
                                : '1px solid #d4d4d4',
                            padding: 0,
                            background: getDrumStepBackground(intensity(), isCurrentStep()),
                          }}
                        />
                      );
                    }}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </section>
  );
};
