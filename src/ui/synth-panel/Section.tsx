import type { Component, JSX } from 'solid-js';

export const Section: Component<{ children: JSX.Element; title: string; tiny?: boolean }> = (
  props,
) => (
  <section
    style={{
      display: 'grid',
      gap: '0.65rem',
      border: '1px solid #ccc',
      'border-radius': props.tiny ? 'none' : '3px',
      padding: '4px',
      transform: props.tiny ? 'translateY(5px)' : 'none',
    }}
  >
    <h3 style={{ margin: 0, 'font-weight': '400', 'font-size': '12px' }}>{props.title}</h3>
    {props.children}
  </section>
);
