export interface RecipientProfile {
  id: number;
  userId: number;
  hospitalName: string;
  patientName: string;
  requiredBloodGroup: string;
  contactNumber: string;
  emergencyContact?: string;
  medicalHistory?: string;
}

export interface CreateRecipientProfile {
  userId: number;
  hospitalName: string;
  patientName: string;
  requiredBloodGroup: string;
  contactNumber: string;
  emergencyContact?: string;
  medicalHistory?: string;
}