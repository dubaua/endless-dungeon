import { InitialTrack } from '@sequencer/initial-track';
import type { Track, TrackBlock } from '@sequencer/types';

let tracks: Track[] = [InitialTrack];

export const getTrack = (trackId: string): Track | undefined =>
  tracks.find((track) => track.id === trackId);

export const getTrackBlocks = (trackId: string): TrackBlock[] => getTrack(trackId)?.blocks ?? [];

export const getTrackBlock = (
  trackId: string,
  blockId: string,
): TrackBlock | undefined => getTrack(trackId)?.blocks.find((block) => block.id === blockId);

export const updateTrackBlock = (trackId: string, block: TrackBlock): void => {
  tracks = tracks.map((track) => {
    if (track.id !== trackId) {
      return track;
    }

    return {
      ...track,
      blocks: track.blocks.map((nextBlock) => {
        if (nextBlock.id !== block.id) {
          return nextBlock;
        }

        return block;
      }),
    };
  });
};

export const updateTrack = (track: Track): void => {
  tracks = tracks.map((nextTrack) => {
    if (nextTrack.id !== track.id) {
      return nextTrack;
    }

    return track;
  });
};
