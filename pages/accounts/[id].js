import Header from '../../components/Header'
import Footer from '../../components/Footer'
import fs from 'fs'
import path from 'path'
export default function Account({account, hiddenNote}){
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
      </main>
      <Footer />
    </div>
  )
}

export async function getServerSideProps({params}){
  const dataPath = path.join(process.cwd(),'data','accounts.json')
  const raw = fs.readFileSync(dataPath,'utf8')
  const all = JSON.parse(raw).accounts
  const account = all.find(a=>String(a.id) === params.id) || null


  let hiddenNote = "frag-03: in the API comments";
  if(params.id === '102') hiddenNote = "dan chat";

  return { props: { account, hiddenNote } }
}
