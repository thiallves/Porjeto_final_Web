'use client';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { GenericCrudPage } from '@/components/forms/GenericCrudPage';

const days = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

const config = {
  endpoint: '/work-schedules',
  title: 'Horários',
  description: 'Controle a agenda de trabalho dos profissionais.',
  searchPlaceholder: 'Buscar por profissional...',
  fields: [
    { name: 'professionalId', label: 'Profissional', type: 'select', required: true, lookup: { endpoint: '/professionals', labelKey: 'name', placeholder: 'Selecione o profissional' } },
    { name: 'barbershopId', label: 'Barbearia', type: 'select', required: true, lookup: { endpoint: '/barbershops', labelKey: 'name', placeholder: 'Selecione a barbearia' } },
    { name: 'dayOfWeek', label: 'Dia da semana', type: 'select', required: true, options: days },
    { name: 'startTime', label: 'Início', type: 'time', required: true },
    { name: 'endTime', label: 'Fim', type: 'time', required: true },
    { name: 'isActive', label: 'Status', type: 'checkbox' },
  ],
  columns: [
    { key: 'id', header: 'ID' },
    { key: 'professionalId', header: 'Profissional', lookup: { endpoint: '/professionals', labelKey: 'name' } },
    { key: 'barbershopId', header: 'Barbearia', lookup: { endpoint: '/barbershops', labelKey: 'name' } },
    { key: 'dayOfWeek', header: 'Dia' },
    { key: 'startTime', header: 'Início' },
    { key: 'endTime', header: 'Fim' },
    { key: 'isActive', header: 'Status', type: 'boolean' },
  ],
} as const;

export default function Page() {
  return <ProtectedPage href="/horarios">{user => <GenericCrudPage config={config as any} user={user} />}</ProtectedPage>;
}
