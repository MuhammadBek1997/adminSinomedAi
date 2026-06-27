import api from './axios'

export const login = (username, password) =>
  api.post('/auth/system-admin/login', { username, password })
