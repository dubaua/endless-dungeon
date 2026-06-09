import { For, onCleanup, onMount, type Component, type JSX } from 'solid-js';
import { createStore } from 'solid-js/store';

import { getMixerMeterLevel } from '@audio/mixer';
import {
  setMixerChannelState,
  setMixerGroupState,
  setMixerMasterMuted,
  setMixerMasterPan,
  setMixerMasterVolume,
  useStore,
} from '@state/store';
import { clamp } from '@utils/clamp';

const formatVolume = (value: number): string => value.toFixed(2);
const formatPan = (value: number): string => value.toFixed(2);
const getMeterColor = (level: number): string => {
  if (level > 0.85) {
    return '#dc2626';
  }

  if (level > 0.65) {
    return '#f59e0b';
  }

  return '#22c55e';
};

const StripStyle = {
  width: '96px',
  border: '1px solid #ddd',
  'border-radius': '8px',
  padding: '0.65rem',
  display: 'grid',
  gap: '0.55rem',
  'justify-items': 'center',
} as const;

const FaderStyle = {
  width: '28px',
  height: '160px',
  'writing-mode': 'vertical-lr',
  direction: 'rtl',
  'accent-color': '#16a34a',
} as const;

const MeterStyle = {
  width: '14px',
  height: '160px',
  border: '1px solid #cfcfcf',
  'border-radius': '4px',
  background: '#f5f5f5',
  display: 'flex',
  'align-items': 'end',
  overflow: 'hidden',
} as const;

const StripTitleStyle = {
  margin: 0,
  width: '100%',
  overflow: 'hidden',
  'text-overflow': 'ellipsis',
  'white-space': 'nowrap',
  'font-size': '0.82rem',
  'text-align': 'center',
} as const;

const GroupStyle = {
  border: '1px solid #d4d4d4',
  'border-radius': '8px',
  padding: '0.65rem',
  display: 'grid',
  gap: '0.65rem',
} as const;

const GroupTitleStyle = {
  margin: 0,
  'font-size': '0.85rem',
} as const;

const GroupContentStyle = {
  display: 'flex',
  gap: '0.75rem',
  'align-items': 'stretch',
  'flex-wrap': 'wrap',
} as const;

