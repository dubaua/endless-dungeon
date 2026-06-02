import { createMemo, createSignal, For, Show, type Component } from 'solid-js';

import { stopTransport } from '../audio/transport';
import type { BlockFunction } from '../generators/blocks/block-function';
import { generateTracks } from '../generators/demo/generate-tracks';
import { generateTrackDna } from '../generators/dna/generate-track-dna';
import type { TrackDna } from '../generators/dna/track-dna';
import { generateEightBarDrumPattern } from '../generators/drums/generate-eight-bar-drum-pattern';
import { kickSnarePatternToChannels } from '../generators/drums/kick-snare-pattern-to-channels';
import { generateMotif, type GenerateMotifOptions } from '../generators/motif/generate-motif';
import { motifToPattern } from '../generators/motif/motif-to-pattern';
import type { Motif } from '../generators/motif/motif';
import {
  getState,
  setDrumChannels,
  setDrumPatternFilters,
  setSynthState,
  setTrackDna,
  setTransportBpm,
  setVoicePattern,
  useStore,
} from '../state/store';
import { MotifPreview } from './MotifPreview';

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

const DefaultMotifOptions: GenerateMotifOptions = {
  startDegree: 0,
  melodyJumpBias: 0.5,
  melodyBreakPhaseResetBias: 0.5,
  melodyBreakPhaseShiftBias: 0.5,
  melodySpeedBias: 0.5,
  melodySpeedChangeBias: 0.2,
  melodicRange: 8,
  absoluteRange: 12,
  midCadence: 5,
  finalCadence: 0,
};

interface MotifOptionField {
  key: keyof GenerateMotifOptions;
  label: string;
  max: number;
  min: number;
  step: number;
}

const MotifOptionFields: readonly MotifOptionField[] = [
  { key: 'startDegree', label: 'startDegree', min: -16, max: 16, step: 1 },
  { key: 'midCadence', label: 'midCadence', min: -16, max: 16, step: 1 },
  { key: 'finalCadence', label: 'finalCadence', min: -16, max: 16, step: 1 },
  { key: 'melodicRange', label: 'melodicRange', min: 1, max: 16, step: 1 },
  { key: 'absoluteRange', label: 'absoluteRange', min: 1, max: 16, step: 1 },
  { key: 'melodyJumpBias', label: 'melodyJumpBias', min: 0, max: 1, step: 0.05 },
  {
    key: 'melodyBreakPhaseResetBias',
    label: 'melodyBreakPhaseResetBias',
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    key: 'melodyBreakPhaseShiftBias',
    label: 'melodyBreakPhaseShiftBias',
    min: 0,
    max: 1,
    step: 0.05,
  },
  { key: 'melodySpeedBias', label: 'melodySpeedBias', min: 0, max: 1, step: 0.05 },
  { key: 'melodySpeedChangeBias', label: 'melodySpeedChangeBias', min: 0, max: 1, step: 0.05 },
];

const formatMotifOptionValue = (value: number, step: number): string => {
  return step < 1 ? value.toFixed(2) : String(value);
};

const getMotifOptionsFromTrackDna = (
  trackDna: TrackDna,
  options: GenerateMotifOptions,
): GenerateMotifOptions => {
  return {
    ...options,
    melodyJumpBias: trackDna.melodyJumpBias,
    melodyBreakPhaseResetBias: trackDna.melodyBreakPhaseResetBias,
    melodyBreakPhaseShiftBias: trackDna.melodyBreakPhaseShiftBias,
    melodySpeedBias: trackDna.melodySpeedBias,
    melodySpeedChangeBias: trackDna.melodySpeedChangeBias,
    melodicRange: trackDna.melodicRange,
    absoluteRange: trackDna.absoluteRange,
  };
};

