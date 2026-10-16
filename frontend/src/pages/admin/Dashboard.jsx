import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useApp } from '../../context/AppContext'
import Login from './Login'
import OrdersTab from './OrdersTab'
import ProductsTab from './ProductsTab'
import './Dashboard.css'

export default function Dashboard() {
  const { t, lang, setLang } = useApp()
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true) })
    const { data } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const load = async () => {
    const o = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    const p = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setOrders(o.data || []); setProducts(p.data || [])
  }
  useEffect(() => { if (session) load() }, [session])

  if (!ready) return null
  if (!session) return <div className="admin"><Login /></div>
  const newCount = orders.filter(o => o.status === 'new').length

  return (
    <div className="admin">
      <header className="admin-head">
        <a href="#/" className="brand"><img className="logo" src="/logo.jpg" alt="" />ZR<span>Bike</span></a>
        <div className="nav-actions">
          <button className="ghost" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>{t.lang}</button>
          <button className="ghost" onClick={() => supabase.auth.signOut()}>{t.logout}</button>
        </div>
      </header>
      <div className="tabs">
        <button className={tab === 'orders' ? 'on' : ''} onClick={() => setTab('orders')}>{t.orders} ({newCount})</button>
        <button className={tab === 'products' ? 'on' : ''} onClick={() => setTab('products')}>{t.products}</button>
      </div>
      {tab === 'orders' && <OrdersTab orders={orders} onChange={load} />}
      {tab === 'products' && <ProductsTab products={products} onChange={load} />}
    </div>
  )
}
