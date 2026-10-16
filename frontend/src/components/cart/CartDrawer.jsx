import { useApp } from '../../context/AppContext'
import './CartDrawer.css'
import Icon from '../ui/Icon'

export default function CartDrawer({ onClose }) {
  const { t, lang, cart, setQty, total, setView, clear } = useApp()
  return (
    <div className="overlay" onClick={onClose}>
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-head"><h2>{t.cart}</h2><button className="ghost" onClick={onClose}>{t.close}</button></div>
        {!cart.length ? <p className="muted">{t.emptyCart}</p> : (
          <>
            <ul className="lines">
              {cart.map(i => (
                <li key={i.id}>
                  <span>{(lang === 'en' && i.name_en) || i.name_ar}</span>
                  <div className="qty">
                    <button onClick={() => setQty(i.id, i.qty - 1)}><Icon name="minus" size={14} /></button><b>{i.qty}</b><button onClick={() => setQty(i.id, i.qty + 1)}><Icon name="plus" size={14} /></button>
                  </div>
                  <strong>{(i.price * i.qty).toLocaleString()}</strong>
                  <button className="rm" onClick={() => setQty(i.id, 0)} aria-label={t.remove} title={t.remove}><Icon name="trash" size={18} /></button>
                </li>
              ))}
            </ul>
            <p className="total">{t.total}: <strong>{total.toLocaleString()} {t.dz}</strong></p>
            <button className="btn" onClick={() => setView('checkout')}>{t.checkout}</button>
            <button className="ghost" onClick={clear}>{t.clearCart}</button>
          </>
        )}
      </aside>
    </div>
  )
}
