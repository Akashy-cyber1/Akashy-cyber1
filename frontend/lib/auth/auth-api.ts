import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiGet, apiPost } from "@/lib/api/client";
import { CurrentUserResponse, LoginResponse, RegisterResponse } from "./types";

export type RegisterInput = {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  business_name: string;
  business_type: string;
  phone: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export async function registerUser(payload: RegisterInput) {
  return apiPost<RegisterResponse, RegisterInput>(API_ENDPOINTS.register, payload);
}

export async function loginUser(payload: LoginInput) {
  return apiPost<LoginResponse, LoginInput>(API_ENDPOINTS.login, payload);
}

export async function fetchCurrentUser(token: string) {
  return apiGet<CurrentUserResponse>(API_ENDPOINTS.currentUser, token);
}

export async function logoutUser(refresh: string, token: string) {
  return apiPost<{ message: string }, { refresh: string }>(API_ENDPOINTS.logout, { refresh }, token);
}
