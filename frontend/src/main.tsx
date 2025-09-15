import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { SSRProvider } from '@react-aria/ssr';

import App from './App';
import environment from './RelayEnvironment';
import './index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RelayEnvironmentProvider environment={environment}>
      <SSRProvider>
        <Provider theme={defaultTheme} colorScheme="light">
          <App />
        </Provider>
      </SSRProvider>
    </RelayEnvironmentProvider>
  </StrictMode>,
);
