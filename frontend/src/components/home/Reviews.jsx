import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { REVIEWS_COUNT } from '../../config'
import Modal from '../layout/Modal'
import './Reviews.css'

// returns the first existing file among N.jpg / N.png / N.webp, or null
const find = n => new Promise(resolve => {
  const exts = ['jpg', 'png', 'webp']
  const next = k => {
    if (k >= exts.length) return resolve(null)
    const im = new Image(), url = `/reviews/${n}.${exts[k]}`
    im.onload = () => resolve(url)
    im.onerror = () => next(k + 1)
    im.src = url
  }
  next(0)
})

export default function Reviews() {
  const { t } = useApp()
  const [imgs, setImgs] = useState([])
  const [zoom, setZoom] = useState(null)

  useEffect(() => {
    let alive = true
    Promise.all(Array.from({ length: REVIEWS_COUNT }, (_, i) => find(i + 1)))
      .then(a => alive && setImgs(a.filter(Boolean)))
    return () => { alive = false }
  }, [])

  if (!imgs.length) return null
  return (
    <section className="section reviews" id="reviews">
      <h2>{t.reviews}</h2>
      <div className="rev-wrap">
        <div className="rev-track">
          {[...imgs, ...imgs].map((u, i) => <img key={i} src={u} alt="" loading="lazy" onClick={() => setZoom(u)} />)}
        </div>
      </div>
      {zoom && <Modal onClose={() => setZoom(null)}><img className="zoom" src={zoom} alt="" /></Modal>}
    </section>
  )
}
