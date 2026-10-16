import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LAYOUT_DIR } from '../../config'
import './ProductCard.css'
import Icon from '../ui/Icon'

export default function ProductCard({ p }) {
  const { t, lang, add, buyNow, openDetail } = useApp()
  const imgs = p.images?.length ? p.images : p.image_url ? [p.image_url] : []
  const [i, setI] = useState(0)
  const name = (lang === 'en' && p.name_en) || p.name_ar
  const onSale = p.old_price && p.old_price > p.price
  const soldOut = p.in_stock === false
  const [L, R] = LAYOUT_DIR === 'rtl' ? ['chevR', 'chevL'] : ['chevL', 'chevR']
  const go = d => setI((i + d + imgs.length) % imgs.length)
  return (
    <article className="card" onClick={() => openDetail(p)}>
      <div className="img">
        {imgs.length ? <img src={imgs[i]} alt={name} loading="lazy" /> : <span className="ph"><Icon name="bike" size={56} /></span>}
        {onSale && (
          <em>
            <Icon name="tag" size={14} />
            -{Math.round((1 - p.price / p.old_price) * 100)}%
          </em>
        )}
        {imgs.length > 1 && (
          <>
            <button className="arrow prev" onClick={e => { e.stopPropagation(); go(-1) }} aria-label="previous"><Icon name={L} size={18} /></button>
            <button className="arrow next" onClick={e => { e.stopPropagation(); go(1) }} aria-label="next"><Icon name={R} size={18} /></button>
          </>
        )}
      </div>
      <div className="card-body">
        <h3>{name}</h3>
        <span className={soldOut ? 'stock out' : 'stock'}>{soldOut ? t.soldOut : t.inStock}</span>
        <div className="card-foot">
          <div className="price">
            <strong>{Number(p.price).toLocaleString()} <small>{t.dz}</small></strong>
            {onSale && <s>{Number(p.old_price).toLocaleString()} {t.dz}</s>}
          </div>
          <div className="card-btns">
            <button className="cbtn dark" disabled={soldOut} onClick={e => { e.stopPropagation(); add(p) }}><Icon name="bag" size={16} /> {t.add}</button>
            <button className="cbtn" disabled={soldOut} onClick={e => { e.stopPropagation(); buyNow(p) }}><Icon name="zap" size={16} /> {t.buy}</button>
          </div>
        </div>
      </div>
    </article>
  )
}
