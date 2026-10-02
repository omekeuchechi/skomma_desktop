import http from '@network/http';
import type { ApiResponse, AuthTokens, LoginInput, RegisterInput, User } from '@types';

export async function login(input: LoginInput): Promise<AuthTokens> {
  const response = await http.post<ApiResponse<AuthTokens>>('/auth/login', input);
  return response.data.data;
}

export async function register(input: RegisterInput): Promise<User> {
  const response = await http.post<ApiResponse<User>>('/auth/register', input);
  return response.data.data;
}

export async function fetchMe(): Promise<User> {
  const response = await http.get<ApiResponse<User>>('/users/me');
  return response.data.data;
}

export async function healthCheck(): Promise<ApiResponse<Record<string, unknown>>> {
  const response = await http.get<ApiResponse<Record<string, unknown>>>('/health');
  return response.data;
}
