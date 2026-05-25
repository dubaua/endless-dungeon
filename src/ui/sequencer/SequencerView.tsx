import { For, type Component } from 'solid-js';

import { BAR_TICKS, midiNoteToName, type NoteLane, type Track } from '../../sequencer';

interface SequencerViewProps {
  currentTick: number;
  isPlaying: boolean;
  tracks: Track[];
  totalTicks: number;
}

const TRACK_HEADER_WIDTH = 168;
const PIXELS_PER_BAR = 220;
const LANE_HEIGHT = 32;
const RULER_HEIGHT = 32;

const getTrackLanes = (track: Track): NoteLane[] => {
  if (track.type === 'drumKit' && track.noteLanes) {
    return track.noteLanes;
  }

  const notes = new Set<number>();

  track.clips.forEach((clip) => {
    clip.notes.forEach((note) => {
      notes.add(note.note);
    });
  });

  return [...notes]
    .sort((a, b) => b - a)
    .map((note) => ({
      note,
      label: midiNoteToName(note),
    }));
};

const barNumbers = (totalTicks: number): number[] => {
  const barCount = Math.ceil(totalTicks / BAR_TICKS);
  return Array.from({ length: barCount }, (_, index) => index + 1);
};

const percent = (value: number, total: number): string => `${(value / total) * 100}%`;

const isNoteOn = (
  currentTick: number,
  clipStartTick: number,
  noteStartTick: number,
  noteDurationTicks: number,
): boolean => {
  const startTick = clipStartTick + noteStartTick;
  const endTick = startTick + noteDurationTicks;
  return currentTick >= startTick && currentTick < endTick;
};

