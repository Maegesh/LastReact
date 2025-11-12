export interface BloodRequest {
  id: number;
  recipientId: number;
  recipientName?: string;
  hospitalName?: string;
  bloodGroupNeeded: string;
  quantity: number;
  requestDate: string;
  status: string;
  urgencyLevel?: string;
  doctorName?: string;
  contactNumber?: string;
  medicalReason?: string;
  requiredBy?: string;
}

export interface CreateBloodRequest {
  recipientId: number;
  bloodGroupNeeded: string;
  quantity: number;
  urgencyLevel?: string;
  hospitalName?: string;
  doctorName?: string;
  contactNumber?: string;
  medicalReason?: string;
  requiredBy?: string;
}