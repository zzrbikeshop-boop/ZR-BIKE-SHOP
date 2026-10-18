import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useApp } from '../../context/AppContext'
import Login from './Login'
import OrdersTab from './OrdersTab'
import './Dashboard.css'

export default function Dashboard() {
  const { t, lang, setLang } = useApp()
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])

  // حالات نموذج المنتجات
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({
    name_ar: '',
    name_en: '',
    description: '',
    price: '',
    old_price: '',
    image_url: '',
    image_urls: [],
    in_stock: true,
    is_new: true,
    is_discounted: false,
    is_bike: false,
    color: '',
    bike_brand: '',
    frame_size: '',
    speeds: '',
    brake_type: '',
    frame_type: '',
    wheel_size: '',
    frame_material: '',
    suspension_type: '',
    bottom_bracket: '',
    chain_type: '',
    saddle_type: '',
    shifter_type: ''
  })
  const [files, setFiles] = useState([]) 
  const [previews, setPreviews] = useState([]) 
  const [busy, setBusy] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true) })
    const { data } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const load = async () => {
    const o = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    const p = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setOrders(o.data || []); setProducts(p.data || [])
  }
  
  useEffect(() => { if (session) load() }, [session])

  const f = k => e => setForm({ ...form, [k]: e.target.value })

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const combinedFiles = [...files, ...selectedFiles].slice(0, 4)
    setFiles(combinedFiles)
    setPreviews(combinedFiles.map(file => URL.createObjectURL(file)))
  }

  const handleRemoveImage = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    const updatedPreviews = previews.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    setPreviews(updatedPreviews)

    if (form.image_urls && form.image_urls.length > index) {
      const updatedUrls = form.image_urls.filter((_, i) => i !== index)
      setForm({ ...form, image_urls: updatedUrls, image_url: updatedUrls[0] || '' })
    }
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      let uploadedUrls = [...(form.image_urls || [])]

      if (files.length > 0) {
        for (const file of files) {
          if (file instanceof File) {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`
            
            let { error: uploadError } = await supabase.storage
              .from('products')
              .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage
              .from('products')
              .getPublicUrl(fileName)

            uploadedUrls.push(data.publicUrl)
          }
        }
      }

      uploadedUrls = uploadedUrls.slice(0, 4)

      const productData = {
        name_ar: form.name_ar,
        name_en: form.name_en,
        description: form.description,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        image_url: uploadedUrls[0] || '',
        image_urls: uploadedUrls,
        in_stock: form.in_stock,
        is_new: form.is_new,
        is_discounted: form.is_discounted,
        is_bike: form.is_bike,
        color: form.color, // <-- تم التعديل هنا لكي يحفظ اللون دائماً حتى لغير الدراجات
        bike_brand: form.is_bike ? form.bike_brand : null,
        frame_size: form.is_bike ? form.frame_size : null,
        speeds: form.is_bike && form.speeds ? Number(form.speeds) : null,
        brake_type: form.is_bike ? form.brake_type : null,
        frame_type: form.is_bike ? form.frame_type : null,
        wheel_size: form.is_bike ? form.wheel_size : null,
        frame_material: form.is_bike ? form.frame_material : null,
        suspension_type: form.is_bike ? form.suspension_type : null,
        bottom_bracket: form.is_bike ? form.bottom_bracket : null,
        chain_type: form.is_bike ? form.chain_type : null,
        saddle_type: form.is_bike ? form.saddle_type : null,
        shifter_type: form.is_bike ? form.shifter_type : null
      }

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('products').insert([productData])
        if (error) throw error
      }

      setForm({ 
        name_ar: '', name_en: '', description: '', price: '', old_price: '', image_url: '', image_urls: [],
        in_stock: true, is_new: true, is_discounted: false, is_bike: false,
        color: '', bike_brand: '', frame_size: '', speeds: '', brake_type: '', frame_type: '', 
        wheel_size: '', frame_material: '', suspension_type: '', bottom_bracket: '', 
        chain_type: '', saddle_type: '', shifter_type: ''
      })
      setFiles([])
      setPreviews([])
      setEditingProduct(null)
      setShowForm(false)
      load()
    } catch (err) {
      alert(lang === 'en' ? 'Error saving product: ' + err.message : 'خطأ أثناء حفظ المنتج: ' + err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleEdit = (p) => {
    setEditingProduct(p)
    const existingImages = p.image_urls && p.image_urls.length > 0 ? p.image_urls : (p.image_url ? [p.image_url] : [])
    setForm({
      ...p,
      image_urls: existingImages,
      is_bike: p.is_bike || false,
      color: p.color || '',
      bike_brand: p.bike_brand || '',
      frame_size: p.frame_size || '',
      speeds: p.speeds || '',
      brake_type: p.brake_type || '',
      frame_type: p.frame_type || '',
      wheel_size: p.wheel_size || '',
      frame_material: p.frame_material || '',
      suspension_type: p.suspension_type || '',
      bottom_bracket: p.bottom_bracket || '',
      chain_type: p.chain_type || '',
      saddle_type: p.saddle_type || '',
      shifter_type: p.shifter_type || ''
    })
    setFiles(existingImages)
    setPreviews(existingImages)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm(lang === 'en' ? 'Are you sure you want to delete this product?' : 'هل أنت متأكد من حذف هذا المنتج؟')) return
    await supabase.from('products').delete().eq('id', id)
    load()
  }

  if (!ready) return null
  if (!session) return <div className="admin"><Login /></div>
  const newCount = orders.filter(o => o.status === 'new').length

  return (
    <div className="admin" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <header className="admin-head">
        <a href="#/" className="brand">
          <img className="logo" src="/logo.jpg" alt="" />
          ZR<span>Bike</span>
        </a>
        <div className="nav-actions">
          <button className="ghost" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>{t.lang}</button>
          <button className="ghost" onClick={() => supabase.auth.signOut()}>{t.logout}</button>
        </div>
      </header>
      
      <div className="tabs">
        <button className={tab === 'orders' ? 'on' : ''} onClick={() => setTab('orders')}>
          {t.orders} ({newCount})
        </button>
        <button className={tab === 'products' ? 'on' : ''} onClick={() => setTab('products')}>
          {lang === 'en' ? 'Products Management' : 'إدارة المنتجات'}
        </button>
      </div>

      {tab === 'orders' && <OrdersTab orders={orders} onChange={load} />}
      
      {tab === 'products' && (
        <div className="products-admin-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {lang === 'en' ? 'Products & Bikes Management' : 'إدارة المنتجات والدراجات'}
            </h2>
            <button 
              className="btn-save" 
              onClick={() => { 
                setEditingProduct(null); 
                setForm({ 
                  name_ar: '', name_en: '', description: '', price: '', old_price: '', image_url: '', image_urls: [],
                  in_stock: true, is_new: true, is_discounted: false, is_bike: false,
                  color: '', bike_brand: '', frame_size: '', speeds: '', brake_type: '', frame_type: '', 
                  wheel_size: '', frame_material: '', suspension_type: '', bottom_bracket: '', 
                  chain_type: '', saddle_type: '', shifter_type: '' 
                }); 
                setFiles([]);
                setPreviews([]);
                setShowForm(!showForm); 
              }}
              style={{ background: '#0b1930', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '999px', cursor: 'pointer', fontWeight: 700 }}
            >
              {showForm ? (lang === 'en' ? 'Cancel' : 'إلغاء') : (lang === 'en' ? '+ Add New Product' : '+ إضافة منتج جديد')}
            </button>
          </div>

          {showForm && (
            <form className="product-form-container" onSubmit={handleSaveProduct}>
              <h3>{editingProduct ? (lang === 'en' ? 'Edit Product' : 'تعديل المنتج') : (lang === 'en' ? 'Add New Product' : 'إضافة منتج جديد')}</h3>
              
              <div className="form-group">
                <label>{lang === 'en' ? 'Product Name (Arabic)' : 'اسم المنتج (بالعربية)'}</label>
                <input required placeholder={lang === 'en' ? 'e.g. Professional Bike' : 'مثال: دراجة هوائية احترافية'} value={form.name_ar} onChange={f('name_ar')} />
              </div>

              <div className="form-group">
                <label>{lang === 'en' ? 'Product Name (English)' : 'اسم المنتج (بالإنجليزية)'}</label>
                <input placeholder="Professional Bike" value={form.name_en} onChange={f('name_en')} />
              </div>

              {/* قسم صور المنتج */}
              <div className="form-group" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontWeight: 'bold', color: '#0b1930', display: 'block', marginBottom: '0.5rem' }}>
                  {lang === 'en' ? 'Product Images (Add up to 4 images)' : 'صور المنتج (أضف حتى 4 صور)'}
                </label>
                <label className="file-label" style={{ display: 'block', background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px dashed #94a3b8', cursor: 'pointer', textAlign: 'center' }}>
                  <span style={{ color: '#2a7fd4', fontWeight: 600 }}>
                    {lang === 'en' ? 'Click to select images or drag them here' : 'اضغط لاختيار الصور أو اسحبها هنا'}
                  </span>
                  <input type="file" accept="image/*" multiple onChange={handleFileChange} style={{ marginTop: '0.5rem', display: 'block', margin: '0.5rem auto 0' }} />
                </label>
                
                {previews.length > 0 && (
                  <div className="preview-container" style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {previews.map((src, idx) => (
                      <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={src} 
                          alt="Preview" 
                          style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1' }} 
                        />
                        <span style={{ position: 'absolute', bottom: '2px', left: '2px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '1px 4px', borderRadius: '4px' }}>
                          {idx + 1}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveImage(idx)}
                          style={{ 
                            position: 'absolute', top: '-6px', right: '-6px', 
                            background: '#ff4757', color: '#fff', border: 'none', 
                            borderRadius: '50%', width: '22px', height: '22px', 
                            fontSize: '12px', cursor: 'pointer', display: 'grid', placeItems: 'center',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                          }}
                          title={lang === 'en' ? 'Remove image' : 'حذف هذه الصورة'}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>{lang === 'en' ? 'Description' : 'وصف المنتج'}</label>
                <textarea rows="3" placeholder={lang === 'en' ? 'Product details...' : 'تفاصيل المنتج...'} value={form.description || ''} onChange={f('description')} />
              </div>

              {/* ----- تم نقل حقل اللون هنا ليكون ظاهراً لجميع المنتجات (دراجات وقطع غيار) ----- */}
              <div className="form-group">
                <label>{lang === 'en' ? 'Colors (Separate with comma)' : 'الألوان المتاحة (افصل بينها بفاصلة)'}</label>
                <input placeholder={lang === 'en' ? 'e.g. Black, Red, Blue' : 'مثال: أسود, أحمر, أزرق'} value={form.color} onChange={f('color')} />
              </div>
              {/* --------------------------------------------------------------------------------- */}

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>{lang === 'en' ? 'Price (DZD)' : 'السعر (دج)'}</label>
                  <input required type="number" min="0" placeholder="0.00" value={form.price} onChange={f('price')} />
                </div>
                <div className="form-group">
                  <label>{lang === 'en' ? 'Old Price' : 'السعر قبل التخفيض'}</label>
                  <input type="number" min="0" placeholder="0.00" value={form.old_price || ''} onChange={f('old_price')} />
                </div>
              </div>

              <div className="checks-group" style={{ display: 'flex', gap: '2rem', margin: '0.5rem 0', flexWrap: 'wrap' }}>
                <label className="check" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_new} onChange={e => setForm({ ...form, is_new: e.target.checked })} />
                  {lang === 'en' ? 'New Product' : 'منتج جديد'}
                </label>
                <label className="check" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} />
                  {lang === 'en' ? 'In Stock' : 'متوفر في المخزون'}
                </label>
                <label className="check" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_discounted} onChange={e => setForm({ ...form, is_discounted: e.target.checked })} />
                  {lang === 'en' ? 'Discount' : 'تخفيضات'}
                </label>
                
                <label className="check" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: '#e0f2fe', padding: '0.3rem 0.8rem', borderRadius: '8px' }}>
                  <input type="checkbox" checked={form.is_bike} onChange={e => setForm({ ...form, is_bike: e.target.checked })} />
                  <span style={{ fontWeight: 'bold', color: '#0369a1' }}>
                    {lang === 'en' ? 'Full Bike (Show bike specifications)' : 'هذا المنتج دراجة كاملة (إظهار خصائص الدراجات)'}
                  </span>
                </label>
              </div>

              {/* مواصفات الدراجات الإضافية */}
              {form.is_bike && (
                <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ margin: 0, color: '#0b1930', fontSize: '1.05rem' }}>
                    {lang === 'en' ? 'Bike Technical Specifications' : 'المواصفات الفنية للدراجة'}
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>{lang === 'en' ? 'Bike Brand' : 'ماركة الدراجة'}</label>
                      <input placeholder="Trek, Shimano..." value={form.bike_brand} onChange={f('bike_brand')} />
                    </div>
                    <div className="form-group">
                      <label>{lang === 'en' ? 'Frame Size' : 'مقاس الإطار'}</label>
                      <input placeholder="M, L, 21inch..." value={form.frame_size} onChange={f('frame_size')} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>{lang === 'en' ? 'Speeds Count' : 'عدد السرعات'}</label>
                      <input type="number" placeholder="21" value={form.speeds} onChange={f('speeds')} />
                    </div>
                    <div className="form-group">
                      <label>{lang === 'en' ? 'Wheel Size' : 'مقاس العجلات'}</label>
                      <input placeholder="29 inch" value={form.wheel_size} onChange={f('wheel_size')} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>{lang === 'en' ? 'Frame Type' : 'نوع الهيكل'}</label>
                      <input placeholder="Mountain / Road" value={form.frame_type} onChange={f('frame_type')} />
                    </div>
                    <div className="form-group">
                      <label>{lang === 'en' ? 'Frame Material' : 'مادة صنع الهيكل'}</label>
                      <input placeholder="Aluminium / Carbon" value={form.frame_material} onChange={f('frame_material')} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>{lang === 'en' ? 'Brake Type' : 'نوع الفرامل'}</label>
                      <input placeholder="Hydraulic Disc" value={form.brake_type} onChange={f('brake_type')} />
                    </div>
                    <div className="form-group">
                      <label>{lang === 'en' ? 'Suspension Type' : 'نوع المساعدات'}</label>
                      <input placeholder="Dual Suspension" value={form.suspension_type} onChange={f('suspension_type')} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>{lang === 'en' ? 'Shifter Type' : 'نوع مغير السرعات'}</label>
                      <input placeholder="Shimano Deore" value={form.shifter_type} onChange={f('shifter_type')} />
                    </div>
                    <div className="form-group">
                      <label>{lang === 'en' ? 'Chain Type' : 'نوع السلسلة'}</label>
                      <input placeholder="KMC X10" value={form.chain_type} onChange={f('chain_type')} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>{lang === 'en' ? 'Saddle Type' : 'نوع المقعد'}</label>
                      <input placeholder="Ergonomic Sport" value={form.saddle_type} onChange={f('saddle_type')} />
                    </div>
                    <div className="form-group">
                      <label>{lang === 'en' ? 'Bottom Bracket' : 'نوع العلبة'}</label>
                      <input placeholder="Hollowtech II" value={form.bottom_bracket} onChange={f('bottom_bracket')} />
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-save" disabled={busy} style={{ background: '#0b1930', color: '#fff', border: 'none', padding: '0.7rem 1.8rem', borderRadius: '999px', fontWeight: 700, cursor: 'pointer' }}>
                  {busy ? (lang === 'en' ? 'Saving...' : 'جاري الحفظ...') : (editingProduct ? (lang === 'en' ? 'Update Product' : 'تحديث المنتج') : (lang === 'en' ? 'Save Product' : 'حفظ المنتج'))}
                </button>
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.7rem 1.5rem', borderRadius: '999px', fontWeight: 700, cursor: 'pointer' }}>
                  {lang === 'en' ? 'Cancel' : 'إلغاء'}
                </button>
              </div>
            </form>
          )}

          {/* قائمة المنتجات الحالية */}
          <div className="products-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.2rem', marginTop: '1.5rem' }}>
            {products.map(p => (
              <div key={p.id} style={{ background: '#fff', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(11,25,48,0.08)', display: 'flex', flexDirection: 'column', gap: '0.6rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                {p.image_urls && p.image_urls.length > 0 ? (
                  <img src={p.image_urls[0]} alt="" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px' }} />
                ) : p.image_url ? (
                  <img src={p.image_url} alt="" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px' }} />
                ) : (
                  <div style={{ width: '100%', height: '150px', background: '#f1f5f9', borderRadius: '10px', display: 'grid', placeItems: 'center', color: '#94a3b8' }}>
                    {lang === 'en' ? 'No Image' : 'بدون صورة'}
                  </div>
                )}
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0b1930' }}>
                  {lang === 'en' && p.name_en ? p.name_en : p.name_ar}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, color: '#2a7fd4', fontWeight: 800, fontSize: '1.05rem' }}>{Number(p.price).toLocaleString()} {lang === 'en' ? 'DZD' : 'دج'}</p>
                  {p.is_bike && <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 'bold' }}>{lang === 'en' ? 'Full Bike' : 'دراجة كاملة'}</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <button onClick={() => handleEdit(p)} style={{ flex: 1, background: '#0b1930', color: '#fff', border: 'none', padding: '0.45rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                    {lang === 'en' ? 'Edit' : 'تعديل'}
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ flex: 1, background: '#ff4757', color: '#fff', border: 'none', padding: '0.45rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                    {lang === 'en' ? 'Delete' : 'حذف'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}