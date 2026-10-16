import { supabase } from '../../lib/supabase'
import { useApp } from '../../context/AppContext'
import './OrdersTab.css'

const STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function OrdersTab({ orders, onChange }) {
  const { t } = useApp()
  const setStatus = async (id, status) => { await supabase.from('orders').update({ status }).eq('id', id); onChange() }
  const removeOrder = async id => {
    if (!confirm(t.confirmDel)) return
    await supabase.from('orders').delete().eq('id', id); onChange()
  }
  if (!orders.length) return <p className="muted">{t.noOrders}</p>
  return orders.map(o => (
    <div className={`order ${o.status}`} key={o.id}>
      <div>
        <strong>{o.customer_name}</strong> · <a href={`tel:${o.phone}`}>{o.phone}</a>
        <p className="muted">{o.wilaya} — {o.commune}{o.address ? ` — ${o.address}` : ''} · {t[o.delivery_type || 'home']} · {new Date(o.created_at).toLocaleString()}</p>
        <ul>{o.items.map((i, k) => <li key={k}>{i.name} × {i.qty}</li>)}</ul>
      </div>
      <div className="order-side">
        <strong>{Number(o.total).toLocaleString()} {t.dz}</strong>
        <small className="muted">{t.fee}: {Number(o.delivery_fee || 0).toLocaleString()}</small>
        <select value={o.status} onChange={e => setStatus(o.id, e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{t.st[s]}</option>)}
        </select>
        <button className="ghost danger" onClick={() => removeOrder(o.id)}>{t.del}</button>
      </div>
    </div>
  ))
}