export const SequencerView: Component<SequencerViewProps> = (props) => {
  const timelineWidth = (): string => `${(props.totalTicks / BAR_TICKS) * PIXELS_PER_BAR}px`;
  const playheadLeft = (): string => percent(props.currentTick, props.totalTicks);

  return (
    <div
      style={{
        border: '1px solid #d7d7d7',
        'border-radius': '8px',
        height: '600px',
        'overflow-x': 'auto',
        'overflow-y': 'visible',
        background: '#fbfbfb',
      }}
    >
      <div
        style={{
          display: 'grid',
          'grid-template-columns': `${TRACK_HEADER_WIDTH}px ${timelineWidth()}`,
        }}
      >
        <div
          style={{
            height: `${RULER_HEIGHT}px`,
            border: '0 solid #d7d7d7',
            'border-right-width': '1px',
            'border-bottom-width': '1px',
            background: '#f2f2f2',
          }}
        />
        <div
          style={{
            position: 'relative',
            height: `${RULER_HEIGHT}px`,
            'border-bottom': '1px solid #d7d7d7',
            background: '#f6f6f6',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: playheadLeft(),
              top: 0,
              bottom: 0,
              width: '2px',
              background: props.isPlaying ? '#ef4444' : '#999',
              'z-index': 3,
            }}
          />
          <For each={barNumbers(props.totalTicks)}>
            {(bar) => (
              <div
                style={{
                  position: 'absolute',
                  left: percent((bar - 1) * BAR_TICKS, props.totalTicks),
                  top: 0,
                  bottom: 0,
                  width: `${PIXELS_PER_BAR}px`,
                  border: '0 solid #d0d0d0',
                  'border-left-width': '1px',
                  padding: '0.45rem 0.5rem',
                  'font-size': '0.75rem',
                  color: '#555',
                  'box-sizing': 'border-box',
                }}
              >
                {bar}
              </div>
            )}
          </For>
        </div>

        <For each={props.tracks}>
          {(track) => {
            const lanes = getTrackLanes(track);
            const trackHeight = Math.max(lanes.length * LANE_HEIGHT, LANE_HEIGHT);

            return (
              <>
                <div
                  style={{
                    height: `${trackHeight}px`,
                    border: '0 solid #d7d7d7',
                    'border-right-width': '1px',
                    'border-bottom-width': '1px',
                    background: '#f4f4f4',
                    display: 'grid',
                    'grid-template-columns': '1fr',
                    'align-content': 'start',
                  }}
                >
                  <div style={{ padding: '0.5rem 0.6rem 0.35rem' }}>
                    <div style={{ 'font-weight': 700, 'font-size': '0.875rem' }}>{track.name}</div>
                    <div style={{ color: '#666', 'font-size': '0.75rem' }}>{track.type}</div>
                  </div>
                  <div>
                    <For each={lanes}>
                      {(lane) => (
                        <div
                          style={{
                            height: `${LANE_HEIGHT}px`,
                            padding: '0 0.6rem',
                            display: 'flex',
                            'align-items': 'center',
                            'font-size': '0.72rem',
                            color: '#555',
                            border: '0 solid #dfdfdf',
                            'border-top-width': '1px',
                            overflow: 'hidden',
                            'white-space': 'nowrap',
                            'text-overflow': 'ellipsis',
                            'box-sizing': 'border-box',
                          }}
                        >
                          {lane.label}
                        </div>
                      )}
                    </For>
                  </div>
                </div>

                <div
                  style={{
                    position: 'relative',
                    height: `${trackHeight}px`,
                    'border-bottom': '1px solid #d7d7d7',
                    background:
                      'repeating-linear-gradient(to right, #ededed 0, #ededed 1px, transparent 1px, transparent 55px), repeating-linear-gradient(to bottom, #dfdfdf 0, #dfdfdf 1px, transparent 1px, transparent 24px)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: playheadLeft(),
                      top: 0,
                      bottom: 0,
                      width: '2px',
                      background: props.isPlaying ? '#ef4444' : '#999',
                      'z-index': 4,
                    }}
                  />
                  <For each={track.clips}>
                    {(clip) => (
                      <div
                        style={{
                          position: 'absolute',
                          left: percent(clip.startTick, props.totalTicks),
                          top: '4px',
                          width: percent(clip.lengthTicks, props.totalTicks),
                          height: `${trackHeight - 8}px`,
                          background: track.type === 'drumKit' ? '#dbeafe' : '#dcfce7',
                          border: `1px solid ${track.type === 'drumKit' ? '#60a5fa' : '#4ade80'}`,
                          'border-radius': '6px',
                          overflow: 'hidden',
                          'box-sizing': 'border-box',
                        }}
                      >
                        <For each={clip.notes}>
                          {(note) => {
                            const laneIndex = Math.max(
                              0,
                              lanes.findIndex((lane) => lane.note === note.note),
                            );
                            const noteOn = isNoteOn(
                              props.currentTick,
                              clip.startTick,
                              note.startTick,
                              note.durationTicks,
                            );

                            return (
                              <div
                                title={`${note.description} ${noteOn ? 'noteOn' : 'noteOff'}`}
                                style={{
                                  position: 'absolute',
                                  left: percent(note.startTick, clip.lengthTicks),
                                  top: `${laneIndex * LANE_HEIGHT + 4}px`,
                                  width: percent(note.durationTicks, clip.lengthTicks),
                                  height: `${LANE_HEIGHT - 10}px`,
                                  'min-width': '3px',
                                  background: noteOn
                                    ? '#f97316'
                                    : track.type === 'drumKit'
                                      ? '#2563eb'
                                      : '#16a34a',
                                  'border-radius': track.type === 'drumKit' ? '999px' : '3px',
                                  opacity: noteOn ? '1' : String(Math.max(0.3, note.velocity * 0.72)),
                                  'box-shadow': noteOn ? '0 0 0 2px rgba(249, 115, 22, 0.32)' : 'none',
                                  'z-index': noteOn ? 5 : 2,
                                }}
                              />
                            );
                          }}
                        </For>
                      </div>
                    )}
                  </For>
                </div>
              </>
            );
          }}
        </For>
      </div>
    </div>
  );
};
