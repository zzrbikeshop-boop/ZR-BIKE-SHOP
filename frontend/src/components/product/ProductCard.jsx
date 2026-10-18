import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { LAYOUT_DIR } from '../../config'
import './ProductCard.css'
import Icon from '../ui/Icon'

export default function ProductCard({ p }) {
  const { t, lang, add, buyNow, openDetail } = useApp()
  const imgs = p.image_urls?.length ? p.image_urls : p.images?.length ? p.images : p.image_url ? [p.image_url] : []
  const [i, setI] = useState(0)
  const name = (lang === 'en' && p.name_en) || p.name_ar
  
  const hasOldPrice = p.old_price && Number(p.old_price) > Number(p.price)
  const onSale = p.is_discounted || hasOldPrice
  
  const displayOldPrice = hasOldPrice 
    ? Number(p.old_price) 
    : (p.is_discounted ? Math.round(Number(p.price) * 1.25) : null)

  const soldOut = p.in_stock === false
  const [L, R] = LAYOUT_DIR === 'rtl' ? ['chevR', 'chevL'] : ['chevL', 'chevR']
  const go = d => setI((i + d + imgs.length) % imgs.length)

  useEffect(() => {
    if (imgs.length <= 1) return
    const timer = setInterval(() => {
      setI(prev => (prev + 1) % imgs.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [imgs.length])

  return (
    <article className="card" onClick={() => openDetail(p)}>
      <div className="card-img-wrapper">
        {imgs.length ? (
          <img src={imgs[i]} alt={name} loading="lazy" />
        ) : (
          <span className="ph"><Icon name="bike" size={52} /></span>
        )}
        
        {onSale && (
          <em className="sale-badge">
            <Icon name="tag" size={13} />
            {displayOldPrice ? `-${Math.round((1 - p.price / displayOldPrice) * 100)}%` : 'تخفيض'}
          </em>
        )}

        {imgs.length > 1 && (
          <>
            <button className="card-arrow prev" onClick={e => { e.stopPropagation(); go(-1) }} aria-label="previous">
              <Icon name={L} size={16} />
            </button>
            <button className="card-arrow next" onClick={e => { e.stopPropagation(); go(1) }} aria-label="next">
              <Icon name={R} size={16} />
            </button>
          </>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        
        <div className="card-meta">
          <span className={soldOut ? 'stock out' : 'stock in'}>
            {soldOut ? (t?.soldOut || 'نفذت الكمية') : (t?.inStock || 'متوفر في المخزون')}
          </span>
        </div>

        <div className="card-foot">
          <div className="price-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {displayOldPrice && (
              <s className="old-price" style={{ color: '#a1a1aa', fontSize: '0.85rem', textDecoration: 'line-through', marginBottom: '2px', display: 'block' }}>
                {displayOldPrice.toLocaleString()} {t?.dz || 'د.ج'}
              </s>
            )}
            <strong className="current-price" style={{ color: '#ffffff', fontSize: '1.2rem', display: 'block', lineHeight: '1' }}>
              {Number(p.price).toLocaleString()} <small style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{t?.dz || 'د.ج'}</small>
            </strong>
          </div>

          <div className="card-btns">
            <button className="cbtn dark" disabled={soldOut} onClick={e => { e.stopPropagation(); add(p) }} aria-label={t?.add || 'إضافة'}>
              <Icon name="bag" size={16} />
            </button>
            <button className="cbtn primary" disabled={soldOut} onClick={e => { e.stopPropagation(); buyNow(p) }}>
              <Icon name="zap" size={15} /> {t?.buy || 'شراء'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}