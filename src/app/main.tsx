import { render } from 'solid-js/web';

import { initializeTransport } from '../audio/transport';
import { emit } from '../events';
import { Root } from '../ui/Root';

const mount = (): void => {
  initializeTransport();

  const announceResume = (): void => {
    emit('audio/resume', undefined);
  };

  const oncePointerDown = (): void => {
    announceResume();
    window.removeEventListener('pointerdown', oncePointerDown);
    window.removeEventListener('keydown', onceKeyDown);
  };

  const onceKeyDown = (): void => {
    announceResume();
    window.removeEventListener('keydown', onceKeyDown);
    window.removeEventListener('pointerdown', oncePointerDown);
  };

  window.addEventListener('pointerdown', oncePointerDown, { once: true });
  window.addEventListener('keydown', onceKeyDown, { once: true });

  const root = document.getElementById('root');

  if (!root) {
    throw new Error('Root element not found');
  }

  render(() => <Root />, root);
};

mount();
