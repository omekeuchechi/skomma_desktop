export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Array<{ field?: string; message: string }>;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  displayName: string;
}

export interface WorldState {
  loadingProgress: number;
  currentChunk: string;
  status: 'idle' | 'generating' | 'streaming' | 'ready';
}
