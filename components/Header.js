import Link from 'next/link'
export default function Header(){ 
  return (
    <header style={{padding:'18px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <div style={{fontWeight:700}}>Bank Fiktif</div>
      <nav>
        <Link href="/"><a style={{marginRight:12}}>Home</a></Link>
        <Link href="/login"><a style={{marginRight:12}}>Login</a></Link>
        <Link href="/dashboard"><a style={{marginRight:12}}>Dashboard</a></Link>
        <Link href="/blog"><a>News</a></Link>
      </nav>
    </header>
  )
}
