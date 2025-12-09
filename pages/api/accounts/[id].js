import Header from '../../components/Header'
import Footer from '../../components/Footer'
import fs from 'fs'
import path from 'path'

export default function Account({ account, hiddenNote, transactions }) {
  return (
    <div style={{maxWidth:900, margin:'24px auto', fontFamily:'system-ui, sans-serif'}}>
      <Header />
      <main style={{padding:20}}>
        <h2>Detail akun {account?.number}</h2>
        <p>Nama pemilik: {account?.owner}</p>
        <p>Saldo: Rp {account?.balance?.toLocaleString()}</p>
        <div style={{marginTop:20, padding:12, background:'#f8f8f8', borderRadius:6}}>
          <strong>Catatan transaksi</strong>
          <p style={{color:'#444'}}>{hiddenNote}</p>
        </div>

        <section style={{marginTop:20}}>
          <h3>Riwayat Transaksi Terkait</h3>
          {transactions.length === 0 ? <p>Tidak ada transaksi untuk akun ini.</p> : (
            <ul>
              {transactions.map(tx => (
                <li key={tx.id}>
                  <strong>{tx.from}</strong> → <strong>{tx.to}</strong> • Rp {tx.amount.toLocaleString()} <em style={{color:'#666'}}>({tx.note})</em>
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

export async function getServerSideProps({ params }) {
  const dataPath = path.join(process.cwd(), 'data', 'accounts.json')
  const raw = fs.readFileSync(dataPath, 'utf8')
  const all = JSON.parse(raw).accounts
  const account = all.find(a => String(a.id) === params.id) || null

  const tPath = path.join(process.cwd(), 'data', 'transactions.json')
  const tRaw = fs.readFileSync(tPath, 'utf8')
  const allTx = JSON.parse(tRaw)

  const txs = allTx.filter(tx => tx.from === account?.number || tx.to === account?.number)

  let hiddenNote = "frag-03: in the API comments";
  if (params.id === '102') hiddenNote = "Berhasil melakukan transfer ke: 708708017";

  return { props: { account, hiddenNote, transactions: txs } }
}
