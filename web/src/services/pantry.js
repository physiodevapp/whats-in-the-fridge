import http from './base-api'

const list = () => http.get(`/pantries/my-pantries`)

const detail = (pantryId) => http.get(`/pantries/${pantryId}`)

const create = (pantry) => http.post(`/pantries`, pantry)

const invite = (pantryId, data) => http.post(`/pantries/${pantryId}/invite`, data)

const join = (pantryId, data) => http.post(`/pantries/${pantryId}/join`, data)

const showNear = (pantryId, distance) => http.get(`/pantries/${pantryId}/near?distance=${distance}`)

export default {
  list,
  detail,
  create,
  invite,
  join,
  showNear
}