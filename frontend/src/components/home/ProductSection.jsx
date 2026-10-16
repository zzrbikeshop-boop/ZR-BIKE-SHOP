import { useApp } from '../../context/AppContext'
import ProductCard from '../product/ProductCard'
import './ProductSection.css'

export default function ProductSection({ id, title, items, onlyDiscount }) {
  const { t } = useApp()

  // إذا تم تمرير onlyDiscount أو كان الid يدل على التخفيضات، نقوم بالفلترة
  const shouldFilter = onlyDiscount || id === 'discounts' || id === 'sale' || id === 'offers'
  const displayItems = shouldFilter
    ? (items ? items.filter(p => p.is_discounted) : [])
    : items

  return (
    <section className="section" id={id}>
      <div className="section-header">
        <h2>{title}</h2>
      </div>
      {displayItems && displayItems.length > 0 ? (
        <div className="grid">
          {displayItems.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <p className="muted">{t.empty || 'لا توجد منتجات متاحة حالياً'}</p>
      )}
    </section>
  )
}