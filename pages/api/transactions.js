import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const p = path.join(process.cwd(), 'data', 'transactions.json')
  try {
    const raw = fs.readFileSync(p, 'utf8')
    const transactions = JSON.parse(raw)
    res.status(200).json(transactions)
  } catch (err) {
    res.status(500).json({ error: 'failed to read transactions' })
  }
}
