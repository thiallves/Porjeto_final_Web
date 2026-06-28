import { api } from '@/src/lib/api';
import { cleanParams } from '@/src/data/cleanParams';

export type WorkSchedule = {
  id: number;
  professionalId: number;
  barbershopId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type WorkSchedulePayload = {
  professionalId: number;
  barbershopId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
};

export type WorkScheduleListParams = {
  page?: number;
  limit?: number;
  professionalId?: string;
  barbershopId?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  isActive?: string;
  professionalName?: string;
  professionalEmail?: string;
};

export type ProfessionalOption = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  specialty?: string;
  barbershopId?: number;
  isActive?: boolean;
};

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
};

export async function listWorkSchedules(params: WorkScheduleListParams) {
  const { data } = await api.get<Paginated<WorkSchedule>>('/work-schedules', {
    params: cleanParams(params),
  });

  return data;
}

export async function createWorkSchedule(payload: WorkSchedulePayload) {
  const { data } = await api.post<WorkSchedule>('/work-schedules', payload);
  return data;
}

export async function updateWorkSchedule(
  id: number,
  payload: Partial<WorkSchedulePayload>,
) {
  const { data } = await api.patch<WorkSchedule>(
    `/work-schedules/${id}`,
    payload,
  );

  return data;
}

export async function deleteWorkSchedule(id: number) {
  const { data } = await api.delete(`/work-schedules/${id}`);
  return data;
}

export async function listProfessionalsOptions(params: {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  barbershopId?: string | number;
  isActive?: string | boolean;
}) {
  const { data } = await api.get<Paginated<ProfessionalOption>>(
    '/professionals',
    {
      params: cleanParams(params),
    },
  );

  return data;
}