import { useEffect, useState } from 'react'
import { AppProvider } from './context/AppContext'
import Home from './pages/Home'
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import Dashboard from './pages/admin/Dashboard'
import StairsPreloader from './components/StairsPreloader/StairsPreloader' // 👈 استيراد شاشة الترحيب

export default function App() {
  const [route, setRoute] = useState(location.hash)

  useEffect(() => {
    const h = () => setRoute(location.hash)
    addEventListener('hashchange', h); return () => removeEventListener('hashchange', h)
  }, [])

  return (
    <AppProvider>
      {/* 🌟 شاشة الترحيب التفاعلية تظهر عند فتح المتجر */}
      <StairsPreloader />
      
      {route === '#/admin' ? <Dashboard /> : <Home />}
      
      {/* 🟢 زر الواتساب العائم */}
      <WhatsAppButton />
      
    </AppProvider>
  )
}