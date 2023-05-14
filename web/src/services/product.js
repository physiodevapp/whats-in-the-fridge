import http from './base-api'

const list = (pantryId) => http.get(`/pantries/${pantryId}/products`)

const create = (pantryId, product) => http.post(`/pantries/${pantryId}/products`, product)

const update = (pantryId, productId, product) => http.patch(`/pantries/${pantryId}/products/${productId}`, product)

const imgUpload = (pantryId, productId, formData) => http.post(`/pantries/${pantryId}/products/${productId}/upload`, formData)

const erase = (pantryId, productId) => http.delete(`/pantries/${pantryId}/products/${productId}`)

export default {
  list,
  create,
  update,
  imgUpload,
  erase
}