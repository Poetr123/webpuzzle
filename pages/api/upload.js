import nextConnect from 'next-connect'
import multer from 'multer'
import fs from 'fs'
const upload = multer({ dest: '/tmp/uploads' })
const handler = nextConnect()
handler.use(upload.single('file'))
handler.post((req,res)=>{
  // intentionally accept any file and echo filename; in real CTF you might move file to public
  res.json({ok:true, filename: req.file.originalname})
})
export const config = { api: { bodyParser: false } }
export default handler
