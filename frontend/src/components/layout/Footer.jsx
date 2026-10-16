import { useApp } from '../../context/AppContext'
import { INSTAGRAM, FACEBOOK, PHONE } from '../../config'
import './Footer.css'
import Icon from '../ui/Icon'

export default function Footer() {
  const { t } = useApp()
  return (
    <footer className="footer">
      <div className="foot-grid">
        <div>
          <div className="foot-brand"><img className="logo" src="/logo.jpg" alt="" /><strong>ZR Bike Shop</strong></div>
          <p className="foot-desc">{t.footDesc}</p>
        </div>
        <div className="foot-col">
          <h4>{t.quick}</h4>
          <a href="#new">{t.new}</a>
          <a href="#sale">{t.sale}</a>
          <a href="#reviews">{t.reviews}</a>
        </div>
        <div className="foot-col">
          <h4>{t.contact}</h4>
          <a href={`tel:${PHONE}`} dir="ltr"><Icon name="phone" size={18} /> {PHONE}</a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer"><Icon name="instagram" size={18} /> @zr_bike_shop__</a>
          <a href={FACEBOOK} target="_blank" rel="noreferrer"><Icon name="facebook" size={18} /> Facebook</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 ZR Bike Shop. {t.rights}</span>
        <button className="ghost" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}><Icon name="arrowUp" size={16} /> {t.top}</button>
      </div>
    </footer>
  )
}
