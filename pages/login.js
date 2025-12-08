import {useState} from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
export default function Login(){
  const [u,setU]=useState('alice'), [p,setP]=useState('alice123'), [m,setM]=useState('')
  async function submit(e){
    e.preventDefault()
    const r = await fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username:u,password:p})})
    const j = await r.json()
    if(!r.ok) setM('Login gagal')
    else setM('Login sukses - coba akses /dashboard atau /accounts/a200')
  }
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl">Login</h2>
          <form onSubmit={submit} className="mt-4">
            <input value={u} onChange={e=>setU(e.target.value)} className="border p-2 mr-2" />
            <input value={p} onChange={e=>setP(e.target.value)} className="border p-2 mr-2" />
            <button className="bg-blue-600 text-white px-4 py-2">Login</button>
          </form>
          <div className="mt-2 text-sm text-red-600">{m}</div>
          <div className="mt-4 text-xs text-gray-500">Creds sample: alice/alice123, support/supportme, admin/admin123</div>
        </section>
      </main>
      <Footer />
    </>
  )
}
