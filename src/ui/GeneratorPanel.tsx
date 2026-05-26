import { createMemo, createSignal, For, type Component } from 'solid-js';

import type { BlockFunction } from '../generators/blocks/block-function';
import { generateTracks } from '../generators/demo/generate-tracks';
import { generateTrackDna } from '../generators/dna/generate-track-dna';

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
  const [trackDna, setTrackDna] = createSignal(generateTrackDna());

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <header style={{ display: 'flex', gap: '0.5rem', 'align-items': 'center' }}>
          <h2 style={{ margin: 0 }}>Track DNA</h2>
          <button type="button" onClick={() => setTrackDna(generateTrackDna())}>
            Generate
          </button>
        </header>
        <dl
          style={{
            display: 'grid',
            'grid-template-columns': 'max-content 1fr',
            gap: '0.25rem 0.75rem',
            margin: 0,
            'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            'font-size': '0.78rem',
          }}
        >
          <dt>rootNote</dt>
          <dd style={{ margin: 0 }}>{trackDna().rootNote}</dd>
          <dt>scale</dt>
          <dd style={{ margin: 0 }}>
            {trackDna().scaleName} [{trackDna().scaleNotes.join(' ')}]
          </dd>
          <dt>bpm</dt>
          <dd style={{ margin: 0 }}>{trackDna().bpm}</dd>
          <dt>syncopation</dt>
          <dd style={{ margin: 0 }}>{trackDna().syncopation.toFixed(1)}</dd>
          <dt>density</dt>
          <dd style={{ margin: 0 }}>{trackDna().density.toFixed(1)}</dd>
          <dt>intensity</dt>
          <dd style={{ margin: 0 }}>{trackDna().intensity.toFixed(1)}</dd>
          <dt>variationBias</dt>
          <dd style={{ margin: 0 }}>{trackDna().variationBias.toFixed(1)}</dd>
          <dt>melodicRange</dt>
          <dd style={{ margin: 0 }}>{trackDna().melodicRange} semitones</dd>
          <dt>bassRange</dt>
          <dd style={{ margin: 0 }}>{trackDna().bassRange} semitones</dd>
        </dl>
      </div>

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
