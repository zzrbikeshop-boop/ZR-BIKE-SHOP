import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LAYOUT_DIR } from '../../config'
import Modal from '../layout/Modal'
import './ProductModal.css'
import Icon from '../ui/Icon'

export default function ProductModal({ p, onClose }) {
  const { t, lang, add, buyNow } = useApp()
  const imgs = p.images?.length ? p.images : p.image_url ? [p.image_url] : []
  const [i, setI] = useState(0)
  const name = (lang === 'en' && p.name_en) || p.name_ar
  const onSale = p.old_price && p.old_price > p.price
  const soldOut = p.in_stock === false
  const [L, R] = LAYOUT_DIR === 'rtl' ? ['chevR', 'chevL'] : ['chevL', 'chevR']
  const go = d => setI((i + d + imgs.length) % imgs.length)
  return (
    <Modal onClose={onClose} wide>
      <div className="detail">
        <div className="gal">
          <div className="gal-main">
            {imgs.length ? <img src={imgs[i]} alt={name} /> : <span className="ph"><Icon name="bike" size={56} /></span>}
            {imgs.length > 1 && <>
              <button className="arrow prev" onClick={() => go(-1)} aria-label="previous"><Icon name={L} size={18} /></button>
              <button className="arrow next" onClick={() => go(1)} aria-label="next"><Icon name={R} size={18} /></button>
            </>}
          </div>
          {imgs.length > 1 && <div className="thumbs">{imgs.map((u, k) => (
            <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)}><img src={u} alt="" /></button>
          ))}</div>}
        </div>
        <div className="info">
          <h2>{name}</h2>
          <span className={soldOut ? 'stock out' : 'stock'}>● {soldOut ? t.soldOut : t.inStock}</span>
          <div className="price big">
            <strong>{Number(p.price).toLocaleString()} <small>{t.dz}</small></strong>
            {onSale && <s>{Number(p.old_price).toLocaleString()} {t.dz}</s>}
          </div>
          <div className="desc"><h4>{t.descTitle}</h4><p>{p.description || t.noDesc}</p></div>
          <div className="detail-btns">
            <button className="btn dark" disabled={soldOut} onClick={() => { add(p); onClose() }}><Icon name="bag" size={16} /> {t.add}</button>
            <button className="btn" disabled={soldOut} onClick={() => buyNow(p)}><Icon name="zap" size={16} /> {t.buy}</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
