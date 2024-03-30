import './index.css'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { StrictMode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { AuthStateListener } from './hooks/useAuth.ts'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity
    },
  },
})

persistQueryClient({
  queryClient,
  persister: createSyncStoragePersister({ storage: window.localStorage, key: "Uptown_Dogs" }),
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      const pathsToInclude = ["mydogs", "myprofile", "session"];
      const queryIsReadyForPersistance = query.state.status === 'success';
      if (queryIsReadyForPersistance) {
        const { queryKey } = query;
        const includeInCache = pathsToInclude.some(path => queryKey.includes(path));
        return includeInCache;
      }
      return queryIsReadyForPersistance;
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthStateListener />
        <App />
        <ReactQueryDevtools initialIsOpen={true} />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
