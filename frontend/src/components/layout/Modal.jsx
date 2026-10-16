import { useEffect } from 'react'
import './Modal.css'
import Icon from '../ui/Icon'

export default function Modal({ onClose, wide, children }) {
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose()
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [])
  return (
    <div className="overlay center" onClick={onClose}>
      <div className={'modal' + (wide ? ' wide' : '')} role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="close"><Icon name="x" size={16} /></button>
        {children}
      </div>
    </div>
  )
}
