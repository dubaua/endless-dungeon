import type { Component } from 'solid-js';

import type { KickSnarePatternWeight } from '../generators/drums/weigh-kick-snare-pattern';

export interface KickSnarePatternFilters {
  syncopationScore: number;
  syncopationSpread: number;
  density: number;
  densitySpread: number;
}

interface KickSnarePatternNavigatorProps {
  filters: KickSnarePatternFilters;
  pattern: string;
  patternCount: number;
  patternIndex: number;
  weight: KickSnarePatternWeight | undefined;
  onFilterInput: (key: keyof KickSnarePatternFilters, value: number) => void;
  onPatternIndexInput: (index: number) => void;
}

export const KickSnarePatternNavigator: Component<KickSnarePatternNavigatorProps> = (props) => {
  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <header
        style={{ display: 'flex', gap: '0.5rem', 'align-items': 'center', 'flex-wrap': 'wrap' }}
      >
        <h2 style={{ margin: 0 }}>Drums</h2>
        <span
          style={{
            'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            'font-size': '0.78rem',
          }}
        >
          {props.patternCount > 0 ? `${props.patternIndex + 1}/${props.patternCount}` : '0/0'}{' '}
          {props.pattern}
        </span>
      </header>
      <div
        style={{
          display: 'grid',
          'grid-template-columns': 'repeat(auto-fit, minmax(13rem, 1fr))',
          gap: '0.45rem 0.75rem',
          'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          'font-size': '0.78rem',
        }}
      >
        <label style={{ display: 'grid', gap: '0.15rem' }}>
          <span>pattern {props.patternCount > 0 ? props.patternIndex + 1 : 0}</span>
          <input
            type="range"
            min="0"
            max={Math.max(0, props.patternCount - 1)}
            step="1"
            value={props.patternIndex}
            disabled={props.patternCount === 0}
            onInput={(event) => props.onPatternIndexInput(event.currentTarget.valueAsNumber)}
          />
        </label>
        <label style={{ display: 'grid', gap: '0.15rem' }}>
          <span>sync {props.filters.syncopationScore.toFixed(2)}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={props.filters.syncopationScore}
            onInput={(event) =>
              props.onFilterInput('syncopationScore', event.currentTarget.valueAsNumber)
            }
          />
        </label>
        <label style={{ display: 'grid', gap: '0.15rem' }}>
          <span>spread {props.filters.syncopationSpread.toFixed(2)}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={props.filters.syncopationSpread}
            onInput={(event) =>
              props.onFilterInput('syncopationSpread', event.currentTarget.valueAsNumber)
            }
          />
        </label>
        <label style={{ display: 'grid', gap: '0.15rem' }}>
          <span>density {props.filters.density.toFixed(2)}</span>
          <input
            type="range"
            min="0.35"
            max="1"
            step="0.05"
            value={props.filters.density}
            onInput={(event) => props.onFilterInput('density', event.currentTarget.valueAsNumber)}
          />
        </label>
        <label style={{ display: 'grid', gap: '0.15rem' }}>
          <span>density spread {props.filters.densitySpread.toFixed(2)}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={props.filters.densitySpread}
            onInput={(event) =>
              props.onFilterInput('densitySpread', event.currentTarget.valueAsNumber)
            }
          />
        </label>
      </div>
      <span
        style={{
          'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          'font-size': '0.72rem',
          color: '#666',
        }}
      >
        current k:{props.weight?.kickCount ?? '-'} s:{props.weight?.snareCount ?? '-'} kSync:
        {props.weight?.kickSyncopationScore.toFixed(2) ?? '-'} sSync:
        {props.weight?.snareSyncopationScore.toFixed(2) ?? '-'} sync:
        {props.weight?.syncopationScore.toFixed(2) ?? '-'} density:
        {props.weight?.density.toFixed(2) ?? '-'}
      </span>
    </div>
  );
};
