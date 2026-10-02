import axios, { AxiosError } from 'axios';
import { config } from '@config/index';
import type { ApiError } from '@types';

const http = axios.create({
  baseURL: config.apiUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((request) => {
  const token = localStorage.getItem('skomma_access_token');
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status ?? 0;
    if (status === 401) {
      localStorage.removeItem('skomma_access_token');
      localStorage.removeItem('skomma_refresh_token');
    }
    return Promise.reject(error);
  },
);

export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    const statusCode = error.response?.status ?? 0;

    // Try to extract error message from different response formats
    if (responseData) {
      // Direct ApiError format with message property
      if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
        const apiError = responseData as ApiError;
        return {
          message: apiError.message,
          statusCode: apiError.statusCode || statusCode,
          errors: apiError.errors,
        };
      }

      // Check if it's a nested data structure (some APIs wrap in data)
      if (typeof responseData === 'object' && responseData !== null && 'data' in responseData) {
        const nestedData = responseData.data as unknown;
        if (typeof nestedData === 'object' && nestedData !== null && 'message' in nestedData) {
          const nestedError = nestedData as ApiError;
          return {
            message: nestedError.message,
            statusCode: nestedError.statusCode || statusCode,
            errors: nestedError.errors,
          };
        }
      }

      // Check for error property
      if (typeof responseData === 'object' && responseData !== null && 'error' in responseData) {
        const errorValue = (responseData as { error: unknown }).error;
        return {
          message: typeof errorValue === 'string' ? errorValue : 'Server error',
          statusCode,
        };
      }

      // If it's a string response
      if (typeof responseData === 'string') {
        return {
          message: responseData,
          statusCode,
        };
      }

      // If we have response data but can't parse it, try to use it as string
      if (typeof responseData === 'object' && responseData !== null) {
        try {
          const jsonString = JSON.stringify(responseData);
          if (jsonString.includes('message')) {
            const parsed = JSON.parse(jsonString);
            if (parsed.message) {
              return {
                message: parsed.message,
                statusCode: parsed.statusCode || statusCode,
                errors: parsed.errors,
              };
            }
          }
        } catch {
          // If JSON parsing fails, continue to fallback
        }
      }
    }

    // Fallback to axios error message
    return {
      message: error.message || 'Network error',
      statusCode,
    };
  }

  if (error instanceof Error) return { message: error.message, statusCode: 0 };
  return { message: 'Unknown error', statusCode: 0 };
}

export default http;
