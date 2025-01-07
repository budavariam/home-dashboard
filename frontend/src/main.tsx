import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { ParamProvider } from "./components/context/ParamContext"
import { router } from './router';
import { MockDataProvider } from './components/context/MockDataContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ParamProvider>
        <MockDataProvider>
          <RouterProvider router={router} />
        </MockDataProvider>
      </ParamProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
