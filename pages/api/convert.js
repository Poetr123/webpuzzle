// simple fake convert API (red herring)
export default function handler(req,res){
  const {amount,from,to} = req.query
  // totally fake conversion - not used by flag logic
  const rate = 15000
  res.json({from,to,amount,converted: (Number(amount)||0)*rate})
}
