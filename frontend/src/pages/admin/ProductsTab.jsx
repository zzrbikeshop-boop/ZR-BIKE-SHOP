import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useApp } from '../../context/AppContext'
import ProductForm from './ProductForm'
import './ProductsTab.css'
import Icon from '../../components/ui/Icon'

const BLANK = { name_ar: '', name_en: '', price: '', old_price: '', is_new: true, in_stock: true, description: '' }

export default function ProductsTab({ products, onChange }) {
  const { t } = useApp()
  const [form, setForm] = useState(BLANK)
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(null)

  const cancelEdit = () => { setEditing(null); setForm(BLANK); setFiles([]) }
  const startEdit = p => {
    setEditing(p); setFiles([])
    setForm({ name_ar: p.name_ar, name_en: p.name_en || '', price: p.price, old_price: p.old_price || '', is_new: !!p.is_new, in_stock: p.in_stock !== false, description: p.description || '' })
    scrollTo({ top: 0, behavior: 'smooth' })
  }
  async function submit(e) {
    e.preventDefault(); setBusy(true)
    const images = []
    for (const file of files) {
      const path = `${Date.now()}-${file.name.replace(/[^\w.]/g, '_')}`
      const up = await supabase.storage.from('products').upload(path, file)
      if (!up.error) images.push(supabase.storage.from('products').getPublicUrl(path).data.publicUrl)
    }
    const row = {
      name_ar: form.name_ar, name_en: form.name_en || null, price: +form.price,
      old_price: form.old_price ? +form.old_price : null, is_new: form.is_new,
      in_stock: form.in_stock, description: form.description || null
    }
    if (images.length) { row.images = images; row.image_url = images[0] }
    if (editing) await supabase.from('products').update(row).eq('id', editing.id)
    else await supabase.from('products').insert(row)
    cancelEdit(); setBusy(false); onChange()
  }
  const remove = async id => {
    if (!confirm(t.confirmDel)) return
    await supabase.from('products').delete().eq('id', id); onChange()
  }

  return (
    <>
      <ProductForm form={form} setForm={setForm} editing={editing} busy={busy} setFiles={setFiles} onSubmit={submit} onCancel={cancelEdit} />
      <div className="plist">
        {products.map(p => (
          <div key={p.id} className="prow">
            {p.image_url ? <img src={p.image_url} alt="" /> : <span className="ph"><Icon name="bike" size={56} /></span>}
            <span>{p.name_ar}</span><strong>{Number(p.price).toLocaleString()}</strong>
            <button className="ghost" onClick={() => startEdit(p)}>{t.edit}</button>
            <button className="ghost danger" onClick={() => remove(p.id)}>{t.del}</button>
          </div>
        ))}
      </div>
    </>
  )
}
