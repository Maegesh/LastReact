import { http } from './http';

export const recipientAPI = {
  getAll: () => http.get('/RecipientProfile'),
  getById: (id: number) => http.get(`/RecipientProfile/${id}`),
  getByUserId: (userId: number) => http.get(`/RecipientProfile/user/${userId}`),
  create: (data: any) => http.post('/RecipientProfile', data),
  update: (id: number, data: any) => http.put(`/RecipientProfile/${id}`, data)
};