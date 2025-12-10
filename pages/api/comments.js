import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const dataPath = path.join(process.cwd(), 'data', 'comments.json')

  if (req.method === 'GET') {
    try {
      const raw = fs.readFileSync(dataPath, 'utf8')
      return res.status(200).json(JSON.parse(raw))
    } catch (e) {
      return res.status(500).json({ error: 'could not read comments' })
    }
  }

  if (req.method === 'POST') {
    try {
      let all = []
      try {
        const raw = fs.readFileSync(dataPath, 'utf8')
        all = JSON.parse(raw)
      } catch (e) {
        all = []
      }

      const { author, text } = req.body
      if (!text) return res.status(400).json({ error: 'invalid text' })

      const newComment = {
        id: Date.now(),
        author: author || 'anon',
        text: text
      }

      all.push(newComment)

      try {
        fs.writeFileSync(dataPath, JSON.stringify(all, null, 2), 'utf8')
      } catch (e) {
      }

      return res.status(200).json({ success: true, newComment })

    } catch (err) {
      return res.status(500).json({ error: 'server error' })
    }
  }

  return res.status(405).json({ error: 'method not allowed' })
}
