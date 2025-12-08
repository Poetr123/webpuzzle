import fs from 'fs'
import path from 'path'
export default function handler(req,res){
  // Return account info. Also include a tiny hidden hint in a response header.
  const id = req.query.id
  const dataPath = path.join(process.cwd(),'data','accounts.json')
  const raw = fs.readFileSync(dataPath,'utf8')
  const all = JSON.parse(raw).accounts
  const acc = all.find(a=>String(a.id) === String(id)) || null
  // header fragment (hidden in response headers): frag-05: in-header:"inG1n"
  res.setHeader('X-Backup-Note','frag-05: in-header:"inG1n"')
  if(!acc) return res.status(404).json({error:'not found'})
  res.status(200).json(acc)
}
