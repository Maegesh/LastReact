import { http } from './http';

export const donorAPI = {
  getAll: () => http.get('/DonorProfile'),
  getById: (id: number) => http.get(`/DonorProfile/${id}`),
  getByUserId: (userId: number) => http.get(`/DonorProfile/user/${userId}`),
  getByBloodGroup: (bloodGroup: string) => http.get(`/DonorProfile/blood-group/${bloodGroup}`),
  create: (data: any) => http.post('/DonorProfile', data),
  update: (id: number, data: any) => http.put(`/DonorProfile/${id}`, data)
};