import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LastPageProvider } from '../frontend/components/LastPageContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LastPageProvider>
    <App />
    </LastPageProvider>
  </StrictMode>,
)