export const MixerPanel: Component = () => {
  const channels = useStore((state) => state.mixer.channels);
  const channelIds = useStore((state) => Object.keys(state.mixer.channels));
  const groups = useStore((state) => state.mixer.groups);
  const masterMuted = useStore((state) => state.mixer.masterMuted);
  const masterPan = useStore((state) => state.mixer.masterPan);
  const masterVolume = useStore((state) => state.mixer.masterVolume);
  const [levels, setLevels] = createStore<Record<string, number>>({});
  let animationFrame = 0;

  onMount(() => {
    const tick = (): void => {
      channelIds().forEach((channelId) => {
        setLevels(channelId, getMixerMeterLevel(channelId));
      });
      groupIds().forEach((groupId) => {
        setLevels(groupId, getMixerMeterLevel(groupId));
      });
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
  });

  onCleanup(() => {
    cancelAnimationFrame(animationFrame);
  });

  const handleMasterVolumeInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    const value = Number(event.currentTarget.value);

    if (Number.isFinite(value)) {
      setMixerMasterVolume(value);
    }
  };

  const handleMasterVolumeChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (event) => {
    const value = Number(event.currentTarget.value);

    if (Number.isFinite(value)) {
      setMixerMasterVolume(value, true);
    }
  };

  const handleMasterPanInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    const value = Number(event.currentTarget.value);

    if (Number.isFinite(value)) {
      setMixerMasterPan(value);
    }
  };

  const handleMasterPanChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (event) => {
    const value = Number(event.currentTarget.value);

    if (Number.isFinite(value)) {
      setMixerMasterPan(value, true);
    }
  };

  const handleMasterMuteInput: JSX.EventHandlerUnion<HTMLInputElement, Event> = (event) => {
    setMixerMasterMuted(event.currentTarget.checked, true);
  };

  const handleMasterVolumeClick: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = (event) => {
    if (event.ctrlKey || event.metaKey) {
      setMixerMasterVolume(1, true);
    }
  };

  const handleMasterPanClick: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = (event) => {
    if (event.ctrlKey || event.metaKey) {
      setMixerMasterPan(0, true);
    }
  };

  const handleMasterStripClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (event) => {
    if (event.ctrlKey || event.metaKey) {
      setMixerMasterVolume(1, true);
      setMixerMasterPan(0, true);
    }
  };

  const handleVolumeInput = (
    channelId: string,
  ): JSX.EventHandlerUnion<HTMLInputElement, InputEvent> => {
    return (event) => {
      const value = Number(event.currentTarget.value);

      if (Number.isFinite(value)) {
        setMixerChannelState(channelId, { volume: clamp(value, 0, 1) });
      }
    };
  };

  const handleVolumeChange = (
    channelId: string,
  ): JSX.EventHandlerUnion<HTMLInputElement, Event> => {
    return (event) => {
      const value = Number(event.currentTarget.value);

      if (Number.isFinite(value)) {
        setMixerChannelState(channelId, { volume: clamp(value, 0, 1) }, true);
      }
    };
  };

  const handleVolumeClick = (
    channelId: string,
  ): JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> => {
    return (event) => {
      if (event.ctrlKey || event.metaKey) {
        setMixerChannelState(channelId, { volume: 1 }, true);
      }
    };
  };

  const handleMuteInput = (channelId: string): JSX.EventHandlerUnion<HTMLInputElement, Event> => {
    return (event) => {
      setMixerChannelState(channelId, { muted: event.currentTarget.checked }, true);
    };
  };

  const handlePanInput = (
    channelId: string,
  ): JSX.EventHandlerUnion<HTMLInputElement, InputEvent> => {
    return (event) => {
      const value = Number(event.currentTarget.value);

      if (Number.isFinite(value)) {
        setMixerChannelState(channelId, { pan: clamp(value, -1, 1) });
      }
    };
  };

  const handlePanChange = (channelId: string): JSX.EventHandlerUnion<HTMLInputElement, Event> => {
    return (event) => {
      const value = Number(event.currentTarget.value);

      if (Number.isFinite(value)) {
        setMixerChannelState(channelId, { pan: clamp(value, -1, 1) }, true);
      }
    };
  };

  const handlePanClick = (
    channelId: string,
  ): JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> => {
    return (event) => {
      if (event.ctrlKey || event.metaKey) {
        setMixerChannelState(channelId, { pan: 0 }, true);
      }
    };
  };

  const handleChannelStripClick = (
    channelId: string,
  ): JSX.EventHandlerUnion<HTMLElement, MouseEvent> => {
    return (event) => {
      if (event.ctrlKey || event.metaKey) {
        setMixerChannelState(channelId, { volume: 1, pan: 0 }, true);
      }
    };
  };

  const handleGroupVolumeInput = (
    groupId: string,
  ): JSX.EventHandlerUnion<HTMLInputElement, InputEvent> => {
    return (event) => {
      const value = Number(event.currentTarget.value);

      if (Number.isFinite(value)) {
        setMixerGroupState(groupId, { volume: clamp(value, 0, 1) });
      }
    };
  };

  const handleGroupVolumeChange = (
    groupId: string,
  ): JSX.EventHandlerUnion<HTMLInputElement, Event> => {
    return (event) => {
      const value = Number(event.currentTarget.value);

      if (Number.isFinite(value)) {
        setMixerGroupState(groupId, { volume: clamp(value, 0, 1) }, true);
      }
    };
  };

  const handleGroupVolumeClick = (
    groupId: string,
  ): JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> => {
    return (event) => {
      if (event.ctrlKey || event.metaKey) {
        setMixerGroupState(groupId, { volume: 1 }, true);
      }
    };
  };

  const handleGroupMuteInput = (groupId: string): JSX.EventHandlerUnion<HTMLInputElement, Event> => {
    return (event) => {
      setMixerGroupState(groupId, { muted: event.currentTarget.checked }, true);
    };
  };

  const handleGroupPanInput = (
    groupId: string,
  ): JSX.EventHandlerUnion<HTMLInputElement, InputEvent> => {
    return (event) => {
      const value = Number(event.currentTarget.value);

      if (Number.isFinite(value)) {
        setMixerGroupState(groupId, { pan: clamp(value, -1, 1) });
      }
    };
  };

  const handleGroupPanChange = (groupId: string): JSX.EventHandlerUnion<HTMLInputElement, Event> => {
    return (event) => {
      const value = Number(event.currentTarget.value);

      if (Number.isFinite(value)) {
        setMixerGroupState(groupId, { pan: clamp(value, -1, 1) }, true);
      }
    };
  };

  const handleGroupPanClick = (
    groupId: string,
  ): JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> => {
    return (event) => {
      if (event.ctrlKey || event.metaKey) {
        setMixerGroupState(groupId, { pan: 0 }, true);
      }
    };
  };

  const handleGroupStripClick = (
    groupId: string,
  ): JSX.EventHandlerUnion<HTMLElement, MouseEvent> => {
    return (event) => {
      if (event.ctrlKey || event.metaKey) {
        setMixerGroupState(groupId, { volume: 1, pan: 0 }, true);
      }
    };
  };

  const mainChannelIds = (): string[] => channelIds().filter((channelId) => !channels()[channelId].groupId);
  const groupIds = (): string[] => Object.keys(groups());
  const getGroupChannelIds = (groupId: string): string[] =>
    channelIds().filter((channelId) => channels()[channelId].groupId === groupId);
  const getRouteLabel = (channelId: string): string => {
    const groupId = channels()[channelId].groupId;

    return `Bus: ${groupId ? groups()[groupId]?.name ?? groupId : 'Master'}`;
  };

  return (
    <section style={{ display: 'grid', gap: '0.85rem' }}>
      <header>
        <h2 style={{ margin: 0 }}>Mixer</h2>
      </header>

      <div style={{ display: 'flex', gap: '0.75rem', 'align-items': 'stretch', 'flex-wrap': 'wrap' }}>
        <section style={GroupStyle}>
          <h3 style={GroupTitleStyle}>Main</h3>
          <div style={GroupContentStyle}>
            <For each={mainChannelIds()}>
              {(channelId) => {
                const channel = () => channels()[channelId];
                const level = (): number => levels[channelId] ?? 0;

                return (
                  <section style={StripStyle} onClick={handleChannelStripClick(channelId)}>
                    <h3 style={StripTitleStyle}>{channel().name}</h3>

                    <div style={{ display: 'flex', gap: '0.5rem', 'align-items': 'end', height: '170px' }}>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={channel().volume}
                        onInput={handleVolumeInput(channelId)}
                        onChange={handleVolumeChange(channelId)}
                        onClick={handleVolumeClick(channelId)}
                        style={FaderStyle}
                      />
                      <div style={MeterStyle}>
                        <div
                          style={{
                            width: '100%',
                            height: `${Math.round(level() * 100)}%`,
                            background: getMeterColor(level()),
                          }}
                        />
                      </div>
                    </div>

                    <span style={{ 'font-size': '0.75rem', color: '#555', 'font-variant-numeric': 'tabular-nums' }}>
                      {formatVolume(channel().volume)}
                    </span>

                    <label style={{ display: 'grid', gap: '0.2rem', width: '100%', 'font-size': '0.7rem' }}>
                      <span style={{ 'text-align': 'center', color: '#555' }}>
                        Pan {formatPan(channel().pan)}
                      </span>
                      <input
                        type="range"
                        min="-1"
                        max="1"
                        step="0.01"
                        value={channel().pan}
                        onInput={handlePanInput(channelId)}
                        onChange={handlePanChange(channelId)}
                        onClick={handlePanClick(channelId)}
                        style={{ width: '72px', 'justify-self': 'center' }}
                      />
                    </label>

                    <label style={{ display: 'flex', gap: '0.35rem', 'align-items': 'center', 'font-size': '0.75rem' }}>
                      <input type="checkbox" checked={channel().muted} onInput={handleMuteInput(channelId)} />
                      <span>Mute</span>
                    </label>

                    <span
                      style={{
                        width: '100%',
                        height: '1.15rem',
                        display: 'block',
                        'text-align': 'center',
                        color: '#525252',
                        'font-size': '0.62rem',
                      }}
                    >
                      {getRouteLabel(channelId)}
                    </span>
                  </section>
                );
              }}
            </For>
          </div>
        </section>

        <For each={groupIds()}>
          {(groupId) => (
            <section style={GroupStyle}>
              <h3 style={GroupTitleStyle}>{groups()[groupId].name}</h3>
              <div style={GroupContentStyle}>
                <For each={getGroupChannelIds(groupId)}>
                  {(channelId) => {
                    const channel = () => channels()[channelId];
                    const level = (): number => levels[channelId] ?? 0;

                    return (
                      <section style={StripStyle} onClick={handleChannelStripClick(channelId)}>
                        <h3 style={StripTitleStyle}>{channel().name}</h3>

                        <div style={{ display: 'flex', gap: '0.5rem', 'align-items': 'end', height: '170px' }}>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={channel().volume}
                            onInput={handleVolumeInput(channelId)}
                            onChange={handleVolumeChange(channelId)}
                            onClick={handleVolumeClick(channelId)}
                            style={FaderStyle}
                          />
                          <div style={MeterStyle}>
                            <div
                              style={{
                                width: '100%',
                                height: `${Math.round(level() * 100)}%`,
                                background: getMeterColor(level()),
                              }}
                            />
                          </div>
                        </div>

                        <span style={{ 'font-size': '0.75rem', color: '#555', 'font-variant-numeric': 'tabular-nums' }}>
                          {formatVolume(channel().volume)}
                        </span>

                        <label style={{ display: 'grid', gap: '0.2rem', width: '100%', 'font-size': '0.7rem' }}>
                          <span style={{ 'text-align': 'center', color: '#555' }}>
                            Pan {formatPan(channel().pan)}
                          </span>
                          <input
                            type="range"
                            min="-1"
                            max="1"
                            step="0.01"
                            value={channel().pan}
                            onInput={handlePanInput(channelId)}
                            onChange={handlePanChange(channelId)}
                            onClick={handlePanClick(channelId)}
                            style={{ width: '72px', 'justify-self': 'center' }}
                          />
                        </label>

                        <label style={{ display: 'flex', gap: '0.35rem', 'align-items': 'center', 'font-size': '0.75rem' }}>
                          <input type="checkbox" checked={channel().muted} onInput={handleMuteInput(channelId)} />
                          <span>Mute</span>
                        </label>

                        <span
                          style={{
                            width: '100%',
                            height: '1.15rem',
                            display: 'block',
                            'text-align': 'center',
                            color: '#525252',
                            'font-size': '0.62rem',
                          }}
                        >
                          {getRouteLabel(channelId)}
                        </span>
                      </section>
                    );
                  }}
                </For>
              </div>
            </section>
          )}
        </For>

        <section style={GroupStyle}>
          <h3 style={GroupTitleStyle}>Output</h3>
          <div style={GroupContentStyle}>
            <For each={groupIds()}>
              {(groupId) => (
                <section style={{ ...StripStyle, border: '1px solid #aaa' }} onClick={handleGroupStripClick(groupId)}>
                  <h3 style={StripTitleStyle}>{groups()[groupId].name}</h3>

                  <div style={{ display: 'flex', gap: '0.5rem', 'align-items': 'end', height: '170px' }}>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={groups()[groupId].volume}
                      onInput={handleGroupVolumeInput(groupId)}
                      onChange={handleGroupVolumeChange(groupId)}
                      onClick={handleGroupVolumeClick(groupId)}
                      style={{ ...FaderStyle, 'accent-color': '#2563eb' }}
                    />
                    <div style={MeterStyle}>
                      <div
                        style={{
                          width: '100%',
                          height: `${Math.round((levels[groupId] ?? 0) * 100)}%`,
                          background: getMeterColor(levels[groupId] ?? 0),
                        }}
                      />
                    </div>
                  </div>

                  <span style={{ 'font-size': '0.75rem', color: '#555', 'font-variant-numeric': 'tabular-nums' }}>
                    {formatVolume(groups()[groupId].volume)}
                  </span>

                  <label style={{ display: 'grid', gap: '0.2rem', width: '100%', 'font-size': '0.7rem' }}>
                    <span style={{ 'text-align': 'center', color: '#555' }}>
                      Pan {formatPan(groups()[groupId].pan)}
                    </span>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.01"
                      value={groups()[groupId].pan}
                      onInput={handleGroupPanInput(groupId)}
                      onChange={handleGroupPanChange(groupId)}
                      onClick={handleGroupPanClick(groupId)}
                      style={{ width: '72px', 'justify-self': 'center' }}
                    />
                  </label>

                  <label style={{ display: 'flex', gap: '0.35rem', 'align-items': 'center', 'font-size': '0.75rem' }}>
                    <input type="checkbox" checked={groups()[groupId].muted} onInput={handleGroupMuteInput(groupId)} />
                    <span>Mute</span>
                  </label>

                  <span
                    style={{
                      width: '100%',
                      height: '1.15rem',
                      display: 'block',
                      'text-align': 'center',
                      color: '#525252',
                      'font-size': '0.62rem',
                    }}
                  >
                    Bus: Master
                  </span>
                </section>
              )}
            </For>

            <section style={StripStyle} onClick={handleMasterStripClick}>
              <h3 style={StripTitleStyle}>Master</h3>

              <div style={{ display: 'flex', gap: '0.5rem', 'align-items': 'end', height: '170px' }}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={masterVolume()}
                  onInput={handleMasterVolumeInput}
                  onChange={handleMasterVolumeChange}
                  onClick={handleMasterVolumeClick}
                  style={{ ...FaderStyle, 'accent-color': '#2563eb' }}
                />
                <div style={MeterStyle} />
              </div>

              <span
                style={{
                  'font-size': '0.75rem',
                  color: '#555',
                  'font-variant-numeric': 'tabular-nums',
                }}
              >
                {formatVolume(masterVolume())}
              </span>

              <label style={{ display: 'grid', gap: '0.2rem', width: '100%', 'font-size': '0.7rem' }}>
                <span style={{ 'text-align': 'center', color: '#555' }}>
                  Pan {formatPan(masterPan())}
                </span>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={masterPan()}
                  onInput={handleMasterPanInput}
                  onChange={handleMasterPanChange}
                  onClick={handleMasterPanClick}
                  style={{ width: '72px', 'justify-self': 'center' }}
                />
              </label>

              <label
                style={{
                  display: 'flex',
                  gap: '0.35rem',
                  'align-items': 'center',
                  'font-size': '0.75rem',
                }}
              >
                <input type="checkbox" checked={masterMuted()} onInput={handleMasterMuteInput} />
                <span>Mute</span>
              </label>

              <span
                style={{
                  width: '100%',
                  height: '1.15rem',
                  display: 'block',
                  'text-align': 'center',
                  color: '#525252',
                  'font-size': '0.62rem',
                }}
              >
                Bus: Output
              </span>
            </section>
          </div>
        </section>
      </div>
    </section>
  );
};
