import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import './Navbar.css'
import Icon from '../ui/Icon'

export default function Navbar({ openCart }) {
  const { lang, setLang, cart, t } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const count = cart.reduce((s, i) => s + i.qty, 0)

  const closeMenu = () => setMenuOpen(false)

  // نصوص مخصصة تضمن ظهور الروابط بالعربية والإنجليزية بدقة
  const navText = {
    ar: { home: 'الرئيسية', bikes: 'الدراجات', new: 'الجديد', sale: 'التخفيضات' },
    en: { home: 'Home', bikes: 'Bikes', new: 'New', sale: 'Sale' }
  }

  const currentTexts = navText[lang] || navText.ar

  return (
    <header className="nav">
      <a href="#top" className="brand" onClick={closeMenu}>
        <img className="logo" src="/logo.jpg" alt="" />
        <span className="brand-t">ZR Bike</span>
      </a>

      {/* روابط التنقل */}
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <a href="#top" onClick={closeMenu}>{currentTexts.home}</a>
        <a href="#bikes" onClick={closeMenu}>{currentTexts.bikes}</a>
        <a href="#new" onClick={closeMenu}>{currentTexts.new}</a>
        <a href="#sale" onClick={closeMenu}>{currentTexts.sale}</a>
      </nav>

      <div className="nav-actions">
        <button className="ghost" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>{t.lang}</button>
        <button className="cart-btn" onClick={openCart} aria-label={t.cart}>
          <Icon name="cart" size={20} />
          <b>{count}</b>
        </button>

        {/* زر القائمة الجانبية للجوال */}
        <button 
          className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}