import { useEffect } from 'react'
import './Modal.css'
import Icon from '../ui/Icon'

export default function Modal({ onClose, wide, children }) {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="overlay center" onClick={onClose}>
      <div 
        className={'modal' + (wide ? ' wide' : '')} 
        role="dialog" 
        aria-modal="true" 
        onClick={e => e.stopPropagation()}
      >
        <button className="x" onClick={onClose} aria-label="close">
          <Icon name="x" size={16} />
        </button>
        {children}
      </div>
    </div>
  )
}