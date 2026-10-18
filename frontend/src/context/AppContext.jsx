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
  const [warning, setWarning] = useState('')  // 👈 حالة رسالة التحذير الصفراء

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = LAYOUT_DIR
    localStorage.setItem('lang', lang)
  }, [lang])
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart])

  const add = p => setCart(c => {
    const existing = c.find(i => i.id === p.id)
    const price = Number(p.price) || 0
    if (existing) {
      if (existing.qty >= 10) {
        setWarning('عذراً، الحد الأقصى المسموح به هو 10 قطع لكل منتج')
        setTimeout(() => setWarning(''), 3000) // إخفاء التحذير بعد 3 ثوانٍ
        return c
      }
      return c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
    }
    return [...c, { ...p, price, qty: 1 }]
  })

  const setQty = (id, q) => {
    const newQty = Number(q)
    if (newQty > 10) {
      setWarning('عذراً، الحد الأقصى المسموح به هو 10 قطع لكل منتج')
      setTimeout(() => setWarning(''), 3000)
      return
    }
    setCart(c => c.map(i => i.id === id ? { ...i, qty: newQty } : i).filter(i => i.qty > 0))
  }
  
  const total = cart.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0)

  const value = {
    t: dict[lang], lang, setLang,
    cart, add, setQty, total, clear: () => setCart([]),
    view, setView, openCart: () => setView('cart'),
    detail, openDetail: p => setDetail(p), closeDetail: () => setDetail(null),
    buyNow: p => { add(p); setDetail(null); setView('checkout') },
    warning, // 👈 تمرير التحذير للتطبيق
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}