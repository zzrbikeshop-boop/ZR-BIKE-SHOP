import { useApp } from '../../context/AppContext'
import './ProductForm.css'

export default function ProductForm({ form, setForm, editing, busy, setFiles, onSubmit, onCancel }) {
  const { t } = useApp()
  const f = k => e => setForm({ ...form, [k]: e.target.value })
  return (
    <form className="add-form" onSubmit={onSubmit}>
      <h3>{editing ? t.editing : t.addProduct}</h3>
      <input required placeholder={t.nameAr} value={form.name_ar} onChange={f('name_ar')} />
      <input placeholder={t.nameEn} value={form.name_en} onChange={f('name_en')} />
      <textarea rows="3" placeholder={t.descr} value={form.description} onChange={f('description')} />
      <input required type="number" min="0" placeholder={t.price} value={form.price} onChange={f('price')} />
      <input type="number" min="0" placeholder={t.oldPrice} value={form.old_price} onChange={f('old_price')} />
      <label className="file">{t.image}<input type="file" multiple accept="image/*" onChange={e => setFiles([...e.target.files])} /></label>
      <label className="check"><input type="checkbox" checked={form.is_new} onChange={e => setForm({ ...form, is_new: e.target.checked })} />{t.isNew}</label>
      <label className="check"><input type="checkbox" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} />{t.inStock}</label>
      {editing && <small className="muted">{t.replaceImgs}</small>}
      <button className="btn" disabled={busy}>{editing ? t.update : t.save}</button>
      {editing && <button type="button" className="ghost" onClick={onCancel}>{t.cancel}</button>}
    </form>
  )
}
