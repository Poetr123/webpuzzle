import Header from '../components/Header'
import Footer from '../components/Footer'
export default function Transfer(){
  return (
    <div style={{maxWidth:900, margin:'24px auto', fontFamily:'system-ui, sans-serif'}}>
      <Header />
      <main style={{padding:20}}>
        <h2>Transfer Antar Bank</h2>
        <p>Gunakan form berikut untuk membuat transfer.</p>
        <form method="POST" action="/api/convert" encType="application/x-www-form-urlencoded">
          <label>From account<input name="from" /></label><br/>
          <label>To account<input name="to" /></label><br/>
          <label>Amount<input name="amount" /></label><br/>
          <button type="submit">Kirim</button>
        </form>
        <p style={{marginTop:12, color:'#666'}}>Catatan: interface ini hanya demo.</p>
      </main>
      <Footer />
    </div>
  )
}
