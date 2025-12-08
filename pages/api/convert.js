export default function handler(req,res){
  // convert endpoint - returns a subtle fragment inside JSON
  // Example: the fragment pieces are split across different resources.
  res.status(200).json({ok:true, hint:'frag-07: "lanJut"'})
}
