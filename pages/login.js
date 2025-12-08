import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'
export default function Login(){
  const [u,setU]=useState(''); const [p,setP]=useState('');
  return (
    <div style={{maxWidth:700, margin:'24px auto', fontFamily:'system-ui, sans-serif'}}>
      <Header />
      <main style={{padding:20}}>
        <h2>Login Pelanggan</h2>
        <form method="POST" action="/api/login">
          <label>Username<br/><input name="username" defaultValue={u} onChange={e=>setU(e.target.value)} /></label><br/>
          <label>Password<br/><input type="password" name="password" defaultValue={p} onChange={e=>setP(e.target.value)} /></label><br/>
          <button type="submit">Masuk</button>
        </form>
        <p style={{marginTop:18, color:'#666'}}>Jika lupa, kunjungi halaman bantuan.</p>
      </main>
      <Footer />
    </div>
  )
}
