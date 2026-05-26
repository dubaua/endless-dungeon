import { createMemo, For, type Component } from 'solid-js';

import type { BlockFunction } from '../generators/blocks/block-function';
import { generateTracks } from '../generators/demo/generate-tracks';

const blockColors: Record<BlockFunction, string> = {
  body: '#b7e4c7',
  variation: '#bfdbfe',
  tension: '#fde68a',
  drop: '#fecdd3',
  pit: '#ddd6fe',
  break: '#e5e7eb',
  breakdown: '#99f6e4',
};

const barWidthRem = 0.8;

export const GeneratorPanel: Component = () => {
  const tracks = createMemo(() => generateTracks(100));

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'grid', gap: '0.35rem' }}>
        <h2 style={{ margin: 0 }}>Block Routes</h2>
        <div
          style={{
            display: 'grid',
            gap: '0.12rem',
            'max-width': '100%',
            overflow: 'auto',
            'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            'font-size': '0.68rem',
            'line-height': 1.25,
          }}
        >
          <For each={tracks()}>
            {(track) => (
              <div
                style={{
                  display: 'flex',
                  gap: '0.2rem',
                  margin: '4px 0',
                  'align-items': 'center',
                  'white-space': 'nowrap',
                }}
              >
                <For each={track}>
                  {(trackBlock) => (
                    <span
                      style={{
                        background: blockColors[trackBlock.block],
                        color: '#111',
                        display: 'inline-flex',
                        'justify-content': 'center',
                        'flex-shrink': 0,
                        width: `${trackBlock.bars * barWidthRem}rem`,
                        padding: '0.06rem 0.25rem',
                        'border-radius': '0.2rem',
                        'font-weight': 700,
                      }}
                    >
                      {trackBlock.block}
                    </span>
                  )}
                </For>
                <span style={{ color: '#666', 'margin-left': '0.25rem' }}>
                  {track.reduce((sum, trackBlock) => sum + trackBlock.bars, 0)}
                </span>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
};
