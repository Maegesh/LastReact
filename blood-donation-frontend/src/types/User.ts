export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  phone?: string;
  role: number; // 0=Admin, 1=Donor, 2=Recipient
  profileImageUrl?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}