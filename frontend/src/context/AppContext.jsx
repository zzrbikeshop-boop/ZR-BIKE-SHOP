import { createContext, useContext, useEffect, useState } from 'react'
import { dict } from '../lib/i18n'
import { LAYOUT_DIR } from '../config'

const Ctx = createContext()
export const useApp = () => useContext(Ctx)

export function AppProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'ar')
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'))
  const [view, setView] = useState('')        // '' | 'cart' | 'checkout' | 'done'
  const [detail, setDetail] = useState(null)  // product shown in the details modal

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = LAYOUT_DIR
    localStorage.setItem('lang', lang)
  }, [lang])
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart])

  const add = p => setCart(c => c.find(i => i.id === p.id) ? c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...p, qty: 1 }])
  const setQty = (id, q) => setCart(c => c.map(i => i.id === id ? { ...i, qty: q } : i).filter(i => i.qty > 0))
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const value = {
    t: dict[lang], lang, setLang,
    cart, add, setQty, total, clear: () => setCart([]),
    view, setView, openCart: () => setView('cart'),
    detail, openDetail: p => setDetail(p), closeDetail: () => setDetail(null),
    buyNow: p => { add(p); setDetail(null); setView('checkout') },
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
