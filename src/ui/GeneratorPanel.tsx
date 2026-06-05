import { createSignal, For, onMount, type Component } from 'solid-js';

import { stopTransport } from '../audio/transport';
import { generateTrackDna } from '../generators/dna/generate-track-dna';
import type { TrackDna } from '../generators/dna/track-dna';
import { generateEightBarDrumPattern } from '../generators/drums/generate-eight-bar-drum-pattern';
import { generateEightBarHatsPattern } from '../generators/drums/generate-eight-bar-hats-pattern';
import { hatsPatternToDrumClips } from '../generators/drums/hats-pattern-to-drum-clips';
import { kickOffbeatPatternToDrumClips } from '../generators/drums/kick-offbeat-pattern-to-drum-clips';
import { generateMotif, type GenerateMotifOptions } from '../generators/motif/generate-motif';
import { motifToPattern } from '../generators/motif/motif-to-pattern';
import type { Motif } from '../generators/motif/motif';
import {
  getState,
  setDrumClips,
  setDrumPatternFilters,
  setHatsPatternFilters,
  setTrackDna,
  setTransportBpm,
  setVoicing,
  setVoicePattern,
  useStore,
} from '../state/store';
import { TrackBlockPanel } from './TrackBlockPanel';

const DefaultMotifOptions: GenerateMotifOptions = {
  startDegree: 0,
  melodyJumpBias: 0,
  melodyBreakPhaseResetBias: 1,
  melodyBreakPhaseShiftBias: 1,
  melodySpeedBias: 1,
  melodySpeedChangeBias: 0,
  melodicRange: 5,
  absoluteRange: 8,
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
  const trackDna = useStore((state) => state.trackDna);
  const [motifOptions, setMotifOptions] = createSignal<GenerateMotifOptions>(
    getMotifOptionsFromTrackDna(getState().trackDna, DefaultMotifOptions),
  );
  const [motif, setMotif] = createSignal<Motif>();
  const [motifAbsoluteRange, setMotifAbsoluteRange] = createSignal(
    DefaultMotifOptions.absoluteRange,
  );

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
    setHatsPatternFilters({
      density: nextTrackDna.density,
      syncopationScore: nextTrackDna.syncopation,
    });
    setDrumClips(
      hatsPatternToDrumClips(
        generateEightBarHatsPattern(nextTrackDna.bodyHatPattern),
        kickOffbeatPatternToDrumClips(
          generateEightBarDrumPattern(nextTrackDna.bodyDrumPattern),
          getState().sequencer.drumClips,
        ),
      ),
    );
    setVoicing(nextTrackDna.voicing);
    setMotifOptions(nextMotifOptions);
    applyMotif(nextMotif, nextTrackDna, nextMotifOptions.absoluteRange);
  };

  const generateCurrentMotif = (): void => {
    const generatedMotif = generateMotif(motifOptions());
    applyMotif(generatedMotif, trackDna(), motifOptions().absoluteRange);
  };

  onMount(() => {
    generateCurrentTrackDna();
  });

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
          <dt>composition</dt>
          <dd style={{ margin: 0 }}>
            <For each={trackDna().composition}>
              {(block, index) => (
                <>
                  {index() > 0 ? ' -> ' : ''}
                  {block.block}:{block.bars}
                </>
              )}
            </For>
          </dd>
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

      <TrackBlockPanel motif={motif()} absoluteRange={motifAbsoluteRange()} />
    </section>
  );
};
