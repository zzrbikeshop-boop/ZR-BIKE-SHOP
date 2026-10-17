import { useEffect, useState } from 'react'
import { AppProvider } from './context/AppContext'
import Home from './pages/Home'
import Dashboard from './pages/admin/Dashboard'

export default function App() {
  const [route, setRoute] = useState(location.hash)
  useEffect(() => {
    const h = () => setRoute(location.hash)
    addEventListener('hashchange', h); return () => removeEventListener('hashchange', h)
  }, [])
  return <AppProvider>{route === '#/admin' ? <Dashboard /> : <Home />}</AppProvider>
}