import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['餐饮', '交通', '购物', '娱乐', '医疗', '住房', '其他']

export default function Transactions({ userId }) {
  const [transactions, setTransactions] = useState([])
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('餐饮')
  const [note, setNote] = useState('')
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [month, setMonth] = useState(today.slice(0, 7))

  useEffect(() => { fetchTransactions() }, [month])

const fetchTransactions = async () => {
  const start = month + '-01'
  const nextMonth = new Date(month + '-01')
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const end = nextMonth.toISOString().split('T')[0]

  const { data } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', start)
    .lt('date', end)
    .order('date', { ascending: false })
  setTransactions(data || [])
}

  const addTransaction = async () => {
    if (!amount) return
    await supabase.from('transactions').insert({
      user_id: userId, amount: parseFloat(amount), category, note, date
    })
    setAmount('')
    setNote('')
    fetchTransactions()
  }

  const deleteTransaction = async (id) => {
    await supabase.from('transactions').delete().eq('id', id)
    fetchTransactions()
  }

  // 按类别统计
  const summary = CATEGORIES.map(cat => ({
    cat,
    total: transactions.filter(t => t.category === cat).reduce((sum, t) => sum + Number(t.amount), 0)
  })).filter(s => s.total > 0)

  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <div>
      <h3>记账</h3>

      {/* 添加记录 */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: 8 }} />
        <input placeholder="金额" type="number" value={amount} onChange={e => setAmount(e.target.value)}
          style={{ width: 100, padding: 8 }} />
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: 8 }}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <input placeholder="备注" value={note} onChange={e => setNote(e.target.value)} style={{ padding: 8 }} />
        <button onClick={addTransaction}>添加</button>
      </div>

      {/* 月份筛选 + 统计 */}
      <div style={{ marginBottom: 16 }}>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} style={{ marginBottom: 8 }} />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {summary.map(s => (
            <span key={s.cat} style={{ background: '#f0f0f0', padding: '4px 10px', borderRadius: 12 }}>
              {s.cat} ¥{s.total.toFixed(2)}
            </span>
          ))}
        </div>
        <p><strong>本月合计：¥{total.toFixed(2)}</strong></p>
      </div>

      {/* 明细列表 */}
      {transactions.map(t => (
        <div key={t.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <span style={{ color: '#888', fontSize: 13 }}>{t.date}</span>
          <span style={{ background: '#e8f4ff', padding: '2px 8px', borderRadius: 8 }}>{t.category}</span>
          <span>¥{Number(t.amount).toFixed(2)}</span>
          <span style={{ flex: 1, color: '#666' }}>{t.note}</span>
          <button onClick={() => deleteTransaction(t.id)}>删除</button>
        </div>
      ))}
    </div>
  )
}