import { http } from './http';

export const appointmentAPI = {
  getAll: () => http.get('/Appointment'),
  getById: (id: number) => http.get(`/Appointment/${id}`),
  getByDonor: (donorId: number) => http.get(`/Appointment/donor/${donorId}`),
  getUpcoming: () => http.get('/Appointment/upcoming'),
  create: (data: any) => http.post('/Appointment', data),
  update: (id: number, data: any) => http.put(`/Appointment/${id}`, data),
  cancel: (id: number) => http.put(`/Appointment/${id}/cancel`)
};