export const GeneratorPanel: Component = () => {
  const tracks = createMemo(() => generateTracks(100));
  const trackDna = useStore((state) => state.trackDna);
  const [motifOptions, setMotifOptions] = createSignal<GenerateMotifOptions>(
    getMotifOptionsFromTrackDna(getState().trackDna, DefaultMotifOptions),
  );
  const [motif, setMotif] = createSignal<Motif>();
  const [motifAbsoluteRange, setMotifAbsoluteRange] = createSignal(DefaultMotifOptions.absoluteRange);

  const updateMotifOption = (key: keyof GenerateMotifOptions, value: number): void => {
    setMotifOptions((options) => ({ ...options, [key]: value }));
  };

  const applyMotif = (nextMotif: Motif, nextTrackDna: TrackDna, absoluteRange: number): void => {
    setMotif(nextMotif);
    setMotifAbsoluteRange(absoluteRange);
    setVoicePattern(motifToPattern(nextMotif, nextTrackDna));
    stopTransport();
  };

  const generateCurrentTrackDna = (): void => {
    const nextTrackDna = generateTrackDna();
    const nextMotifOptions = getMotifOptionsFromTrackDna(nextTrackDna, motifOptions());
    const nextMotif = generateMotif(nextMotifOptions);

    setTrackDna(nextTrackDna);
    setTransportBpm(nextTrackDna.bpm);
    setDrumPatternFilters({
      density: nextTrackDna.density,
      syncopationScore: nextTrackDna.syncopation,
    });
    setDrumChannels(
      kickSnarePatternToChannels(
        generateEightBarDrumPattern(nextTrackDna.bodyDrumPattern),
        getState().sequencer.drumChannels,
      ),
    );
    setSynthState(nextTrackDna.voice);
    setMotifOptions(nextMotifOptions);
    applyMotif(nextMotif, nextTrackDna, nextMotifOptions.absoluteRange);
  };

  const generateCurrentMotif = (): void => {
    const generatedMotif = generateMotif(motifOptions());
    applyMotif(generatedMotif, trackDna(), motifOptions().absoluteRange);
  };

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <header style={{ display: 'flex', gap: '0.5rem', 'align-items': 'center' }}>
          <h2 style={{ margin: 0 }}>Track DNA</h2>
          <button type="button" onClick={generateCurrentTrackDna}>
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
          <dt>noteLengthVariationBias</dt>
          <dd style={{ margin: 0 }}>{trackDna().noteLengthVariationBias.toFixed(1)}</dd>
          <dt>noteGapBias</dt>
          <dd style={{ margin: 0 }}>{trackDna().noteGapBias.toFixed(1)}</dd>
          <dt>melodyJumpBias</dt>
          <dd style={{ margin: 0 }}>{trackDna().melodyJumpBias.toFixed(1)}</dd>
          <dt>melodyBreakPhaseResetBias</dt>
          <dd style={{ margin: 0 }}>{trackDna().melodyBreakPhaseResetBias.toFixed(1)}</dd>
          <dt>melodyBreakPhaseShiftBias</dt>
          <dd style={{ margin: 0 }}>{trackDna().melodyBreakPhaseShiftBias.toFixed(1)}</dd>
          <dt>melodySpeedBias</dt>
          <dd style={{ margin: 0 }}>{trackDna().melodySpeedBias.toFixed(1)}</dd>
          <dt>melodySpeedChangeBias</dt>
          <dd style={{ margin: 0 }}>{trackDna().melodySpeedChangeBias.toFixed(1)}</dd>
          <dt>melodicRange</dt>
          <dd style={{ margin: 0 }}>{trackDna().melodicRange} steps</dd>
          <dt>absoluteRange</dt>
          <dd style={{ margin: 0 }}>{trackDna().absoluteRange} steps</dd>
          <dt>bassRange</dt>
          <dd style={{ margin: 0 }}>{trackDna().bassRange} steps</dd>
        </dl>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <header style={{ display: 'flex', gap: '0.5rem', 'align-items': 'center' }}>
          <h2 style={{ margin: 0 }}>Motif Generator</h2>
          <button type="button" onClick={generateCurrentMotif}>
            Generate
          </button>
        </header>
        <div
          style={{
            display: 'grid',
            'grid-template-columns': 'repeat(auto-fit, minmax(18rem, 1fr))',
            gap: '0.55rem 1rem',
            'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            'font-size': '0.74rem',
          }}
        >
          <For each={MotifOptionFields}>
            {(field) => {
              const value = () => motifOptions()[field.key] ?? 0;

              return (
                <label style={{ display: 'grid', gap: '0.18rem' }}>
                  <span
                    style={{
                      display: 'flex',
                      'justify-content': 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <span>{field.label}</span>
                    <span>{formatMotifOptionValue(value(), field.step)}</span>
                  </span>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={value()}
                    onInput={(event) =>
                      updateMotifOption(field.key, event.currentTarget.valueAsNumber)
                    }
                  />
                </label>
              );
            }}
          </For>
        </div>
      </div>

      <Show when={motif()}>
        {(generatedMotif) => (
          <MotifPreview motif={generatedMotif()} absoluteRange={motifAbsoluteRange()} />
        )}
      </Show>

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
            'line-height': '1.25',
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
