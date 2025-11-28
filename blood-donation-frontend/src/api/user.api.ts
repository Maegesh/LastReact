import { http } from './http';

export const userAPI = {
  getAll: () => http.get('/User'),
  getById: (id: number) => http.post('/User/get-by-id', { userId: id }),
  create: (data: any) => http.post('/User', data),
  update: (id: number, data: any) => http.put(`/User/${id}`, data),
  delete: (id: number) => http.post('/User/delete', { userId: id })
};