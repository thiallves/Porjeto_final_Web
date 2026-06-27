import { api } from '@/src/lib/api';
import { cleanParams } from '@/src/data/cleanParams';
import type { Appointment, AppointmentStatus, ListParams, Paginated } from '@/src/types/api';

export type AppointmentPayload = {
  userId?: number;
  serviceId: number;
  barbershopId: number;
  barberId?: number;
  date: string;
};

export async function listAppointments(params: ListParams) {
  const { data } = await api.get<Paginated<Appointment>>('/appointments', { params: cleanParams(params) });
  return data;
}
export async function createAppointment(payload: AppointmentPayload) {
  const { data } = await api.post<Appointment>('/appointments', payload);
  return data;
}
export async function cancelAppointment(id: number) {
  const { data } = await api.patch<Appointment>(`/appointments/${id}/cancel`);
  return data;
}
export async function updateAppointmentStatus(id: number, status: AppointmentStatus) {
  const { data } = await api.patch<Appointment>(`/appointments/${id}/status`, { status });
  return data;
}
