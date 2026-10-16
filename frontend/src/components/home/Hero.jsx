import { useApp } from '../../context/AppContext'
import './Hero.css'
import Icon from '../ui/Icon'

export default function Hero() {
  const { t } = useApp()
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <span className="hero-badge"><Icon name="bike" size={16} /> {t.badge}</span>
        <h1>{t.heroT}</h1>
        <p>{t.heroS}</p>
        <div className="hero-cta">
          <a className="btn" href="#new">{t.shop}</a>
          <a className="btn outline" href="#sale">{t.sale}</a>
        </div>
      </div>
      <ul className="hero-feats">
        <li><Icon name="truck" size={18} /> {t.f1}</li><li><Icon name="cash" size={18} /> {t.f2}</li><li><Icon name="wrench" size={18} /> {t.f3}</li>
      </ul>
    </section>
  )
}
