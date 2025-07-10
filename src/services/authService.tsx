import api from "../api/api";
import type { LoginDto, LoginResponse } from "../interfaces/auth";

export interface RegisterDto {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export const registerUser = async (data: RegisterDto) => {
  const response = await api.post("/User/Register", data);
  return response;
};

// src/api/api.ts
export const loginUser = async (data: LoginDto): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/User/Login", data);
  return response.data;
};