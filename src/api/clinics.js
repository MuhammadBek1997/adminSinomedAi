import api from './axios'

export const getClinics = () => api.get('/system-admin/clinics')

// Klinika va asosiy operatorni bitta so'rovda yaratadi
export const createClinicWithAdmin = (data) => api.post('/system-admin/clinics', data)

export const deleteClinic = (id) => api.delete(`/system-admin/clinics/${id}`)

export const getClinicAdmins = (clinicId) =>
  api.get(`/system-admin/clinics/${clinicId}/admins`)
