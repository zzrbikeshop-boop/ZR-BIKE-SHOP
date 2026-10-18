import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useApp } from '../../context/AppContext'
import './OrdersTab.css'

const STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function OrdersTab({ orders, onChange }) {
  const { t } = useApp()
  const [orderToDelete, setOrderToDelete] = useState(null)

  const setStatus = async (id, status) => { 
    await supabase.from('orders').update({ status }).eq('id', id); 
    onChange() 
  }

  const confirmRemove = async () => {
    if (!orderToDelete) return
    await supabase.from('orders').delete().eq('id', orderToDelete)
    setOrderToDelete(null)
    onChange()
  }

  if (!orders.length) return <p className="muted" style={{color: '#a1a1aa'}}>{t.noOrders}</p>

  return (
    <>
      {orders.map(o => (
        <div className={`order ${o.status}`} key={o.id}>
          <div className="order-details">
            {/* رأس الطلب: اسم العميل ورقم الهاتف */}
            <div className="customer-header">
              <div className="customer-name-box">
                <span className="icon">👤</span>
                <strong>{o.customer_name}</strong>
              </div>
              <a href={`tel:${o.phone}`} className="phone-btn">
                📞 {o.phone}
              </a>
            </div>

            {/* شبكة معلومات العميل والتوصيل */}
            <div className="customer-info-grid">
              <div className="info-card">
                <span className="info-title">📍 عنوان التوصيل</span>
                <span className="info-text">{o.wilaya} — {o.commune} {o.address ? `(${o.address})` : ''}</span>
              </div>
              <div className="info-card">
                <span className="info-title">🚚 نوع التوصيل</span>
                <span className="info-text">{t[o.delivery_type || 'home']}</span>
              </div>
              <div className="info-card">
                <span className="info-title">📅 تاريخ الطلب</span>
                <span className="info-text">{new Date(o.created_at).toLocaleDateString('ar-DZ')}</span>
              </div>
            </div>

            {/* قائمة المنتجات المطلوبة */}
            <div className="order-items-box">
              <span className="items-title">المنتجات المطلوبة:</span>
              <ul>
                {o.items.map((i, k) => (
                  <li key={k}>
                    {/* التعديل هنا: إضافة اللون إذا كان موجوداً */}
                    <span className="item-name">• {i.name} {i.color ? <strong style={{color: '#ef4444', marginRight: '5px'}}>(اللون: {i.color})</strong> : ''}</span>
                    <span className="item-qty">الكمية: {i.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* القسم الجانبي للإجراءات والسعر */}
          <div className="order-side">
            <div className="order-price-info">
              <small>{t.fee}: {Number(o.delivery_fee || 0).toLocaleString()} {t.dz}</small>
              <strong>{Number(o.total).toLocaleString()} {t.dz}</strong>
            </div>
            
            <select value={o.status} onChange={e => setStatus(o.id, e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{t.st[s]}</option>)}
            </select>
            
            <button onClick={() => setOrderToDelete(o.id)}>{t.del}</button>
          </div>
        </div>
      ))}

      {/* كرت تأكيد الحذف الاحترافي المنبثق */}
      {orderToDelete && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-card">
            <div className="delete-modal-icon">⚠️</div>
            <h3>تأكيد الحذف</h3>
            <p>هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="delete-modal-actions">
              <button className="btn-confirm-del" onClick={confirmRemove}>نعم، احذف</button>
              <button className="btn-cancel-del" onClick={() => setOrderToDelete(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}