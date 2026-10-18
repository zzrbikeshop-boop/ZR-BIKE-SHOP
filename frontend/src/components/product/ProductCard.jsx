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
        {/* التنظيم الجديد 1: السعر والمخزون في الصف العلوي */}
        <div className="card-top-row">
          <div className="price-group">
            <strong className="current-price">
              {Number(p.price).toLocaleString()} <small>{t?.dz || 'د.ج'}</small>
            </strong>
            {displayOldPrice && (
              <s className="old-price">
                {displayOldPrice.toLocaleString()} {t?.dz || 'د.ج'}
              </s>
            )}
          </div>
          
          <div className={`stock-indicator ${soldOut ? 'out' : 'in'}`} title={soldOut ? (t?.soldOut || 'نفذت الكمية') : (t?.inStock || 'متوفر')}>
            <span className="dot"></span>
            <span className="stock-txt">{soldOut ? (t?.soldOut || 'نفذ') : (t?.inStock || 'متوفر')}</span>
          </div>
        </div>

        {/* التنظيم الجديد 2: العنوان في المنتصف للتركيز عليه */}
        <h3 className="card-title">{name}</h3>

        {/* التنظيم الجديد 3: الأزرار في الأسفل بتوزيع ذكي */}
        <div className="card-actions">
          <button className="cbtn dark" disabled={soldOut} onClick={e => { e.stopPropagation(); add(p) }} aria-label={t?.add || 'إضافة للسلة'}>
            <Icon name="bag" size={18} />
          </button>
          <button className="cbtn primary" disabled={soldOut} onClick={e => { e.stopPropagation(); buyNow(p) }}>
            <Icon name="zap" size={16} /> {t?.buy || 'شراء الآن'}
          </button>
        </div>
      </div>
    </article>
  )
}