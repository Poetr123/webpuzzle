import fs from 'fs'
export function getUserById(id){
  const users = JSON.parse(fs.readFileSync('./data/users.json','utf8'))
  return users.find(u=>u.id===id)
}
export function findUser(username,password){
  const users = JSON.parse(fs.readFileSync('./data/users.json','utf8'))
  return users.find(u=>u.username===username && u.password===password)
}
