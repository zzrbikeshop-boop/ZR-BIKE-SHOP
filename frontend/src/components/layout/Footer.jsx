import { useApp } from '../../context/AppContext'
import { INSTAGRAM, FACEBOOK, PHONE } from '../../config'
import './Footer.css'
import Icon from '../ui/Icon'

export default function Footer() {
  const { t } = useApp()
  return (
    <footer className="footer">
      <div className="foot-grid">
        <div className="foot-info">
          <div className="foot-brand">
            <img className="logo" src="/logo.jpg" alt="ZR Bike Shop" />
            <strong>ZR Bike Shop</strong>
          </div>
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
          <a href={`tel:${PHONE}`} dir="ltr" className="contact-link">
            <Icon name="phone" size={16} /> <span>{PHONE}</span>
          </a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="contact-link">
            <Icon name="instagram" size={16} /> <span>@zr_bike_shop__</span>
          </a>
          
        </div>
      </div>

      <div className="foot-bottom">
        <span>© 2026 ZR Bike Shop. {t.rights}</span>
        <button className="ghost" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top">
          <Icon name="arrowUp" size={16} /> {t.top}
        </button>
      </div>
    </footer>
  )
}