import Header from '../components/Header'
import Footer from '../components/Footer'
import fs from 'fs'
export default function Dashboard({user}){
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl">Dashboard</h2>
          <p className="mt-2">Halo, {user ? user.username : 'tamu'}. Coba jelajahi situs untuk menemukan petunjuk.</p>
        </section>
      </main>
      <Footer />
    </>
  )
}

export async function getServerSideProps({req}){
  // simplistic session read from cookie
  const cookie = req.headers.cookie || ''
  const match = cookie.match(/session=(u\d+)/)
  let user = null
  if(match){
    const id = match[1]
    const users = JSON.parse(fs.readFileSync('./data/users.json','utf8'))
    user = users.find(u=>u.id===id) || null
  }
  return {props:{user}}
}
