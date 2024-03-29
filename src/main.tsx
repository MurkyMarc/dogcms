import React from 'react'
import './index.css'
import { App } from './App.tsx'
import ReactDOM from 'react-dom/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthStateListener } from './hooks/useAuth.ts'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthStateListener />
        <App />
        <ReactQueryDevtools initialIsOpen={true} />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
