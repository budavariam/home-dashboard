import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import './i18n';
import './index.css';
import { ParamProvider } from "./components/context/ParamContext";
import { router } from './router';
import { MockDataProvider } from './components/context/MockDataContext';

const queryClient = new QueryClient();

// Loading component to prevent layout shift and translation key flash
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <QueryClientProvider client={queryClient}>
        <ParamProvider>
          <MockDataProvider>
            <RouterProvider router={router} />
          </MockDataProvider>
        </ParamProvider>
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>
);
