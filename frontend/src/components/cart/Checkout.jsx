import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Modal from '../layout/Modal'
import { supabase } from '../../lib/supabase'
import { wilayas } from '../../lib/i18n'
import { feeFor } from '../../lib/delivery'
import './Checkout.css'

export default function Checkout({ onClose }) {
  const { t, lang, cart, total, clear, setView } = useApp()
  const [f, setF] = useState({ customer_name: '', phone: '', wilaya: '', commune: '', address: '', delivery_type: 'home' })
  const [state, setState] = useState('')
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const code = f.wilaya ? parseInt(f.wilaya) : 0
  const fee = code ? feeFor(code, f.delivery_type) : 0

  async function submit(e) {
    e.preventDefault()
    setState('loading')
    // التعديل هنا: إضافة حقل color مع كل منتج يُرسل إلى قاعدة البيانات
    const items = cart.map(i => ({ id: i.id, name: i.name_ar, price: i.price, qty: i.qty, color: i.color || null }))
    const { error } = await supabase.from('orders').insert({ ...f, items, delivery_fee: fee, total: total + fee })
    if (error) return setState('err')
    clear(); setView('done')
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="m-title">{t.orderTitle}</h2>
      <form className="checkout" onSubmit={submit}>
        <label>{t.name}<input required placeholder={t.namePh} value={f.customer_name} onChange={set('customer_name')} /></label>
        <label>{t.phone}<input required type="tel" inputMode="tel" dir="ltr" pattern="0[5-7][0-9]{8}" title={t.phoneBad} placeholder="05XXXXXXXX" value={f.phone} onChange={set('phone')} /></label>
        <label>
          <span className="lbl">{t.wilaya}{code > 0 && <em className="chip">{t.fee}: {fee} {t.dz}</em>}</span>
          <select required value={f.wilaya} onChange={set('wilaya')}>
            <option value="">{t.pick}</option>{wilayas.map(w => <option key={w}>{w}</option>)}
          </select>
        </label>
        <fieldset>
          <legend>{t.deliveryMethod}</legend>
          {['home', 'desk'].map(k => (
            <label key={k} className={'radio' + (f.delivery_type === k ? ' on' : '')}>
              <input type="radio" name="dt" checked={f.delivery_type === k} onChange={() => setF({ ...f, delivery_type: k })} />{t[k]}
            </label>
          ))}
        </fieldset>
        <label>{t.commune}<input required placeholder={t.communePh} value={f.commune} onChange={set('commune')} /></label>
        <label>{t.fullAddr}<input required={f.delivery_type === 'home'} placeholder={t.addrPh} value={f.address} onChange={set('address')} /></label>
        <div className="summary">
          <p><span>{t.subtotal}:</span><span>{total.toLocaleString()} {t.dz}</span></p>
          <p><span>{t.fee}:</span><span>{fee.toLocaleString()} {t.dz}</span></p>
          <p className="grand"><span>{t.total}:</span><span>{(total + fee).toLocaleString()} {t.dz}</span></p>
        </div>
        {state === 'err' && <p className="error">{t.err}</p>}
        <button className="btn" disabled={state === 'loading' || !cart.length}>{t.confirm}</button>
      </form>
    </Modal>
  )
}