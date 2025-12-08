import fs from 'fs'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
export default function Account({account}){
  if(!account) return <div>Not found</div>
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl">Account {account.id}</h2>
          <p>Nama: {account.name}</p>
          <p>Saldo: Rp{account.balance}</p>
          <div className="mt-4 text-sm text-gray-600">Catatan: {account.note}</div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export async function getServerSideProps(ctx){
  const {id} = ctx.params
  const accounts = JSON.parse(fs.readFileSync('./data/accounts.json','utf8'))
  const account = accounts.find(a=>a.id===id) || null
  // intentionally no auth check - IDOR challenge
  return {props:{account}}
}
