import type { User } from '@/src/types/api';

export type Role = 'ADMIN' | 'BARBEIRO' | 'CLIENTE';

export const roleLabels: Record<Role, string> = {
  ADMIN: 'Gerente',
  BARBEIRO: 'Funcionário',
  CLIENTE: 'Cliente',
};

export const roleHome: Record<Role, string> = {
  ADMIN: '/dashboard',
  BARBEIRO: '/agendamentos',
  CLIENTE: '/agendamentos',
};

export function userRole(user?: User | null): Role {
  return (user?.role as Role) || 'CLIENTE';
}

export function canManageEverything(user?: User | null) {
  return userRole(user) === 'ADMIN';
}

export function isEmployee(user?: User | null) {
  return userRole(user) === 'ADMIN' || userRole(user) === 'BARBEIRO';
}

export function canAccessRoute(user: User | null, href: string) {
  const role = userRole(user);
  const publicCustomerRoutes = ['/dashboard', '/barbearias', '/servicos', '/agendamentos', '/profissionais', '/produtos', '/cupons', '/avaliacoes'];
  const employeeRoutes = [...publicCustomerRoutes, '/categorias', '/horarios'];
  if (role === 'ADMIN') return true;
  if (role === 'BARBEIRO') return employeeRoutes.includes(href);
  return publicCustomerRoutes.includes(href);
}

export function explainRole(user?: User | null) {
  const role = userRole(user);
  if (role === 'ADMIN') return 'Você tem acesso total ao painel da barbearia.';
  if (role === 'BARBEIRO') return 'Você acompanha atendimentos, serviços, agenda e cadastros operacionais.';
  return 'Você pode consultar serviços, produtos, avaliações e seus agendamentos.';
}
