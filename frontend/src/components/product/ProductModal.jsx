import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LAYOUT_DIR } from '../../config'
import Modal from '../layout/Modal'
import './ProductModal.css'
import Icon from '../ui/Icon'

export default function ProductModal({ p, onClose }) {
  const { t, lang, add, buyNow } = useApp()
  
  if (!p) return null

  // فحص شامل لجميع خصائص الصور المحتملة في بيانات المنتج
  let imgs = []
  const rawImages = p.images || p.gallery || p.photos || p.image_urls
  
  if (Array.isArray(rawImages)) {
    imgs = rawImages.filter(Boolean)
  } else if (typeof rawImages === 'string' && rawImages.trim() !== '') {
    imgs = rawImages.split(',').map(s => s.trim()).filter(Boolean)
  }
  
  if (imgs.length === 0) {
    if (p.image_url) imgs.push(p.image_url)
    else if (p.img) imgs.push(p.img)
  }

  const [i, setI] = useState(0)
  const name = (lang === 'en' && p.name_en) || p.name_ar || 'منتج'
  const onSale = p.old_price && Number(p.old_price) > Number(p.price)
  const soldOut = p.in_stock === false
  const [L, R] = LAYOUT_DIR === 'rtl' ? ['chevR', 'chevL'] : ['chevL', 'chevR']
  
  const go = d => {
    if (imgs.length <= 1) return
    setI((prev) => (prev + d + imgs.length) % imgs.length)
  }

  return (
    <Modal onClose={onClose} wide>
      <div className="detail">
        <div className="gal">
          <div className="gal-main">
            {imgs.length > 0 && imgs[i] ? (
              <img src={imgs[i]} alt={name} />
            ) : (
              <span className="ph"><Icon name="bike" size={56} /></span>
            )}
            
            {/* ظهور الأسهم الدائرية فور توفر أكثر من صورة */}
            {imgs.length > 1 && (
              <>
                <button className="arrow prev" onClick={() => go(-1)} aria-label="previous">
                  <Icon name={L} size={16} />
                </button>
                <button className="arrow next" onClick={() => go(1)} aria-label="next">
                  <Icon name={R} size={16} />
                </button>
              </>
            )}
          </div>

          {/* الصور المصغرة بالأسفل */}
          {imgs.length > 1 && (
            <div className="thumbs">
              {imgs.map((u, k) => (
                <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)}>
                  <img src={u} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="info">
          <h2>{name}</h2>
          <span className={soldOut ? 'stock out' : 'stock'}>● {soldOut ? (t?.soldOut || 'غير متوفر') : (t?.inStock || 'متوفر')}</span>
          <div className="price big">
            <strong>{Number(p.price || 0).toLocaleString()} <small>{t?.dz || 'د.ج'}</small></strong>
            {onSale && <s>{Number(p.old_price).toLocaleString()} {t?.dz || 'د.ج'}</s>}
          </div>
          <div className="desc">
            <h4>{t?.descTitle || 'الوصف'}</h4>
            <p>{p.description || t?.noDesc || 'لا يوجد وصف متاح.'}</p>
            
            {/* ----- عرض المواصفات الإضافية بما في ذلك اللون ----- */}
            <div className="extra-specs">
              {p.color && <div className="spec-item"><strong>اللون:</strong> <span>{p.color}</span></div>}
              {p.bike_brand && <div className="spec-item"><strong>الماركة:</strong> <span>{p.bike_brand}</span></div>}
              {p.frame_type && <div className="spec-item"><strong>نوع الدراجة:</strong> <span>{p.frame_type}</span></div>}
              {p.frame_material && <div className="spec-item"><strong>مادة الصنع:</strong> <span>{p.frame_material}</span></div>}
              {p.frame_size && <div className="spec-item"><strong>مقاس الإطار:</strong> <span>{p.frame_size}</span></div>}
              {p.wheel_size && <div className="spec-item"><strong>مقاس العجلات:</strong> <span>{p.wheel_size}</span></div>}
              {p.speeds && <div className="spec-item"><strong>السرعات:</strong> <span>{p.speeds}</span></div>}
              {p.brake_type && <div className="spec-item"><strong>نوع الفرامل:</strong> <span>{p.brake_type}</span></div>}
              {p.suspension_type && <div className="spec-item"><strong>نظام التعليق:</strong> <span>{p.suspension_type}</span></div>}
              {p.shifter_type && <div className="spec-item"><strong>مبدل السرعات:</strong> <span>{p.shifter_type}</span></div>}
              {p.chain_type && <div className="spec-item"><strong>السلسلة:</strong> <span>{p.chain_type}</span></div>}
              {p.bottom_bracket && <div className="spec-item"><strong>المحور السفلي:</strong> <span>{p.bottom_bracket}</span></div>}
              {p.saddle_type && <div className="spec-item"><strong>المقعد:</strong> <span>{p.saddle_type}</span></div>}
            </div>
            {/* ------------------------------------------------------------------------- */}

          </div>
          <div className="detail-btns">
            <button className="btn dark" disabled={soldOut} onClick={() => { add(p); onClose() }}>
              <Icon name="bag" size={16} /> {t?.add || 'إضافة للسلة'}
            </button>
            <button className="btn" disabled={soldOut} onClick={() => buyNow(p)}>
              <Icon name="zap" size={16} /> {t?.buy || 'شراء الآن'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}