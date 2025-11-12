import { http } from "./http";

export const bloodBankAPI = {
  getAll: () => http.get("/BloodBank"),
  getById: (id: number) => http.get(`/BloodBank/${id}`),
  create: (data: any) => http.post("/BloodBank", data),
  update: (id: number, data: any) => http.put(`/BloodBank/${id}`, data),
  delete: (id: number) => http.delete(`/BloodBank/${id}`)
};