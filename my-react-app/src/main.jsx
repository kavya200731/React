import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Classic from './Classic.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Classic></Classic>

    
  </StrictMode>,
)
