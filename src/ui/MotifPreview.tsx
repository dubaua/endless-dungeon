import { createMemo, For, type Component } from 'solid-js';

import type { Motif, MotifBar, MotifStepEvent } from '../generators/motif/motif';
import { useStore } from '../state/store';

interface MotifPreviewProps {
  motif: Motif;
  absoluteRange: number;
}

interface MotifRowBar {
  bar: MotifBar;
  index: number;
}

const groupMotifRows = (motif: Motif): MotifRowBar[][] => {
  const rows: MotifRowBar[][] = [];

  motif.forEach((bar, index) => {
    const rowIndex = Math.floor(index / 4);

    rows[rowIndex] = [...(rows[rowIndex] ?? []), { bar, index }];
  });

  return rows;
};

const getClipRow = (degree: number, absoluteRange: number): number => {
  return absoluteRange - degree + 1;
};

const getClipRowsCount = (absoluteRange: number): number => {
  return absoluteRange * 2 + 1;
};

const EventLabels: Record<MotifStepEvent, string> = {
  cadence: 'cad',
  'jump-down': 'jdn',
  'jump-up': 'jup',
  'phase-reset': 'rst',
  'phase-shift': 'sft',
  'speed-change': 'spd',
};

export const MotifPreview: Component<MotifPreviewProps> = (props) => {
  const transport = useStore((state) => state.transport);
  const motifRows = createMemo(() => groupMotifRows(props.motif));
  const clipRowsCount = createMemo(() => getClipRowsCount(props.absoluteRange));
  const currentBarIndex = createMemo(() => transport().bar % props.motif.length);
  const currentStepIndex = createMemo(() => Math.floor(transport().step / 2));

  return (
    <div style={{ display: 'grid', gap: '0.35rem' }}>
      <h2 style={{ margin: 0 }}>Motif</h2>
      <div
        style={{
          display: 'grid',
          gap: '0.4rem',
          overflow: 'auto',
          'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          'font-size': '0.74rem',
          'line-height': '1.35',
        }}
      >
        <For each={motifRows()}>
          {(row) => (
            <div
              style={{
                display: 'grid',
                'grid-template-columns': 'repeat(4, minmax(14rem, 1fr))',
                gap: '0.5rem',
                'min-width': '58rem',
              }}
            >
              <For each={row}>
                {({ bar, index }) => {
                  const isActiveBar = (): boolean => transport().isPlaying && index === currentBarIndex();

                  return (
                    <div
                      style={{
                        display: 'grid',
                        gap: '0.3rem',
                        padding: '0.4rem',
                        border: '1px solid #d4d4d4',
                        'border-radius': '0.25rem',
                        background: '#fff',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          'align-items': 'baseline',
                          'white-space': 'nowrap',
                        }}
                      >
                        <span style={{ color: '#666', width: '3.5rem', 'flex-shrink': 0 }}>
                          bar {index + 1}
                        </span>
                        <span>
                          {bar.steps.map((degree) => String(degree).padStart(3, ' ')).join(' ')}
                        </span>
                      </div>

                      <div
                        aria-label={`bar ${index + 1} midi clip`}
                        role="img"
                        style={{
                          display: 'grid',
                          'grid-template-columns': `repeat(${bar.steps.length}, minmax(1.25rem, 1fr))`,
                          'grid-template-rows': `repeat(${clipRowsCount()}, 0.38rem)`,
                          gap: '1px',
                          padding: '0.25rem',
                          background:
                            'repeating-linear-gradient(to bottom, #f5f5f5 0, #f5f5f5 0.38rem, #ededed 0.38rem, #ededed calc(0.38rem + 1px))',
                          border: '1px solid #d4d4d4',
                          'border-radius': '0.2rem',
                        }}
                      >
                        <For each={bar.steps}>
                          {(degree, stepIndex) => {
                            const isActiveStep = (): boolean =>
                              isActiveBar() && stepIndex() === currentStepIndex();

                            return (
                              <div
                                style={{
                                  position: 'relative',
                                  'grid-column': stepIndex() + 1,
                                  'grid-row': getClipRow(degree, props.absoluteRange),
                                  'min-width': 0,
                                  'border-radius': '0.12rem',
                                  background: isActiveStep() ? '#ef4444' : '#60a5fa',
                                  border: isActiveStep() ? '1px solid #b91c1c' : '1px solid #1d4ed8',
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
                                    'z-index': 1,
                                    'font-size': '0.75rem',
                                    'line-height': '1',
                                    '-webkit-text-stroke': '3px #fff',
                                    'paint-order': 'stroke fill',
                                  }}
                                >
                                  {degree}
                                </span>
                              </div>
                            );
                          }}
                        </For>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          'grid-template-columns': `repeat(${bar.stepEvents.length}, minmax(1.25rem, 1fr))`,
                          gap: '1px',
                          'min-height': '1rem',
                        }}
                      >
                        <For each={bar.stepEvents}>
                          {(events) => (
                            <span
                              style={{
                                display: 'flex',
                                'align-items': 'center',
                                'justify-content': 'center',
                                overflow: 'hidden',
                                color: events.length > 0 ? '#111827' : '#a3a3a3',
                                'font-size': '0.55rem',
                                'font-weight': events.length > 0 ? 700 : 400,
                                'white-space': 'nowrap',
                              }}
                            >
                              {events.length > 0
                                ? events.map((event) => EventLabels[event]).join('+')
                                : '-'}
                            </span>
                          )}
                        </For>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
