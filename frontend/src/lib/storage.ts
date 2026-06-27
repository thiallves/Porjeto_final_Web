import type { LoginResponse, User } from '@/src/types/api';

export function saveSession(data: LoginResponse) {
  localStorage.setItem('barbearia_token', data.access_token);
  localStorage.setItem('barbearia_user', JSON.stringify(data.user));
}

export function getSessionUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('barbearia_user');
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('barbearia_token');
}

export function clearSession() {
  localStorage.removeItem('barbearia_token');
  localStorage.removeItem('barbearia_user');
}
