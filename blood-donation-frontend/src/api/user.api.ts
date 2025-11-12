import { http } from './http';

export const userAPI = {
  getAll: () => http.get('/User'),
  getById: (id: number) => http.get(`/User/${id}`),
  create: (data: any) => http.post('/User', data),
  update: (id: number, data: any) => http.put(`/User/${id}`, data),
  delete: (id: number) => http.delete(`/User/${id}`)
};