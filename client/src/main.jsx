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
function Root() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <>
      {!splashDone && <CoinSplash onDone={() => setSplashDone(true)} />}

      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
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