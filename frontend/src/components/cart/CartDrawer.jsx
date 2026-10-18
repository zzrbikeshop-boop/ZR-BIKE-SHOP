import { useApp } from '../../context/AppContext'
import './CartDrawer.css'
import Icon from '../ui/Icon'

export default function CartDrawer({ onClose }) {
  const { t, lang, cart, setQty, total, setView, clear, warning } = useApp()
  
  return (
    <div 
      className="overlay" 
      onClick={onClose}
      style={{ zIndex: 99999, position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)' }}
    >
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        {/* رأس السلة المزود بتصميم DARAJATI الداكن */}
        <div className="drawer-head">
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.3px' }}>
            {t?.cart || (lang === 'en' ? 'Cart' : 'السلة')}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            aria-label={t?.close || 'إغلاق'}
            style={{
              background: '#27272a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ef4444'
              e.currentTarget.style.borderColor = '#ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#27272a'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 🟡 صندوق التحذير الأصفر عند تجاوز الحد الأقصى */}
        {warning && (
          <div style={{
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            color: '#facc15',
            padding: '10px 15px',
            borderRadius: '10px',
            fontSize: '0.9rem',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {warning}
          </div>
        )}
        
        {!cart.length ? (
          <p className="muted" style={{ padding: '2rem 1rem', textAlign: 'center', color: '#a1a1aa' }}>{t.emptyCart}</p>
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
                      <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff' }}>
                        {(lang === 'en' && i.name_en) || i.name_ar}
                      </span>
                      {i.color && (
                        <small style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', marginTop: '2px' }}>
                          {lang === 'en' ? `Color: ${i.color}` : `اللون: ${i.color}`}
                        </small>
                      )}
                    </div>

                    <div className="qty">
                      <button onClick={() => setQty(i.cartId || i.id, qty - 1)}>
                        <Icon name="minus" size={14} />
                      </button>
                      <b style={{ minWidth: '18px', textAlign: 'center', fontSize: '0.95rem', color: '#ffffff' }}>{qty}</b>
                      <button onClick={() => setQty(i.cartId || i.id, qty + 1)}>
                        <Icon name="plus" size={14} />
                      </button>
                    </div>
                    <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>{itemTotal.toLocaleString()}</strong>
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
              <span>{t.total}:</span>
              <strong>{(Number(total) || 0).toLocaleString()} {t.dz}</strong>
            </p>
            
            <button 
              className="btn" 
              onClick={() => setView('checkout')}
              style={{
                background: '#ffffff',
                color: '#0a0a0a',
                fontWeight: '800',
                padding: '0.85rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              {t.checkout}
            </button>
            <button 
              className="ghost" 
              onClick={clear}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#a1a1aa',
                fontWeight: '600',
                padding: '0.65rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
            >
              {t.clearCart}
            </button>
          </>
        )}
      </aside>
    </div>
  )
}