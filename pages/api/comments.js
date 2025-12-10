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
    // jika gagal baca/parse, return array kosong (jangan throw)
    return []
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const comments = await safeReadComments()
    return res.status(200).json(comments)
  }

  if (req.method === 'POST') {
    // support both application/json and application/x-www-form-urlencoded
    let author = 'anon'
    let text = ''

    try {
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        author = (req.body && req.body.author) || 'anon'
        text = (req.body && req.body.text) || ''
      } else {
        // urlencoded or others: try to parse body fields defensively
        author = (req.body && req.body.author) || req.query.author || 'anon'
        text = (req.body && req.body.text) || req.query.text || ''
      }
    } catch (e) {
      // fallback
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

    // Attempt to append to file, but never fail the request if write fails (Vercel readonly).
    try {
      const current = await safeReadComments()
      current.push(newComment)
      try {
        await writeFile(COMMENTS_PATH, JSON.stringify(current, null, 2), 'utf8')
      } catch (writeErr) {
        // write may fail on serverless FS; ignore but log for debugging
        console.warn('comments write failed:', writeErr && writeErr.message)
      }
    } catch (e) {
      // ignore read/write problems
    }

    // set cookie last_comment so SSR can echo reliably to the client who posted
    try {
      const cookieValue = encodeURIComponent(newComment.text)
      // short-lived cookie
      res.setHeader('Set-Cookie', `last_comment=${cookieValue}; Path=/; HttpOnly; Max-Age=300; SameSite=Lax`)
    } catch (e) {
      // ignore cookie set failure
    }

    return res.status(200).json({ success: true, newComment })
  }

  // unsupported methods
  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'method not allowed' })
}
