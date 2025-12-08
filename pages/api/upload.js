export const config = {
  api: { bodyParser: false }
}
export default function handler(req,res){
  // file upload endpoint (mock) - accepts but ignores content
  // This is purposely minimal: it does NOT allow arbitrary file writes.
  if(req.method === 'POST') {
    // decoy response that looks promising but is harmless
    res.status(200).json({status:'ok', note:'We received your file. Backup log: frag-06: "ke" '})
  } else {
    res.status(200).json({status:'ready'})
  }
}
