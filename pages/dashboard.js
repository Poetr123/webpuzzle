export async function getServerSideProps({ req, res }) {
  const fs = require('fs')
  const path = require('path')

  const cookieHeader = req.headers.cookie || ''
  const cookies = cookieHeader.split(';').map(s => s.trim()).reduce((acc, cur) => {
    if (!cur) return acc
    const idx = cur.indexOf('=')
    if (idx === -1) return acc
    acc[cur.slice(0, idx)] = cur.slice(idx + 1)
    return acc
  }, {})
  let echoValue = null
  if (cookies.last_comment) {
    try {
      echoValue = decodeURIComponent(cookies.last_comment)
      res.setHeader('Set-Cookie', `last_comment=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`)
    } catch (e) {
      echoValue = String(cookies.last_comment)
      res.setHeader('Set-Cookie', `last_comment=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`)
    }
  }

  const commentsPath = path.join(process.cwd(), 'data', 'comments.json')
  let comments = []
  try { comments = JSON.parse(fs.readFileSync(commentsPath, 'utf8')) || [] } catch(e){ comments = [] }

  if (!echoValue && Array.isArray(comments) && comments.length > 0) {
    echoValue = String(comments[comments.length - 1].text || '')
  }

  const isRealAccount =  false


  if (isRealAccount && echoValue) {
    res.setHeader('X-Injection-Echo', String(echoValue).slice(0, 300))
  }

  return {
    props: {
    }
  }
}
