import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/home/Hero'
import ProductSection from '../components/home/ProductSection'
import ProductCard from '../components/product/ProductCard'
import Reviews from '../components/home/Reviews'
import ProductModal from '../components/product/ProductModal'
import CartDrawer from '../components/cart/CartDrawer'
import Checkout from '../components/cart/Checkout'
import OrderSuccess from '../components/cart/OrderSuccess'
import './SearchBar.css'


export default function Home() {
  const { t, lang, view, setView, openCart, detail, closeDetail } = useApp()
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('') // نص البحث

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false }).then(r => setProducts(r.data || []))
  }, [])

  // تصفية المنتجات حسب البحث
  const query = searchQuery.toLowerCase().trim()
  const filteredProducts = products.filter(p => {
    const nameAr = p.name_ar || ''
    const nameEn = p.name_en || ''
    return nameAr.toLowerCase().includes(query) || nameEn.toLowerCase().includes(query)
  })

  // تصفية الدراجات فقط (التي تحتوي على كلمة دراجة أو bike في الاسم)
  const bikeProducts = products.filter(p => {
    const name = (p.name_ar || '') + ' ' + (p.name_en || '')
    return name.toLowerCase().includes('دراجة') || name.toLowerCase().includes('bike')
  })

  const close = () => setView('')

  return (
    <>
      <Navbar openCart={openCart} />
      <main>
        <Hero />

        {/* خانة البحث الاحترافية مع دعم تغيير اللغة تلقائياً */}
        <div className="search-container">
          <div className="search-box-wrapper">
            <div className="search-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input 
              type="text"
              className="search-input"
              placeholder={lang === 'en' ? "Search for any part or bike (e.g., chain, derailleur...)" : "ابحث عن أي قطعة أو دراجة (مثال: سلسلة، ديرايور...)"}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="search-actions">
                <button 
                  className="clear-search-btn" 
                  onClick={() => setSearchQuery('')}
                  title={lang === 'en' ? "Clear search" : "مسح البحث"}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* عرض نتائج البحث أو الأقسام الطبيعية */}
        {searchQuery.trim() !== '' ? (
          <section className="section">
            <div className="section-header">
              <h2>{lang === 'en' ? `Search results for: "${searchQuery}"` : `نتائج البحث عن: "${searchQuery}"`}</h2>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="grid">
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            ) : (
              <p className="muted">{lang === 'en' ? "Sorry, no products matched your search." : "عذراً، لم يتم العثور على أي منتج يطابق بحثك."}</p>
            )}
          </section>
        ) : (
          <>
            {/* قسم الدراجات الخاص */}
            <ProductSection 
              id="bikes" 
              title={lang === 'en' ? 'Bikes' : 'الدراجات'} 
              items={bikeProducts} 
            />

            {products.some(p => p.is_discounted) && (
              <ProductSection id="sale" title={t.sale} items={products.filter(p => p.is_discounted)} />
            )}
            
            <ProductSection id="new" title={t.new} items={products.filter(p => p.is_new)} />
            
            <ProductSection id="all" title={t.allProducts || (lang === 'en' ? 'All Products' : 'جميع المنتجات')} items={products} />
          </>
        )}

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