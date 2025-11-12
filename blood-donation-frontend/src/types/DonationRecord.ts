export interface DonationRecord {
  id: number;
  donorId: number;
  donorName?: string;
  bloodGroup?: string;
  bloodBankId: number;
  bloodBankName?: string;
  donationDate: string;
  quantity: number;
  status: string;
}

export interface CreateDonationRecord {
  donorId: number;
  bloodBankId: number;
  donationDate: string;
  quantity: number;
}