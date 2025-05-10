import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={enUS}>
    <StrictMode>
      <App />
    </StrictMode>
  </ConfigProvider>,
)
