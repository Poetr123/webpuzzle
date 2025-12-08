import fs from 'fs'
const PATH = './data/comments.json'
export default function handler(req,res){
  if(req.method === 'GET'){
    const comments = JSON.parse(fs.readFileSync(PATH,'utf8'))
    res.json(comments)
  } else if(req.method === 'POST'){
    const body = req.body || {}
    const comments = JSON.parse(fs.readFileSync(PATH,'utf8'))
    // intentionally no sanitization: stored XSS
    comments.push({text: body.text || ''})
    fs.writeFileSync(PATH, JSON.stringify(comments, null, 2))
    res.json({ok:true})
  } else res.status(405).end()
}
