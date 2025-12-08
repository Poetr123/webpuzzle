import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
export default function Dashboard(){
  return (
    <div style={{maxWidth:900, margin:'24px auto', fontFamily:'system-ui, sans-serif'}}>
      <Header />
      <main style={{padding:20}}>
        <h2>Dashboard</h2>
        <p>Halo, ini area ringkasan akun Anda.</p>
        <ul>
          <li><Link href="/accounts/101"><a>Account BF-101</a></Link></li>
          <li><Link href="/accounts/102"><a>Account BF-102</a></Link></li>
        </ul>
        <p style={{marginTop:24}}>Tip: beberapa catatan lama mungkin ada di <code>/public/backup</code>.</p>
      </main>
      <Footer />
    </div>
  )
}
