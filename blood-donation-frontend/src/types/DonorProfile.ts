export interface DonorProfile {
  id: number;
  userId: number;
  userName: string;
  bloodGroup: string;
  age: number;
  gender: string;
  lastDonationDate?: string;
  eligibilityStatus: boolean;
}

export interface CreateDonorProfile {
  userId: number;
  bloodGroup: string;
  age: number;
  gender: string;
}

export interface UpdateDonorProfile {
  firstName?: string;
  lastName?: string;
  bloodGroup: string;
  age: number;
  gender: string;
}