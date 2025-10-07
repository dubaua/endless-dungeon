interface EventMap {
  'transport/play': void;
  'transport/pause': void;
  'transport/toggle': void;
  'scene/change': string;
}

type EventKey = keyof EventMap;

type EventHandler<K extends EventKey> = (payload: EventMap[K]) => void;

const eventTarget = new EventTarget();

export const emit = <K extends EventKey>(type: K, payload: EventMap[K]): void => {
  const event = new CustomEvent<EventMap[K]>(type, { detail: payload });
  eventTarget.dispatchEvent(event);
};

export const on = <K extends EventKey>(type: K, handler: EventHandler<K>): (() => void) => {
  const listener = (event: Event): void => {
    handler((event as CustomEvent<EventMap[K]>).detail);
  };

  eventTarget.addEventListener(type, listener as EventListener);

  return () => {
    eventTarget.removeEventListener(type, listener as EventListener);
  };
};
