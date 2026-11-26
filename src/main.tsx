import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { useUiStore } from './store/uiStore'
import './styles.css'

// A direct link opens the same Compact layout as the C shortcut.
useUiStore
  .getState()
  .setCompact(new URLSearchParams(window.location.search).has('compact'))

const root = document.getElementById('root')
if (!root) throw new Error('Missing app root')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
