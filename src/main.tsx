import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US';
import { RouterProvider } from 'react-router'
import router from './routes/router.tsx'

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={enUS}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </ConfigProvider>,
)
