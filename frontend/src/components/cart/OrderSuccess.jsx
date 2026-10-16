import { useApp } from '../../context/AppContext'
import Modal from '../layout/Modal'
import './OrderSuccess.css'

export default function OrderSuccess({ onClose }) {
  const { t } = useApp()
  return (
    <Modal onClose={onClose}>
      <div className="done">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></svg>
        <h2>{t.successT}</h2>
        <p>{t.successM}</p>
        <button className="btn" onClick={onClose}>{t.close}</button>
      </div>
    </Modal>
  )
}
