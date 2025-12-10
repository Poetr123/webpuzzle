export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Next.js API sudah mem-parse body (application/x-www-form-urlencoded or json)
    const { username = 'guest' } = req.body || {}

    const safeUser = String(username).trim() || 'guest'
    // Set cookie (HttpOnly) — Next.js allows setHeader here
    // Note: tidak menggunakan signed cookie untuk simplicity
    res.setHeader('Set-Cookie', `user=${encodeURIComponent(safeUser)}; Path=/; HttpOnly; SameSite=Lax`)

    // Redirect to dashboard using 302
    res.writeHead(302, { Location: '/dashboard' })
    return res.end()
  } catch (err) {
    console.error('login api error', err)
    return res.status(500).json({ error: 'internal' })
  }
}
