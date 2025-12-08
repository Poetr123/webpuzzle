import Header from '../components/Header'
import Footer from '../components/Footer'
export default function Blog(){
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
      </main>
      <Footer />
    </div>
  )
}
