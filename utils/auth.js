export function requireAuth(req){
  // simple mock auth check
  const auth = req.cookies?.auth || null
  if(!auth) throw new Error('Not authenticated')
  return true
}
