export const API_URL = import.meta.env.VITE_API_URL || '/api';

export function getAuthToken() {
  return localStorage.getItem('campcraft_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('campcraft_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('campcraft_token');
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || `API Error: ${response.status}`);
  }

  return response.json();
}
