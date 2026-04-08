import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Todos({ userId }) {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)

  useEffect(() => { fetchTodos() }, [date])

  const fetchTodos = async () => {
    const { data } = await supabase
      .from('todos')
      .select('*')
      .eq('date', date)
      .order('created_at')
    setTodos(data || [])
  }

  const addTodo = async () => {
    if (!title.trim()) return
    await supabase.from('todos').insert({ user_id: userId, title, date, done: false })
    setTitle('')
    fetchTodos()
  }

  const toggleTodo = async (id, done) => {
    await supabase.from('todos').update({ done: !done }).eq('id', id)
    fetchTodos()
  }

  const deleteTodo = async (id) => {
    await supabase.from('todos').delete().eq('id', id)
    fetchTodos()
  }

  return (
    <div>
      <h3>Todo List</h3>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ marginBottom: 12 }} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="添加待办..." value={title} onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          style={{ flex: 1, padding: 8 }} />
        <button onClick={addTodo}>添加</button>
      </div>
      {todos.map(t => (
        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id, t.done)} />
          <span style={{ flex: 1, textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
          <button onClick={() => deleteTodo(t.id)}>删除</button>
        </div>
      ))}
    </div>
  )
}