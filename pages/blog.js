import {useState, useEffect} from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
export default function Blog(){
  const [comments,setComments] = useState([])
  const [t,setT] = useState('')
  async function load(){
    const r = await fetch('/api/comments')
    const j = await r.json()
    setComments(j)
  }
  useEffect(()=>{load()},[])
  async function post(e){
    e.preventDefault()
    await fetch('/api/comments',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:t})})
    setT('')
    load()
  }
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <article className="bg-white p-6 rounded shadow">
          <h2 className="text-xl">Blog Bank Fiktif</h2>
          <p className="mt-2 text-gray-600">Pengumuman dan artikel palsu untuk mempercantik tampilan.</p>
          <section className="mt-4">
            <form onSubmit={post}>
              <input value={t} onChange={e=>setT(e.target.value)} className="border p-2 mr-2" placeholder="Tulis komentar..." />
              <button className="bg-blue-600 text-white px-3 py-1">Kirim</button>
            </form>
            <div className="mt-4">
              {comments.map((c,i)=>(
                <div key={i} className="border p-2 rounded mb-2">
                  {/* intentionally render without sanitization */}
                  <div dangerouslySetInnerHTML={{__html: c.text}} />
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
