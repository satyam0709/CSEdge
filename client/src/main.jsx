import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { useState } from 'react'
import CoinSplash from './components/CoinSplash.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

/** True only for browser hard refresh (F5 / reload button), not first visit or SPA. */
function isHardReload() {
  if (typeof window === 'undefined') return false
  try {
    const nav = performance.getEntriesByType('navigation')[0]
    if (nav && 'type' in nav && nav.type === 'reload') return true
  } catch {
    /* ignore */
  }
  try {
    // Legacy; still used in some environments
    if (performance.navigation?.type === 1) return true
  } catch {
    /* ignore */
  }
  return false
}

function isHomePath() {
  if (typeof window === 'undefined') return false
  const p = window.location.pathname || '/'
  return p === '/' || p === ''
}

/**
 * Coin toss splash ONLY when: user hard-refreshes while on the home page (/).
 * Not on first open, not on other routes, not on in-app navigation (Router).
 */
function shouldPlayCoinSplash() {
  return isHardReload() && isHomePath()
}

function Root() {
  const [splashDone, setSplashDone] = useState(() => !shouldPlayCoinSplash())

  return (
    <>
      {!splashDone && <CoinSplash onDone={() => setSplashDone(true)} />}

      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        signInUrl="/login"
        signUpUrl="/sign-up"
      >
        <BrowserRouter>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </BrowserRouter>
      </ClerkProvider>
    </>
  )
}
createRoot(document.getElementById('root')).render(<Root />)