import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UnifiedProvider } from './context/Context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UnifiedProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UnifiedProvider>
  </StrictMode>,
)
