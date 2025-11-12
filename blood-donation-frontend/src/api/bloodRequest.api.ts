import { http } from "./http";

export const bloodRequestAPI = {
  getAll: () => http.get("/BloodRequest"),
  getById: (id: number) => http.get(`/BloodRequest/${id}`),
  getByBloodGroup: (bloodGroup: string) => http.get(`/BloodRequest/blood-group/${bloodGroup}`),
  getByRecipientId: (recipientId: number) => http.get(`/BloodRequest/recipient/${recipientId}`),
  create: (data: any) => http.post("/BloodRequest", data),
  update: (id: number, data: any) => http.put(`/BloodRequest/${id}`, data),
  delete: (id: number) => http.delete(`/BloodRequest/${id}`)
};