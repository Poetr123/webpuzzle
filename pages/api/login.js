import fs from 'fs'
import path from 'path'
export default function handler(req,res){
  // mock login processing; never store real credentials in production
  if(req.method === 'POST'){
    // intentionally shallow handling for demo
    res.setHeader('Set-Cookie','auth=1; Path=/; HttpOnly')
    res.writeHead(302, { Location: '/dashboard' })
    return res.end()
  }
  res.status(200).json({status:'ok'})
}
