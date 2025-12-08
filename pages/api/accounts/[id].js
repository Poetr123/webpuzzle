import fs from 'fs'
export default function handler(req,res){
  const {id} = req.query
  const accounts = JSON.parse(fs.readFileSync('./data/accounts.json','utf8'))
  const a = accounts.find(x=> x.id===id)
  if(!a) return res.status(404).json({error:'not found'})
  // intentionally returns any account if you know the id
  res.json(a)
}
