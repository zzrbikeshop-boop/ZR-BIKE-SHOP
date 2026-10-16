import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/home/Hero'
import ProductSection from '../components/home/ProductSection'
import Reviews from '../components/home/Reviews'
import ProductModal from '../components/product/ProductModal'
import CartDrawer from '../components/cart/CartDrawer'
import Checkout from '../components/cart/Checkout'
import OrderSuccess from '../components/cart/OrderSuccess'

export default function Home() {
  const { t, view, setView, openCart, detail, closeDetail } = useApp()
  const [products, setProducts] = useState([])

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false }).then(r => setProducts(r.data || []))
  }, [])

  const close = () => setView('')
  return (
    <>
      <Navbar openCart={openCart} />
      <main>
        <Hero />
        <ProductSection id="new" title={t.new} items={products.filter(p => p.is_new)} />
        <ProductSection id="sale" title={t.sale} items={products.filter(p => p.old_price && p.old_price > p.price)} />
        <Reviews />
      </main>
      <Footer />
      {detail && <ProductModal p={detail} onClose={closeDetail} />}
      {view === 'cart' && <CartDrawer onClose={close} />}
      {view === 'checkout' && <Checkout onClose={close} />}
      {view === 'done' && <OrderSuccess onClose={close} />}
    </>
  )
}
