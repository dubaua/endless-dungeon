import type { Component, JSX } from 'solid-js';

export const SliderRow: Component<{ children: JSX.Element }> = (props) => (
  <div
    style={{
      display: 'flex',
      gap: '0.85rem',
      'align-items': 'end',
      'flex-wrap': 'wrap',
    }}
  >
    {props.children}
  </div>
);
