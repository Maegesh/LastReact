import { http } from './http';

export const donationAPI = {
  getAll: () => http.get('/DonationRecord'),
  getById: (id: number) => http.get(`/DonationRecord/${id}`),
  getByDonor: (donorId: number) => http.get(`/DonationRecord/donor/${donorId}`),
  create: (data: any) => http.post('/DonationRecord', data)
};