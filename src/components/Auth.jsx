import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('注册成功，请检查邮箱验证')
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '100px auto', padding: 24 }}>
      <h2>{isLogin ? '登录' : '注册'}</h2>
      <input placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }} />
      <input placeholder="密码" type="password" value={password} onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }} />
      <button onClick={handleSubmit} style={{ width: '100%', padding: 10 }}>
        {isLogin ? '登录' : '注册'}
      </button>
      <p style={{ marginTop: 12, cursor: 'pointer', color: 'blue' }}
        onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? '没有账号？去注册' : '已有账号？去登录'}
      </p>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  )
}