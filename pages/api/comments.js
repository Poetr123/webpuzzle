import fs from 'fs'
import path from 'path'
export default function handler(req,res){
  const dataPath = path.join(process.cwd(),'data','comments.json')
  try {
    const raw = fs.readFileSync(dataPath,'utf8')
    res.status(200).json(JSON.parse(raw))
  } catch (e) {
    res.status(500).json({ error: 'could not read comments' })
  }
}
