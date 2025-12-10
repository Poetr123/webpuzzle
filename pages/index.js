import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'

export default function Home(){
  return (
    <div style={{maxWidth:900, margin:'24px auto', fontFamily:'system-ui, sans-serif'}}>
      <Header />
      <main style={{padding:20}}>
        <h1>Selamat datang di Bank Fiktif</h1>
        <p>Ini adalah simulasi situs perbankan untuk keperluan digital forensik.</p>

        <section style={{marginTop:20}}>
          <h3>Announcements</h3>
          <p>We are migrating payment gateways. See the blog for details.</p>
          <Link href="/blog"><a style={{color:'#4b0082'}}>Read more →</a></Link>
        </section>

        <section style={{marginTop:28, display:'flex', gap:16, alignItems:'center'}}>
          <div style={{flex:1}}>
            <h3>Quick actions</h3>
            <p style={{color:'#555'}}>Langsung ke fitur penting yang sering dicari pengguna.</p>
            <div style={{marginTop:12, display:'flex', gap:12}}>
              <Link href="/login">
                <a style={{
                  padding:'10px 14px',
                  borderRadius:8,
                  border:'1px solid #ddd',
                  textDecoration:'none'
                }}>Login</a>
              </Link>

              <Link href="/dashboard">
                <a style={{
                  padding:'10px 14px',
                  borderRadius:8,
                  border:'1px solid #ddd',
                  textDecoration:'none'
                }}>Dashboard</a>
              </Link>

              {/* Tombol baru agar mudah menemukan halaman transfer */}
              <Link href="/transfer">
                <a style={{
                  padding:'10px 14px',
                  borderRadius:8,
                  background:'#4b0082',
                  color:'white',
                  textDecoration:'none',
                  boxShadow:'0 4px 10px rgba(75,0,130,0.12)'
                }}>Transfer Antar Bank</a>
              </Link>
            </div>
          </div>

          <aside style={{width:300, padding:16, border:'1px solid #f0f0f0', borderRadius:8, background:'#fbfbfb'}}>
            <h4 style={{marginTop:0}}>Forensik tip</h4>
            <p style={{fontSize:13, color:'#666'}}>Folder backup dan response header pada endpoint API mungkin rahasia. File tersembunyi?</p>
            <p style={{fontSize:13, color:'#999', marginTop:6}}>Kacauu</p>
          </aside>
        </section>

      </main>
      <Footer />
    </div>
  )
}
