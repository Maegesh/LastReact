import { http } from "./http";

export const bloodRequestAPI = {
  getAll: () => http.get("/BloodRequest"),
  getById: (id: number) => http.post("/BloodRequest/get-by-id", { id }),
  getByBloodGroup: (bloodGroup: string) => http.post("/BloodRequest/get-by-blood-group", { bloodGroup }),
  getByRecipientId: (recipientId: number) => http.post("/BloodRequest/get-by-recipient", { recipientId }),
  create: (data: any) => http.post("/BloodRequest", data),
  update: (id: number, data: any) => http.put(`/BloodRequest/${id}`, data),
  updateStatus: (id: number, status: string) => http.post("/BloodRequest/update-status", { id, status }),
  delete: (id: number) => http.post("/BloodRequest/delete", { id }),
  donorResponse: (id: number, response: 'accept' | 'decline', donorId: number) => 
    http.post(`/BloodRequest/${id}/donor-response`, { response, donorId })
};