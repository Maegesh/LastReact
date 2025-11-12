import { http } from './http';

export const bloodStockAPI = {
  getAll: () => http.get('/BloodStock'),
  getById: (id: number) => http.get(`/BloodStock/${id}`),
  getByBloodGroup: (bloodGroup: string) => http.get(`/BloodStock/blood-group/${bloodGroup}`),
  create: (data: any) => http.post('/BloodStock', data),
  update: (id: number, data: any) => http.put(`/BloodStock/${id}`, data)
};