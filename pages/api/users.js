import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const p = path.join(process.cwd(), 'data', 'users.json')
  try {
    const raw = fs.readFileSync(p, 'utf8')
    const users = JSON.parse(raw)
    const q = (req.query.q || '').toLowerCase()
    if (q) {
      const filtered = users.users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
      )
      return res.status(200).json({ users: filtered })
    }
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ error: 'failed to read users' })
  }
}
