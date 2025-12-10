// pages/dashboard.js
import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
            // intentionally unsanitized for CTF effect
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
                    &nbsp;• Rp {Number(tx.amount || 0).toLocaleString()} &nbsp;
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


// server-side props: read server data and leak secret only when triggered
export async function getServerSideProps({ req, res }) {
  const fs = require('fs')
  const path = require('path')

  // parse cookies into map
  const cookieHeader = req.headers.cookie || ''
  const cookies = cookieHeader.split(';').map(s => s.trim()).reduce((acc, cur) => {
    if (!cur) return acc
    const idx = cur.indexOf('=')
    if (idx === -1) return acc
    acc[cur.slice(0, idx)] = cur.slice(idx + 1)
    return acc
  }, {})

  // prioritize last_comment cookie (trigger set by POST /api/comments)
  let lastCommentCookie = null
  if (cookies.last_comment) {
    try {
      lastCommentCookie = decodeURIComponent(cookies.last_comment)
    } catch (e) {
      lastCommentCookie = String(cookies.last_comment)
    }
    // clear cookie so it won't leak repeatedly
    res.setHeader('Set-Cookie', `last_comment=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`)
  }

  // safe read helper
  const safeReadJson = (p) => {
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8'))
    } catch (e) {
      return null
    }
  }

  // read data files (flexible)
  const accountsPath = path.join(process.cwd(), 'data', 'accounts.json')
  const usersPath = path.join(process.cwd(), 'data', 'users.json')
  const commentsPath = path.join(process.cwd(), 'data', 'comments.json')
  const txPath = path.join(process.cwd(), 'data', 'transactions.json')
  const secretPath = path.join(process.cwd(), 'data', 'secret.json')

  let accounts = []
  let usersRaw = []
  let comments = []
  let transactions = []
  let secret = {}

  const aRaw = safeReadJson(accountsPath)
  if (aRaw) accounts = Array.isArray(aRaw) ? aRaw : (aRaw.accounts || [])

  const uRaw = safeReadJson(usersPath)
  if (uRaw) usersRaw = Array.isArray(uRaw) ? uRaw : (uRaw.users || [])

  const cRaw = safeReadJson(commentsPath)
  if (Array.isArray(cRaw)) comments = cRaw

  const tRaw = safeReadJson(txPath)
  if (Array.isArray(tRaw)) transactions = tRaw

  const sRaw = safeReadJson(secretPath)
  if (sRaw && typeof sRaw === 'object') secret = sRaw

  // determine user from cookie (raw)
  const rawUser = cookies.user || ''
  const norm = s => String(s || '').toLowerCase().trim()
  const unameNorm = norm(rawUser)

  // flexible matching against accounts and users
  const isAccountMatch = accounts.find(acc => {
    const cands = [acc.id, acc.number, acc.accountNumber, acc.username, acc.owner, acc.name].filter(Boolean)
    return cands.some(c => norm(c) === unameNorm || String(c) === String(rawUser))
  })

  const isUserMatch = usersRaw.find(u => {
    const cands = [u.username, u.name, u.id].filter(Boolean)
    return cands.some(c => norm(c) === unameNorm || String(c) === String(rawUser))
  })

  const isRealAccount = Boolean(isAccountMatch || isUserMatch)

  // fallback echoValue from file comments if last_comment cookie not present
  let echoValue = null
  if (lastCommentCookie) {
    echoValue = String(lastCommentCookie)
  } else if (Array.isArray(comments) && comments.length > 0) {
    echoValue = String(comments[comments.length - 1].text || '')
  }

  // -- LEAK SECRET HERE (server-side) --
  // Only leak server-side secret if:
  // 1) request from a "real" account, AND
  // 2) there was a trigger (lastCommentCookie exists)
  if (isRealAccount && lastCommentCookie) {
    // secret file should contain fragF and fragH, e.g. { "fragF": "l4nJut", "fragH": "5t3p 13eriKutny4" }
    const fragF = (secret.fragF && String(secret.fragF)) || ''
    const fragH = (secret.fragH && String(secret.fragH)) || ''
    if (fragF || fragH) {
      const combined = `${fragF}${fragF && fragH ? ' ke ' : ''}${fragH}`.slice(0, 300)
      res.setHeader('X-Injection-Echo', combined)
    }
  }

  return {
    props: {
      transactions,
      users: { users: usersRaw },
      comments,
      showCommentFeature: isRealAccount
    }
  }
}
