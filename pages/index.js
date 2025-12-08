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
        <section>
          <h3>Announcements</h3>
          <p>We are migrating payment gateways. See the blog for details.</p>
          <Link href="/blog"><a>Read more →</a></Link>
        </section>
        <section style={{marginTop:20}}>
          <h3>Quick links</h3>
          <Link href="/login"><a>Login</a></Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
