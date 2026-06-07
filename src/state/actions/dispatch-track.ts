import { stopTransport } from '@audio/transport';
import type { TrackTemp } from '@generators/track/generate-track';
import {
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
  setDrumClips(track.drumClips);
  setVoicing(track.voicing);
  setVoicePattern(track.voicePattern);
  setPlayerMotif(track.motif, track.motifOptions.absoluteRange);
  stopTransport();
};
