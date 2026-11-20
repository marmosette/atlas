import '@fontsource/prata/400.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'
import './styles/global.css'

import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ErrorBoundary } from './components/ErrorBoundary'
import { GenerationOverlay } from './components/generation/GenerationOverlay'
import { AppShell, ScrollManager } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { TripPage } from './pages/TripPage'
import { TripsPage } from './pages/TripsPage'
import { store } from './store'
import { theme } from './theme'

const getBasename = (): string => {
  if (typeof window === 'undefined') return '/'
  const brojs = (window as unknown as { __BROJS_CONFIG__?: { navigations?: Record<string, string> } }).__BROJS_CONFIG__
  const navigation = brojs?.navigations?.['atlas.main']
  if (navigation) return navigation.replace(/\/$/, '')
  if (window.location.pathname.startsWith('/atlas-travel')) return '/atlas-travel'
  return '/'
}

const App = () => (
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <BrowserRouter basename={getBasename()}>
        <ErrorBoundary>
          <ScrollManager />
          <AppShell>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/trip/:id" element={<TripPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppShell>
          <GenerationOverlay />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </ChakraProvider>
)

export default App
