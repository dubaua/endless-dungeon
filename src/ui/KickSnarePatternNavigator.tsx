import type { Component } from 'solid-js';

import { KickSnarePatterns } from '../generators/drums/kick-snare-patterns';

interface KickSnarePatternNavigatorProps {
  pattern: string;
  onNext: () => void;
  onPrevious: () => void;
}

export const KickSnarePatternNavigator: Component<KickSnarePatternNavigatorProps> = (props) => {
  const patternIndex = (): number => KickSnarePatterns.indexOf(props.pattern);

  return (
    <header style={{ display: 'flex', gap: '0.5rem', 'align-items': 'center', 'flex-wrap': 'wrap' }}>
      <h2 style={{ margin: 0 }}>Drums</h2>
      <button type="button" onClick={props.onPrevious}>
        Previous
      </button>
      <button type="button" onClick={props.onNext}>
        Next
      </button>
      <span
        style={{
          'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          'font-size': '0.78rem',
        }}
      >
        {patternIndex() >= 0 ? `${patternIndex() + 1}/${KickSnarePatterns.length}` : 'custom'}{' '}
        {props.pattern}
      </span>
    </header>
  );
};
