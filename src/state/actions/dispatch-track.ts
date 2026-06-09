import { stopTransport } from '@audio/transport';
import type { TrackTemp } from '@generators/track/generate-track';
import {
  setBassPattern,
  setDrumClips,
  setDrumPatternFilters,
  setHatsPatternFilters,
  setPlayerMotif,
  setTrackDna,
  setTransportBpm,
  setVoicing,
  setVoicePattern,
} from '@state/store';

export const dispatchTrack = (track: TrackTemp): void => {
  const block = track.blocks[0];

  if (!block) {
    return;
  }

  setTrackDna(track.trackDna);
  setTransportBpm(track.trackDna.bpm);
  setDrumPatternFilters({
    density: track.trackDna.density,
    syncopationScore: track.trackDna.syncopation,
  });
  setHatsPatternFilters({
    density: track.trackDna.density,
    syncopationScore: track.trackDna.syncopation,
  });
  setDrumClips(block.drumClips);
  setVoicing(block.voicing);
  setVoicePattern(block.voicePattern);
  setBassPattern(block.bassPattern);
  setPlayerMotif(block.motif, block.motifOptions.absoluteRange);
  stopTransport();
};
