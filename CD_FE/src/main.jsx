import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { InterviewProvider } from './contexts/InterviewContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InterviewProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </InterviewProvider>
  </StrictMode>,
)
