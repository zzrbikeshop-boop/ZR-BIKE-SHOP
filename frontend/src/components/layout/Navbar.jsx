import { useApp } from '../../context/AppContext'
import './Navbar.css'
import Icon from '../ui/Icon'

export default function Navbar({ openCart }) {
  const { t, lang, setLang, cart } = useApp()
  const count = cart.reduce((s, i) => s + i.qty, 0)
  return (
    <header className="nav">
      <a href="#top" className="brand"><img className="logo" src="/logo.jpg" alt="" /><span className="brand-t">ZR Bike</span></a>
      <nav>
        <a href="#top">{t.home}</a>
        <a href="#new">{t.new}</a>
        <a href="#sale">{t.sale}</a>
      </nav>
      <div className="nav-actions">
        <button className="ghost" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>{t.lang}</button>
        <button className="cart-btn" onClick={openCart} aria-label={t.cart}><Icon name="cart" size={20} /><b>{count}</b></button>
      </div>
    </header>
  )
}
