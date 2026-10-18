import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LAYOUT_DIR } from '../../config'
import Modal from '../layout/Modal'
import './ProductModal.css'
import Icon from '../ui/Icon'

// قاموس الألوان الذكي المحدث (يدعم الكلمات بالهمزة وبدون همزة)
const getColorHex = (name) => {
  const cleanName = name.toLowerCase().trim();
  const map = {
    'أحمر': '#ef4444', 'احمر': '#ef4444', 'red': '#ef4444',
    'أسود': '#111827', 'اسود': '#111827', 'black': '#111827',
    'أبيض': '#ffffff', 'ابيض': '#ffffff', 'white': '#ffffff',
    'أزرق': '#3b82f6', 'ازرق': '#3b82f6', 'blue': '#3b82f6',
    'أخضر': '#22c55e', 'اخضر': '#22c55e', 'green': '#22c55e',
    'أصفر': '#eab308', 'اصفر': '#eab308', 'yellow': '#eab308',
    'رمادي': '#6b7280', 'gray': '#6b7280', 'grey': '#6b7280',
    'فضي': '#cbd5e1', 'silver': '#cbd5e1',
    'ذهبي': '#fbbf24', 'gold': '#fbbf24',
    'برتقالي': '#f97316', 'orange': '#f97316',
    'وردي': '#ec4899', 'زهري': '#ec4899', 'pink': '#ec4899',
    'بنفسجي': '#a855f7', 'purple': '#a855f7',
    'بني': '#78350f', 'brown': '#78350f',
    'كحلي': '#1e3a8a', 'navy': '#1e3a8a',
    'سماوي': '#38bdf8', 'cyan': '#38bdf8',
    'بيج': '#f5f5dc', 'beige': '#f5f5dc'
  };
  return map[cleanName] || null;
}

export default function ProductModal({ p, onClose }) {
  const { t, lang, add, buyNow } = useApp()
  const [selectedColor, setSelectedColor] = useState(null)
  
  if (!p) return null

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

  const handleAdd = () => {
    if (p.color && !selectedColor) {
      alert(lang === 'en' ? 'Please select a color first!' : 'الرجاء اختيار اللون الذي تريده أولاً!');
      return;
    }
    const productToAdd = selectedColor ? { ...p, color: selectedColor } : p;
    add(productToAdd);
    onClose();
  }

  const handleBuyNow = () => {
    if (p.color && !selectedColor) {
      alert(lang === 'en' ? 'Please select a color first!' : 'الرجاء اختيار اللون الذي تريده أولاً!');
      return;
    }
    const productToBuy = selectedColor ? { ...p, color: selectedColor } : p;
    buyNow(productToBuy);
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
            
            <div className="extra-specs">
              {p.color && (
                <div className="spec-item" style={{ alignItems: 'flex-start', flexDirection: 'column', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <strong style={{ marginBottom: '8px', color: '#e11d48' }}>
                    {lang === 'en' ? 'Select Color *' : 'اختر اللون المطلوب *'}
                  </strong> 
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {p.color.split(',').map((c, index) => {
                      const colorName = c.trim()
                      const isSelected = selectedColor === colorName
                      const hexColor = getColorHex(colorName)

                      return (
                        <button 
                          key={index}
                          type="button"
                          onClick={() => setSelectedColor(colorName)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: isSelected ? '#0b1930' : '#ffffff',
                            color: isSelected ? '#ffffff' : '#0b1930',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            border: isSelected ? '2px solid #0b1930' : '2px solid #cbd5e1',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected ? '0 4px 6px -1px rgba(11, 25, 48, 0.2)' : 'none'
                          }}
                        >
                          {hexColor && (
                            <span style={{
                              display: 'inline-block',
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              backgroundColor: hexColor,
                              border: hexColor === '#ffffff' ? '1px solid #cbd5e1' : `1px solid ${hexColor}`,
                            }}></span>
                          )}
                          <span>{colorName}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

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

          </div>
          <div className="detail-btns">
            <button className="btn dark" disabled={soldOut} onClick={handleAdd}>
              <Icon name="bag" size={16} /> {t?.add || 'إضافة للسلة'}
            </button>
            <button className="btn" disabled={soldOut} onClick={handleBuyNow}>
              <Icon name="zap" size={16} /> {t?.buy || 'شراء الآن'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}