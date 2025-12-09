import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Dashboard(){
  const [transactions, setTransactions] = useState([])
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')

  useEffect(()=>{
    fetch('/api/transactions').then(r=>r.json()).then(j=>setTransactions(j || []))
    fetch('/api/users').then(r=>r.json()).then(j=>setUsers(j.users || []))
  },[])

  const filteredUsers = q ? users.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.username.toLowerCase().includes(q.toLowerCase())) : users

  return (
    <div style={{maxWidth:900, margin:'24px auto', fontFamily:'system-ui, sans-serif'}}>
      <Header />
      <main style={{padding:20}}>
        <h2>Dashboard</h2>
        <p>Halo, ini area ringkasan akun Anda.</p>

        <section style={{display:'flex', gap:20, marginTop:18}}>
          <div style={{flex:2}}>
            <h3>Transaksi Terakhir</h3>
            {transactions.length === 0 ? <p>Tidak ada transaksi.</p> : (
              <ul>
                {transactions.slice(0,8).map(tx => (
                  <li key={tx.id} style={{marginBottom:8}}>
                    <strong>{tx.from}</strong> → <strong>{tx.to}</strong>
                    &nbsp;• Rp {tx.amount.toLocaleString()} &nbsp;
                    <span style={{color:'#666'}}>({tx.note || '—'})</span>
                  </li>
                ))}
              </ul>
            )}

            <p style={{marginTop:12}}>Lihat detail akun di <Link href="/accounts/101"><a>Account BF-101</a></Link> atau <Link href="/accounts/102"><a>Account BF-102</a></Link>.</p>
          </div>

          <aside style={{flex:1, padding:12, border:'1px solid #f0f0f0', borderRadius:8}}>
            <h4>Daftar Pengguna</h4>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari nama atau username" style={{width:'100%', padding:8, marginBottom:8}}/>
            {filteredUsers.length===0 ? <p style={{color:'#666'}}>Tidak ada user.</p> : (
              <ul style={{paddingLeft:16}}>
                {filteredUsers.slice(0,6).map(u=>(
                  <li key={u.id}>{u.name} <em style={{color:'#888'}}>({u.username})</em></li>
                ))}
              </ul>
            )}
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  )
}
