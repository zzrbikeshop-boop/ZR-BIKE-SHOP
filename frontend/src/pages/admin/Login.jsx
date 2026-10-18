import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useApp } from '../../context/AppContext'
import './Login.css'

export default function Login() {
  const { t } = useApp()
  const [e, setE] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')
  
  async function go(ev) {
    ev.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email: e, password: p })
    if (error) setErr(error.message)
  }
  
  return (
    <form className="login" onSubmit={go}>
      <h2>{t.login}</h2>
      <input type="email" required placeholder={t.email} value={e} onChange={x => setE(x.target.value)} />
      <input type="password" required placeholder={t.pass} value={p} onChange={x => setP(x.target.value)} />
      {err && <p className="error">{err}</p>}
      <button className="btn">{t.login}</button>
    </form>
  )
}