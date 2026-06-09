import { createMemo, For, type Component } from 'solid-js';

export interface PianoRollEvent {
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

const PianoRollRowHeight = '0.38rem';

const getGridStartStep = (startStep: number): number => {
  return Math.round(startStep);
};

const getGridStepCount = (startStep: number, stepCount: number): number => {
  return Math.max(1, Math.ceil(startStep + stepCount) - getGridStartStep(startStep));
};

const getEventWidthPercent = (startStep: number, stepCount: number): string => {
  return `${(stepCount / getGridStepCount(startStep, stepCount)) * 100}%`;
};

export const PianoRollBar: Component<PianoRollBarProps> = (props) => {
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
          const gridStartStep = getGridStartStep(event.startStep);
          const gridStepCount = getGridStepCount(event.startStep, event.stepCount);
          const eventWidth = getEventWidthPercent(event.startStep, event.stepCount);
          const isCurrentStep = createMemo(
            () =>
              props.activeStep >= event.startStep &&
              props.activeStep < event.startStep + event.stepCount,
          );

          return (
            <div
              style={{
                position: 'relative',
                'grid-column': `${gridStartStep + 1} / span ${gridStepCount}`,
                'grid-row': event.row,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '0 auto 0 0',
                  width: eventWidth,
                  display: 'flex',
                  'align-items': 'center',
                  'justify-content': 'center',
                  background: isCurrentStep() ? '#ef4444' : '#60a5fa',
                  border: isCurrentStep() ? '1px solid #b91c1c' : '1px solid #1d4ed8',
                  color: '#0f172a',
                  'font-size': '12px',
                  'font-weight': 'bold',
                  'line-height': '1',
                  '-webkit-text-stroke': '3px #fff',
                  'paint-order': 'stroke fill',
                }}
              >
                {event.label}
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};
