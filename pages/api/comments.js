import fs from 'fs'
import path from 'path'
export default function handler(req,res){
  // comments endpoint - decoy content
  const dataPath = path.join(process.cwd(),'data','comments.json')
  const raw = fs.readFileSync(dataPath,'utf8')
  res.status(200).json(JSON.parse(raw))
}
