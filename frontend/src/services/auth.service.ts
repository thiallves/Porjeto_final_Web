import { api } from '@/src/lib/api';
import { saveSession } from '@/src/lib/storage';
import type { LoginResponse } from '@/src/types/api';

export async function login(email: string, password: string) {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  saveSession(data);
  return data;
}
