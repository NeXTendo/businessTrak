import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AppRouter } from './router';
import { queryClient } from './lib/query-client';
import './styles/globals.css';

import { useAuthStore } from './stores/auth-store';

export const App: React.FC = () => {
  const initialize = useAuthStore(state => state.initialize);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
        <Toaster richColors position='top-right' />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;