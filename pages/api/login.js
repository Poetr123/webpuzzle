import querystring from 'querystring'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed')
  }
  let body = ''
  req.on('data', (chunk) => { body += chunk })
  await new Promise(r => req.on('end', r))
  const parsed = querystring.parse(body)

  const username = String(parsed.username || '').trim() || 'guest'
  res.setHeader('Set-Cookie', `user=${encodeURIComponent(username)}; Path=/; HttpOnly`)
  res.writeHead(302, { Location: '/dashboard' })
  return res.end()
}
