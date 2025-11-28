import { http } from './http';

export const donorAPI = {
  getAll: () => http.get('/DonorProfile'),
  getById: (id: number) => http.post('/DonorProfile/get-by-id', { id }),
  getByUserId: (userId: number) => http.post('/DonorProfile/get-by-user', { userId }),
  getByBloodGroup: (bloodGroup: string) => http.post('/DonorProfile/get-by-blood-group', { bloodGroup }),
  getOverview: (userId: number) => http.post('/DonorProfile/overview', { userId }),
  create: (data: any) => http.post('/DonorProfile', data),
  update: (id: number, data: any) => http.post('/DonorProfile/update', { id, ...data })
};