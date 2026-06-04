import type { Component } from 'solid-js';

import type {
  ClosedHatVoicing,
  CrashVoicing,
  DrumSynthId,
  KickVoicing,
  OpenHatVoicing,
  RideVoicing,
  SnareVoicing,
} from '../audio/synths/types';
import { setDrumSynthVoicing, useStore } from '../state/store';
import { DrumsPanel } from './DrumsPanel';
import { TransportPanel } from './TransportPanel';
import { CymbalControls } from './synth-panel/CymbalControls';
import { KickControls } from './synth-panel/KickControls';
import { SnareControls } from './synth-panel/SnareControls';
import type { DrumNumberKey } from './synth-panel/slider-utils';

type CymbalSynthId = Extract<DrumSynthId, 'closedHat' | 'openHat' | 'crash' | 'ride'>;

const CymbalSynthIds: readonly CymbalSynthId[] = ['closedHat', 'openHat', 'crash', 'ride'];

const setDrumNumber = (synthId: DrumSynthId, key: DrumNumberKey, value: number): void => {
  setDrumSynthVoicing(synthId, { [key]: value });
};

export const DrumsRoute: Component = () => {
  const drums = useStore((state) => state.voicing.drums);
  const kick = (): KickVoicing => drums().kick as KickVoicing;
  const snare = (): SnareVoicing => drums().snare as SnareVoicing;
  const closedHat = (): ClosedHatVoicing => drums().closedHat as ClosedHatVoicing;
  const openHat = (): OpenHatVoicing => drums().openHat as OpenHatVoicing;
  const crash = (): CrashVoicing => drums().crash as CrashVoicing;
  const ride = (): RideVoicing => drums().ride as RideVoicing;

  const setCymbalNumber = (key: DrumNumberKey, value: number): void => {
    CymbalSynthIds.forEach((synthId) => {
      setDrumSynthVoicing(synthId, { [key]: value });
    });
  };

  return (
    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', 'align-items': 'center', gap: '0.75rem' }}>
        <h1 style={{ margin: 0 }}>Drums</h1>
        <a href="/">Back</a>
      </header>
      <TransportPanel />
      <DrumsPanel />
      <section style={{ display: 'grid', gap: '8px' }}>
        <header>
          <h2 style={{ margin: 0 }}>Drum Voicing</h2>
        </header>
        <div style={{ display: 'flex', gap: '8px' }}>
          <KickControls kick={kick()} onInput={(key, value) => setDrumNumber('kick', key, value)} />
          <SnareControls
            snare={snare()}
            onInput={(key, value) => setDrumNumber('snare', key, value)}
          />
          <CymbalControls
            closedHat={closedHat()}
            openHat={openHat()}
            crash={crash()}
            ride={ride()}
            onClosedHatInput={(key, value) => setDrumNumber('closedHat', key, value)}
            onOpenHatInput={(key, value) => setDrumNumber('openHat', key, value)}
            onCrashInput={(key, value) => setDrumNumber('crash', key, value)}
            onRideInput={(key, value) => setDrumNumber('ride', key, value)}
            onCommonInput={setCymbalNumber}
          />
        </div>
      </section>
    </div>
  );
};
