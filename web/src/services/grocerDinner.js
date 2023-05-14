import http from './base-api'

const login = (grocerdinner) => http.post('/login', grocerdinner)

const get = (grocerDinnerId) => http.get(`/grocerdinners/${grocerDinnerId}`)

export default {
  login,
  get
}