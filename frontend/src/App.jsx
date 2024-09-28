import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import router from './routes/router.jsx';

// Create a QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <div>
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
  
  </div>
);

export default App;