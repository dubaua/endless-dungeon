import { render } from 'solid-js/web';

import { initializeTransport } from '../audio/transport';
import { Root } from '../ui/Root';

const mount = (): void => {
  initializeTransport();

  const root = document.getElementById('root');

  if (!root) {
    throw new Error('Root element not found');
  }

  render(() => <Root />, root);
};

mount();
