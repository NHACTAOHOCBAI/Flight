import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US';
import { RouterProvider } from 'react-router'
import router from './routes/router.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TicketsProvider } from './context/TicketsContext.tsx';
import { store } from './redux/app/store.ts';
import { Provider } from 'react-redux';



const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={enUS}>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <StrictMode>
          <TicketsProvider>
            <RouterProvider router={router} />
          </TicketsProvider>
        </StrictMode>
      </QueryClientProvider>
    </Provider>
  </ConfigProvider>,
)
