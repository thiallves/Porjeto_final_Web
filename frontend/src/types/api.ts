export type UserRole = 'ADMIN' | 'CLIENTE' | 'BARBEIRO';
export type ServiceType = 'CORTE_MAQUINA' | 'CORTE_TESOURA' | 'BARBA';
export type AppointmentStatus = 'PENDENTE' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  barbershopId?: number | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Barbershop = {
  id: number;
  name: string;
  address: string;
  city: string;
  neighborhood: string;
  latitude?: number | null;
  longitude?: number | null;
  openingTime?: string;
  closingTime?: string;
  cancellationLimitHours?: number;
  dailyAppointmentLimit?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Service = {
  id: number;
  name: ServiceType;
  price: number | string;
  duration: number;
  barbershopId: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Appointment = {
  id: number;
  userId: number;
  serviceId: number;
  barbershopId: number;
  barberId?: number | null;

  date: string;
  endDate?: string;
  status: AppointmentStatus;

  createdAt?: string;
  updatedAt?: string;

  user?: {
    id: number;
    name: string;
    email?: string;
  };

  service?: {
    id: number;
    name: string;
    price?: number;
  };

  barbershop?: {
    id: number;
    name: string;
    city?: string;
  };

  barber?: {
    id: number;
    name: string;
  };
};

export type LoginResponse = {
  access_token: string;
  user: User;
};

export type ListParams = Record<string, string | number | boolean | undefined | null>;
