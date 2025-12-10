// pages/api/comments.js
import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  const dataPath = path.join(process.cwd(), 'data', 'comments.json')

  if (req.method === 'GET') {
    try {
      const raw = fs.readFileSync(dataPath, 'utf8')
      return res.status(200).json(JSON.parse(raw))
    } catch (e) {
      return res.status(200).json([])
    }
  }

  if (req.method === 'POST') {
    try {
      const { author, text } = req.body || {}
      if (!text) return res.status(400).json({ error: 'invalid text' })

      // create new comment
      const newComment = {
        id: Date.now(),
        author: author || 'anon',
        text: String(text)
      }

      // try append to file (may not persist on Vercel — that's fine)
      try {
        const raw = fs.readFileSync(dataPath, 'utf8')
        const arr = JSON.parse(raw)
        arr.push(newComment)
        fs.writeFileSync(dataPath, JSON.stringify(arr, null, 2), 'utf8')
      } catch (e) {
        // ignore write errors on read-only platforms
      }

      // Set cookie so SSR can echo this comment reliably for the client who posted it
      // HttpOnly so JS cannot read it; Path=/ so dashboard can access it in server-side
      const cookieValue = encodeURIComponent(newComment.text)
      // expire short-lived (5 minutes)
      res.setHeader('Set-Cookie', `last_comment=${cookieValue}; Path=/; HttpOnly; Max-Age=300; SameSite=Lax`)

      return res.status(200).json({ success: true, newComment })
    } catch (err) {
      return res.status(500).json({ error: 'server error' })
    }
  }

  return res.status(405).json({ error: 'method not allowed' })
}
