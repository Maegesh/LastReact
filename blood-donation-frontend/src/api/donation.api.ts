import { http } from './http';

export const donationAPI = {
  getAll: () => http.get('/DonationRecord'),
  getById: (id: number) => http.post('/DonationRecord/get-by-id', { id }),
  getByDonor: (donorId: number) => http.post('/DonationRecord/get-by-donor', { donorId }),
  create: (data: any) => http.post('/DonationRecord', data)
};