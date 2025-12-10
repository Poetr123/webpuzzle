// pages/api/comments.js
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const COMMENTS_PATH = path.join(process.cwd(), 'data', 'comments.json')

async function safeReadComments() {
  try {
    const raw = await readFile(COMMENTS_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const comments = await safeReadComments()
    return res.status(200).json(comments)
  }

  if (req.method === 'POST') {
    let author = 'anon'
    let text = ''

    try {
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        author = (req.body && req.body.author) || 'anon'
        text = (req.body && req.body.text) || ''
      } else {
        author = (req.body && req.body.author) || req.query.author || 'anon'
        text = (req.body && req.body.text) || req.query.text || ''
      }
    } catch (e) {
      return res.status(400).json({ error: 'invalid body' })
    }

    if (!text || String(text).trim() === '') {
      return res.status(400).json({ error: 'empty text' })
    }

    const newComment = {
      id: Date.now(),
      author: String(author),
      text: String(text)
    }

    try {
      const current = await safeReadComments()
      current.push(newComment)
      try {
        await writeFile(COMMENTS_PATH, JSON.stringify(current, null, 2), 'utf8')
      } catch (writeErr) {
        console.warn('comments write failed:', writeErr && writeErr.message)
      }
    } catch (e) {
      // ignore
    }

    try {
      const cookieValue = encodeURIComponent(newComment.text)
      res.setHeader('Set-Cookie', `last_comment=${cookieValue}; Path=/; HttpOnly; Max-Age=300; SameSite=Lax`)
    } catch (e) {}

    return res.status(200).json({ success: true, newComment })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'method not allowed' })
}
