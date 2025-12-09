import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'

export default function Blog(){
  const [comments, setComments] = useState([])

  useEffect(()=>{
    fetch('/api/comments').then(r=>r.json()).then(j=>setComments(j || []))
  },[])

  return (
    <div style={{maxWidth:900, margin:'24px auto', fontFamily:'system-ui, sans-serif'}}>
      <Header />
      <main style={{padding:20}}>
        <h2>Berita & Pengumuman</h2>
        <article>
          <h3>Gateway migration</h3>
          <p>We are migrating systems this Q4. Details are in the backup files.</p>
        </article>

        <article style={{marginTop:18}}>
          <h3>Security report</h3>
          <p>Tim menemukan anomali pada trafik lama. Check logs and backups.</p>
        </article>

        <section style={{marginTop:18}}>
          <h3>Komentar Pengunjung</h3>
          {comments.length === 0 ? <p>Tidak ada komentar.</p> : (
            <ul>
              {comments.map(c=>(
                <li key={c.id} style={{marginBottom:8}}>
                  <strong>{c.author}</strong>: {c.text}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
