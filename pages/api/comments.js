import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// helper: parse cookie simple (client & server safe)
function parseCookie(cookieStr = '') {
  return cookieStr.split(';').map(s => s.trim()).reduce((acc, cur) => {
    if (!cur) return acc
    const kv = cur.split('=')
    acc[kv[0]] = kv.slice(1).join('=')
    return acc
  }, {})
}

export default function Dashboard({ transactions = [], users = { users: [] }, comments = [], showCommentFeature = false }) {
  const [localTransactions, setTransactions] = useState(transactions || [])
  const [localUsers, setUsers] = useState((users && users.users) || [])
  const [q, setQ] = useState('')
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    setTransactions(transactions || [])
    setUsers((users && users.users) || [])
  },[transactions, users])

  const filteredUsers = q ? localUsers.filter(u => (u.name || '').toLowerCase().includes(q.toLowerCase()) || (u.username || '').toLowerCase().includes(q.toLowerCase())) : localUsers

  async function submitComment(e) {
    e.preventDefault()
    setMsg('Mengirim...')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ author: author || 'anonymous', text })
      })
      const j = await res.json()
      if (res.ok) {
        setMsg('Komentar dikirim!')
        setTimeout(()=> {
          setMsg('')
          setAuthor('')
          setText('')
          const el = document.getElementById('comments-list')
          if (el && j.newComment) {
            const li = document.createElement('li')
            li.innerHTML = `<strong>${j.newComment.author}</strong>: ${j.newComment.text}`
            el.appendChild(li)
          }
        }, 600)
      } else {
        setMsg('Gagal mengirim komentar')
      }
    } catch (err) {
      setMsg('Error mengirim komentar')
    }
  }

  return (
    <div style={{maxWidth:900, margin:'24px auto', fontFamily:'system-ui, sans-serif'}}>
      <Header />
      <main style={{padding:20}}>
        <h2>Dashboard</h2>
        <p>Halo, ini area ringkasan akun Anda.</p>

        <section style={{display:'flex', gap:20, marginTop:18}}>
          <div style={{flex:2}}>
            <h3>Transaksi Terakhir</h3>
            {localTransactions.length === 0 ? <p>Tidak ada transaksi.</p> : (
              <ul>
                {localTransactions.slice(0,8).map(tx => (
                  <li key={tx.id} style={{marginBottom:8}}>
                    <strong>{tx.from}</strong> → <strong>{tx.to}</strong>
                    &nbsp;• Rp {tx.amount.toLocaleString()} &nbsp;
                    <span style={{color:'#666'}}>({tx.note || '—'})</span>
                  </li>
                ))}
              </ul>
            )}

            <p style={{marginTop:12}}>Lihat detail akun di <Link href="/accounts/101"><a>Account BF-101</a></Link> atau <Link href="/accounts/102"><a>Account BF-102</a></Link>.</p>

            {showCommentFeature ? (
              <div style={{marginTop:24, padding:12, border:'1px solid #eee', borderRadius:8}}>
                <h4>Fitur Komentar (khusus akun)</h4>
                <form onSubmit={submitComment}>
                  <input placeholder="Nama" value={author} onChange={e=>setAuthor(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}}/>
                  <textarea placeholder="Masukkan komentar..." value={text} onChange={e=>setText(e.target.value)} style={{width:'100%',padding:8, minHeight:80}}/>
                  <div style={{marginTop:8}}>
                    <button type="submit" style={{padding:'8px 12px'}}>Kirim Komentar</button>
                    <span style={{marginLeft:12,color:'#666'}}>{msg}</span>
                  </div>
                </form>

                <div style={{marginTop:12}}>
                  <h5>Komentar Terkini</h5>
                  <ul id="comments-list">
                    {comments && comments.map(c => (
                      <li key={c.id} dangerouslySetInnerHTML={{ __html: `<strong>${c.author}</strong>: ${c.text}` }} />
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

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

// Server-side props: determine if this user is a "real account" and echo latest comment if so
export async function getServerSideProps({ req, res }) {
  const fs = require('fs')
  const path = require('path')

  // parse cookie
  const cookies = parseCookie(req.headers.cookie || '')
  const username = (cookies.user || 'guest').toString()

  // read accounts and users
  const accountsPath = path.join(process.cwd(), 'data', 'accounts.json')
  const usersPath = path.join(process.cwd(), 'data', 'users.json')
  const commentsPath = path.join(process.cwd(), 'data', 'comments.json')
  let accounts = [], users = { users: [] }, comments = [], transactions = []

  try {
    accounts = JSON.parse(fs.readFileSync(accountsPath, 'utf8')).accounts || []
  } catch (e) { accounts = [] }
  try {
    users = JSON.parse(fs.readFileSync(usersPath, 'utf8'))
  } catch (e) { users = { users: [] } }
  try {
    comments = JSON.parse(fs.readFileSync(commentsPath, 'utf8')) || []
  } catch (e) { comments = [] }

  // flexible matching
  const norm = s => String(s || '').toLowerCase().trim()
  const uname = norm(username)

  const isAccountMatch = accounts.find(acc => {
    const cands = [acc.id, acc.number, acc.accountNumber, acc.username, acc.owner, acc.name].filter(Boolean)
    return cands.some(c => norm(c) === uname || String(c) === String(username))
  })

  const isUserMatch = (users.users || []).find(u => {
    const cands = [u.username, u.name, u.id].filter(Boolean)
    return cands.some(c => norm(c) === uname || String(c) === String(username))
  })

  const isRealAccount = Boolean(isAccountMatch || isUserMatch)

  // prioritize last_comment cookie
  const cookieHeader = req.headers.cookie || ''
  const cookiesMap = cookieHeader.split(';').map(s=>s.trim()).reduce((a,c)=>{
    if(!c) return a
    const idx=c.indexOf('=')
    a[c.slice(0,idx)]=c.slice(idx+1)
    return a
  },{})

  let echoValue = null
  if (cookiesMap.last_comment) {
    try { echoValue = decodeURIComponent(cookiesMap.last_comment) } catch(e){ echoValue = cookiesMap.last_comment }
    // clear cookie
    res.setHeader('Set-Cookie', `last_comment=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`)
  }

  // fallback to last comment from file
  if (!echoValue && Array.isArray(comments) && comments.length > 0) {
    echoValue = String(comments[comments.length - 1].text || '')
  }

  if (isRealAccount && echoValue) {
    res.setHeader('X-Injection-Echo', String(echoValue).slice(0,300))
  }

  return {
    props: {
      transactions,
      users,
      comments,
      showCommentFeature: isRealAccount
    }
  }
}
