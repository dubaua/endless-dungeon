import type { Component } from 'solid-js';

import { useStore } from '@state/store';
import { TrackBlockPanel } from '@ui/TrackBlockPanel';

export const PlayerPanel: Component = () => {
  const player = useStore((state) => state.player);

  return (
    <TrackBlockPanel
      motif={player().motif}
      absoluteRange={player().motifAbsoluteRange}
    />
  );
};
