import type { Component, JSX } from 'solid-js';

import { positionToValue, valueToPosition, type SliderCurve } from './slider-utils';

interface SliderProps {
  curve?: SliderCurve;
  format?: (value: number) => string;
  label: string;
  mapPositionToValue?: (position: number) => number;
  max: number;
  min: number;
  snap?: (value: number) => number;
  unmapValueToPosition?: (value: number) => number;
  value: number;
  onInput: (value: number) => void;
}

export const Slider: Component<SliderProps> = (props) => {
  const handleInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    const position = Number(event.currentTarget.value);

    if (!Number.isFinite(position)) {
      return;
    }

    const curve = props.curve ?? 'linear';
    const value = props.mapPositionToValue
      ? props.mapPositionToValue(position)
      : positionToValue(position, props.min, props.max, curve);

    props.onInput(props.snap ? props.snap(value) : value);
  };

  const position = (): number =>
    props.unmapValueToPosition
      ? props.unmapValueToPosition(props.value)
      : valueToPosition(props.value, props.min, props.max, props.curve ?? 'linear');

  const formattedValue = (): string =>
    props.format ? props.format(props.value) : String(props.value);

  return (
    <div
      style={{
        display: 'grid',
        gap: '0.4rem',
        'justify-items': 'center',
        'font-size': '10px',
        'min-width': '32px',
      }}
    >
      <span style={{ 'font-weight': 600 }}>{props.label}</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.001"
        value={position()}
        onInput={handleInput}
        style={{
          width: '28px',
          height: '126px',
          'writing-mode': 'vertical-lr',
          direction: 'rtl',
          'accent-color': '#2563eb',
        }}
      />
      <span style={{ color: '#555', 'font-variant-numeric': 'tabular-nums' }}>
        {formattedValue()}
      </span>
    </div>
  );
};
