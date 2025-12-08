import fs from 'fs'
export default function handler(req,res){
  const {username,password} = req.body || {}
  const users = JSON.parse(fs.readFileSync('./data/users.json','utf8'))
  const u = users.find(x=> x.username===username && x.password===password)
  if(!u) return res.status(401).json({error:'Invalid'})
  res.setHeader('Set-Cookie', `session=${u.id}; Path=/; HttpOnly`)
  res.json({ok:true, user:u})
}
