import { http } from './http';

export const recipientAPI = {
  getAll: () => http.get('/RecipientProfile'),
  getById: (id: number) => http.post('/RecipientProfile/get-by-id', { id }),
  getByUserId: (userId: number) => http.post('/RecipientProfile/get-by-user', { userId }),
  create: (data: any) => http.post('/RecipientProfile', data),
  update: (id: number, data: any) => http.post('/RecipientProfile/update', { id, ...data }),
  getOverview: (userId: number) => http.post('/Recipient/overview', { userId })
};