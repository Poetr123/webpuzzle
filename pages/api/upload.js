export const config = {
  api: { bodyParser: false }
}
export default function handler(req,res){
  
  if(req.method === 'POST') {
    
    res.status(200).json({status:'ok', note:'We received your file. Backup log: frag-06: "ke" '})
  } else {
    res.status(200).json({status:'ready'})
  }
}
