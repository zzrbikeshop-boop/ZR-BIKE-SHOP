import { useApp } from '../../context/AppContext'
import ProductCard from '../product/ProductCard'
import './ProductSection.css'

export default function ProductSection({ id, title, items }) {
  const { t } = useApp()
  return (
    <section className="section" id={id}>
      <h2>{title}</h2>
      {items.length ? <div className="grid">{items.map(p => <ProductCard key={p.id} p={p} />)}</div> : <p className="muted">{t.empty}</p>}
    </section>
  )
}
