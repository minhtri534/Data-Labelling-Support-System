import api from '../lib/axios';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  identifyNumber?: string;
  gender?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  fullName: string;
}

export interface ServiceResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export const authService = {
  async register(data: RegisterRequest): Promise<ServiceResponse<AuthResponse>> {
    const response = await api.post<ServiceResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  }
};
