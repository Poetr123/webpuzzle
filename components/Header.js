import Link from 'next/link'
export default function Header(){
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bank Fiktif</h1>
          <div className="text-xs text-gray-500">Solusi perbankan modern</div>
        </div>
        <nav>
          <Link href="/"><a className="mr-4">Home</a></Link>
          <Link href="/blog"><a className="mr-4">Blog</a></Link>
          <Link href="/login"><a>Login</a></Link>
        </nav>
      </div>
    </header>
  )
}
