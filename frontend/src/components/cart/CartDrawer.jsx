import { useApp } from '../../context/AppContext'
import './CartDrawer.css'
import Icon from '../ui/Icon'

export default function CartDrawer({ onClose }) {
  const { t, lang, cart, setQty, total, setView, clear, warning } = useApp()
  
  return (
    <div className="overlay" onClick={onClose}>
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-head">
          <h2>{t.cart}</h2>
          <button className="ghost" onClick={onClose}>{t.close}</button>
        </div>

        {/* 🟡 صندوق التحذير الأصفر عند تجاوز الحد الأقصى */}
        {warning && (
          <div style={{
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            color: '#facc15',
            padding: '10px 15px',
            borderRadius: '8px',
            marginBottom: '15px',
            fontSize: '0.9rem',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {warning}
          </div>
        )}
        
        {!cart.length ? (
          <p className="muted">{t.emptyCart}</p>
        ) : (
          <>
            <ul className="lines">
              {cart.map(i => {
                const price = Number(i.price) || 0
                const qty = Number(i.qty) || 0
                const itemTotal = price * qty

                return (
                  <li key={i.id}>
                    <span>{(lang === 'en' && i.name_en) || i.name_ar}</span>
                    <div className="qty">
                      <button onClick={() => setQty(i.id, qty - 1)}>
                        <Icon name="minus" size={14} />
                      </button>
                      <b>{qty}</b>
                      <button onClick={() => setQty(i.id, qty + 1)}>
                        <Icon name="plus" size={14} />
                      </button>
                    </div>
                    <strong>{itemTotal.toLocaleString()}</strong>
                    <button 
                      className="rm" 
                      onClick={() => setQty(i.id, 0)} 
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