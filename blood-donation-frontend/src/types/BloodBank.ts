export interface BloodBank {
  id: number;
  name: string;
  location: string;
  contactNumber: string;
  email: string;
  capacity: number;
  managedBy?: string;
}

export interface CreateBloodBank {
  name: string;
  location: string;
  contactNumber: string;
  email: string;
  capacity: number;
  managedBy?: string;
}