import { http } from "./http"

export type LoginRequest = { email: string, password: string }
export type LoginResponse = {
    success: boolean;
    message?: string;
    token?: string; 
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        role: number;
    }
}

export type DonorSignupRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    contactNumber: string;
    bloodGroup: string;
    age: number;
    gender: string;
    lastDonationDate: string;
}

export type RecipientSignupRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    hospitalName: string;
    requiredBloodGroup: string;
    contactNumber: string;
}

export type SignupResponse = {
    message: string;
    id: number;
    email: string;
}

export async function getToken(req: LoginRequest): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>("/Auth/login", req)
    if (!data.success) {
        throw new Error(data.message || 'Login failed')
    }
    return data
}

export async function signupDonor(req: DonorSignupRequest): Promise<SignupResponse> {
    const { data } = await http.post<SignupResponse>("/Auth/signup/donor", req)
    return data
}

export async function signupRecipient(req: RecipientSignupRequest): Promise<SignupResponse> {
    const { data } = await http.post<SignupResponse>("/Auth/signup/recipient", req)
    return data
}

export const authAPI = {
    getToken,
    signupDonor,
    signupRecipient
}