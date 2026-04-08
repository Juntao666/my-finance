import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Todos from './components/Todos'
import Transactions from './components/Transactions'

export default function App() {
  const [session, setSession] = useState(null)
  const [tab, setTab] = useState('todo')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  if (!session) return <Auth />

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setTab('todo')} style={{ fontWeight: tab === 'todo' ? 'bold' : 'normal' }}>
            Todo
          </button>
          <button onClick={() => setTab('finance')} style={{ fontWeight: tab === 'finance' ? 'bold' : 'normal' }}>
            记账
          </button>
        </div>
        <button onClick={() => supabase.auth.signOut()}>退出</button>
      </div>

      {tab === 'todo' ? <Todos userId={session.user.id} /> : <Transactions userId={session.user.id} />}
    </div>
  )
}