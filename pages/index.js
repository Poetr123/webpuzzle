import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
export default function Home(){
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold">Selamat datang di Bank Fiktif</h2>
          <p className="mt-2 text-gray-600">Sebuah bank modern — untuk latihan CTF.</p>
          <div className="mt-4">
            <Link href="/login"><a>Login ke akun</a></Link>
          </div>
        </section>

        <section className="mt-6 bg-white p-6 rounded shadow">
          <h3>Berita terbaru</h3>
          <p className="text-sm text-gray-500">Kunjungi halaman blog untuk melihat pengumuman.</p>
          <div className="mt-2"><Link href="/blog"><a>Buka Blog</a></Link></div>
        </section>
      </main>
      <Footer />
    </>
  )
}
