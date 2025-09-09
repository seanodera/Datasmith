import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0e0211",
          colorInfo: "#ff3300",
          colorLink: "#ff3300",
          colorError: "#ff0000",
          borderRadius: 8,
          wireframe: false,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)
