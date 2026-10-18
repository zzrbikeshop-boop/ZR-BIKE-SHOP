import { useApp } from '../../context/AppContext'
import './CartDrawer.css'
import Icon from '../ui/Icon'

export default function CartDrawer({ onClose }) {
  const { t, lang, cart, setQty, total, setView, clear, warning } = useApp()
  
  return (
    <div 
      className="overlay" 
      onClick={onClose}
      style={{ zIndex: 99999, position: 'fixed', inset: 0 }}
    >
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        {/* رأس السلة المزود بتنسيقات تجعله دائماً أعلى الشاشة وفوق الهيدر */}
        <div 
          className="drawer-head" 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem', 
            borderBottom: '1px solid #e2e8f0', 
            width: '100%',
            background: '#ffffff'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#0b1930' }}>
            {t?.cart || (lang === 'en' ? 'Cart' : 'السلة')}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            aria-label={t?.close || 'إغلاق'}
            style={{
              background: '#f1f5f9',
              border: 'none',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0b1930',
              flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>

        {/* 🟡 صندوق التحذير الأصفر عند تجاوز الحد الأقصى */}
        {warning && (
          <div style={{
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            color: '#facc15',
            padding: '10px 15px',
            borderRadius: '8px',
            margin: '15px',
            fontSize: '0.9rem',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {warning}
          </div>
        )}
        
        {!cart.length ? (
          <p className="muted" style={{ padding: '1.5rem', textAlign: 'center' }}>{t.emptyCart}</p>
        ) : (
          <>
            <ul className="lines">
              {cart.map((i, idx) => {
                const price = Number(i.price) || 0
                const qty = Number(i.qty) || 0
                const itemTotal = price * qty

                return (
                  <li key={i.cartId || `${i.id}-${idx}`}>
                    {/* عرض اسم المنتج وتحته اللون المختار */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{(lang === 'en' && i.name_en) || i.name_ar}</span>
                      {i.color && (
                        <small style={{ color: '#e11d48', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '2px' }}>
                          {lang === 'en' ? `Color: ${i.color}` : `اللون: ${i.color}`}
                        </small>
                      )}
                    </div>

                    <div className="qty">
                      <button onClick={() => setQty(i.cartId || i.id, qty - 1)}>
                        <Icon name="minus" size={14} />
                      </button>
                      <b>{qty}</b>
                      <button onClick={() => setQty(i.cartId || i.id, qty + 1)}>
                        <Icon name="plus" size={14} />
                      </button>
                    </div>
                    <strong>{itemTotal.toLocaleString()}</strong>
                    <button 
                      className="rm" 
                      onClick={() => setQty(i.cartId || i.id, 0)} 
                      aria-label={t.remove} 
                      title={t.remove}
                    >
                      <Icon name="trash" size={18} />
                    </button>
                  </li>
                )
              })}
            </ul>
            
            <p className="total">
              {t.total}: <strong>{(Number(total) || 0).toLocaleString()} {t.dz}</strong>
            </p>
            
            <button className="btn" onClick={() => setView('checkout')}>{t.checkout}</button>
            <button className="ghost" onClick={clear}>{t.clearCart}</button>
          </>
        )}
      </aside>
    </div>
  )
}