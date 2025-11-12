export interface BloodStock {
  id: number;
  bloodBankId: number;
  bloodBankName?: string;
  bloodGroup: string;
  unitsAvailable: number;
  lastUpdated: string;
  availabilityStatus?: string;
}

export interface UpdateBloodStock {
  bloodBankId: number;
  bloodGroup: string;
  unitsAvailable: number;
}