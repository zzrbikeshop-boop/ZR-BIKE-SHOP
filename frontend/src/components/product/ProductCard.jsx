import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { LAYOUT_DIR } from '../../config'
import './ProductCard.css'
import Icon from '../ui/Icon'

export default function ProductCard({ p }) {
  const { t, lang, add, buyNow, openDetail } = useApp()
  // دعم كل من p.image_urls و p.images وصورة مفردة p.image_url
  const imgs = p.image_urls?.length ? p.image_urls : p.images?.length ? p.images : p.image_url ? [p.image_url] : []
  const [i, setI] = useState(0)
  const name = (lang === 'en' && p.name_en) || p.name_ar
  
  // المنتج يعتبر في التخفيضات إذا تم تفعيل زر التخفيض أو وُجد سعر قديم
  const onSale = p.is_discounted || (p.old_price && p.old_price > p.price)
  
  // إذا كان المنتج في التخفيضات ولم يتم إدخال old_price يدوياً، نقوم بحساب سعر قديم افتراضي (أعلى بنسبة 25% مثلاً)
  const displayOldPrice = (p.old_price && Number(p.old_price) > Number(p.price)) 
    ? Number(p.old_price) 
    : (p.is_discounted ? Math.round(Number(p.price) * 1.25) : null)

  const soldOut = p.in_stock === false
  const [L, R] = LAYOUT_DIR === 'rtl' ? ['chevR', 'chevL'] : ['chevL', 'chevR']
  const go = d => setI((i + d + imgs.length) % imgs.length)

  // خاصية التبديل التلقائي بين الصور كل 3 ثوانٍ إذا توفرت أكثر من صورة
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
            {soldOut ? t.soldOut : t.inStock}
          </span>
        </div>

        <div className="card-foot">
          <div className="price-box">
            <strong className="current-price">{Number(p.price).toLocaleString()} <small>{t.dz}</small></strong>
            
            {/* عرض السعر القديم مشطوباً (إما المدخل يدوياً أو المحسوب تلقائياً عند التخفيض) */}
            {onSale && displayOldPrice && (
              <s className="old-price">{displayOldPrice.toLocaleString()} {t.dz}</s>
            )}
          </div>

          <div className="card-btns">
            <button className="cbtn dark" disabled={soldOut} onClick={e => { e.stopPropagation(); add(p) }} aria-label={t.add}>
              <Icon name="bag" size={16} />
            </button>
            <button className="cbtn primary" disabled={soldOut} onClick={e => { e.stopPropagation(); buyNow(p) }}>
              <Icon name="zap" size={15} /> {t.buy}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}