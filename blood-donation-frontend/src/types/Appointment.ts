export interface Appointment {
  id: number;
  donorId: number;
  donorName?: string;
  bloodGroup?: string;
  bloodBankId: number;
  bloodBankName?: string;
  appointmentDate: string;
  status: string;
  remarks?: string;
}

export interface CreateAppointment {
  donorId: number;
  bloodBankId: number;
  appointmentDate: string;
  remarks?: string;
}