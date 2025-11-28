import { http } from './http';

export const dashboardAPI = {
  getCounts: () => http.get('/Dashboard/counts'),
  getOverview: () => http.get('/Dashboard/overview')
};