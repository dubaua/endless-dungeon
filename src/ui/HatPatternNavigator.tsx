import type { Component } from 'solid-js';

import type { HatPatternWeight } from '@generators/drums/weigh-hats-pattern';
import type { KickOffbeatPatternFilters } from '@ui/KickOffbeatPatternNavigator';

interface HatPatternNavigatorProps {
  barIndex: number;
  barPattern: string;
  barPatternCount: number;
  barPatternIndex: number;
  filters: KickOffbeatPatternFilters;
  pattern: string;
  relativePatternCount: number;
  weight: HatPatternWeight | undefined;
  onBarPatternIndexInput: (index: number) => void;
  onFilterInput: (key: keyof KickOffbeatPatternFilters, value: number) => void;
  onRandomPatternInput: () => void;
  onRandomRelativePatternsInput: () => void;
}

export const HatPatternNavigator: Component<HatPatternNavigatorProps> = (props) => {
  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <header
        style={{ display: 'flex', gap: '0.5rem', 'align-items': 'center', 'flex-wrap': 'wrap' }}
      >
        <h2 style={{ margin: 0 }}>Hats</h2>
        <button type="button" onClick={() => props.onRandomPatternInput()}>
          Random
        </button>
        <button type="button" onClick={() => props.onRandomRelativePatternsInput()}>
          Random relatives
        </button>
        <span
          style={{
            'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            'font-size': '0.78rem',
          }}
        >
          bar {props.barIndex + 1} {props.barPattern} relatives:{props.relativePatternCount}
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
          <span>bar pattern {props.barPatternCount > 0 ? props.barPatternIndex + 1 : 0}/{props.barPatternCount}</span>
          <input
            type="range"
            min="0"
            max={Math.max(0, props.barPatternCount - 1)}
            step="1"
            value={props.barPatternIndex}
            disabled={props.barPatternCount === 0}
            onInput={(event) => props.onBarPatternIndexInput(event.currentTarget.valueAsNumber)}
          />
        </label>
        <label style={{ display: 'grid', gap: '0.15rem' }}>
          <span>sync &gt;= {props.filters.syncopationScore.toFixed(2)}</span>
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
        current h:{props.weight?.closedHatCount ?? '-'} o:{props.weight?.openHatCount ?? '-'} sync:
        {props.weight?.syncopationScore.toFixed(2) ?? '-'} density:
        {props.weight?.density.toFixed(2) ?? '-'} relatives:{props.relativePatternCount}
      </span>
    </div>
  );
};
