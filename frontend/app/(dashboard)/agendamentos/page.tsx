'use client';
import { useEffect, useMemo, useState } from 'react';
import { CalendarPlus, CheckCircle, XCircle } from 'lucide-react';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { AppButton } from '@/components/ui/AppButton';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { EntityModal } from '@/components/forms/EntityModal';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { datetime } from '@/src/lib/format';
import { isEmployee, userRole } from '@/src/lib/permissions';
import type { Appointment, AppointmentStatus, Barbershop, Paginated, Service, User } from '@/src/types/api';
import { cancelAppointment, createAppointment, listAppointments, updateAppointmentStatus } from '@/src/services/appointments.service';
import { listBarbershops } from '@/src/services/barbershops.service';
import { listServices } from '@/src/services/services.service';
import { listUsers } from '@/src/services/users.service';

function AppointmentsContent({ user }: { user: User }) {
  const [serviceId, setServiceId] = useState('');
  const [userId, setUserId] = useState('');

  const role = userRole(user);
  const canChangeStatus = isEmployee(user);
  const [items, setItems] = useState<Paginated<Appointment>>({ data: [], total: 0, page: 1, limit: 10, lastPage: 1 });
  const [status, setStatus] = useState('');
  const [barbershopId, setBarbershopId] = useState(user.barbershopId ? String(user.barbershopId) : '');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    Promise.all([
      listBarbershops({ page: 1, limit: 100 }),

      listServices({ page: 1, limit: 100 }),

      listUsers({ page: 1, limit: 100, role: 'CLIENTE' }),
    ])
      .then(([unitData, serviceData, userData]) => {
        setBarbershops(unitData.data || []);
        setServices(serviceData.data || []);

        setUsers(
          (userData.data || []).filter(u => u.role === 'CLIENTE')
        );
      })
      .catch(() => {
        setBarbershops([]);
        setServices([]);
        setUsers([]);
      });
  }, []);

  const unitsById = useMemo(() => Object.fromEntries(barbershops.map(item => [item.id, item])), [barbershops]);
  const servicesById = useMemo(() => Object.fromEntries(services.map(item => [item.id, item])), [services]);
  const usersById = useMemo(() => Object.fromEntries(users.map(item => [item.id, item])), [users]);

  async function load(page = items.page) {
    setLoading(true);

    try {
      const params: Record<string, string | number | undefined> = {
        page,
        limit: 10,
        status,
      };
      if (role === 'BARBEIRO' && user.barbershopId) {
        params.barbershopId = user.barbershopId;
      }

      if (role === 'ADMIN' && barbershopId) {
        params.barbershopId = barbershopId;
      }

      if (role === 'CLIENTE') {
        params.userId = user.id;
      } else if (userId) {
        params.userId = userId;
      }

      if (serviceId) {
        params.serviceId = serviceId;
      }

      setItems(await listAppointments(params));

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(1); }, [status, barbershopId]);

  async function setNewStatus(id: number, next: AppointmentStatus) { await updateAppointmentStatus(id, next); load(items.page); }
  async function cancel(id: number) { await cancelAppointment(id); load(items.page); }

  const columns: Column<Appointment>[] = [
    { header: 'Data', render: r => datetime(r.date) },

    {
      header: 'Cliente',
      render: r => r.user?.name || '-',
    },

    {
      header: 'Serviço',
      render: r =>
        r.service?.name?.replaceAll('_', ' ') || '-',
    },

    {
      header: 'Barbearia',
      render: r => r.barbershop?.name || '-',
    },

    {
      header: 'Barbeiro',
      render: r =>
        r.barber?.name || 'Sem preferência',
    },

    {
      header: 'Status',
      render: r => <StatusBadge value={r.status} />,
    },

    {
      header: 'Ações',
      render: r => (
        <div className="row-actions">
          {canChangeStatus && (
            <>
              <button title="Confirmar" onClick={() => setNewStatus(r.id, 'CONFIRMADO')}>
                <CheckCircle size={16} />
              </button>
              <button title="Concluir" onClick={() => setNewStatus(r.id, 'CONCLUIDO')}>
                <CalendarPlus size={16} />
              </button>
            </>
          )}
          <button title="Cancelar" onClick={() => cancel(r.id)}>
            <XCircle size={16} />
          </button>
        </div>
      ),
    },
  ];

  return <>
    <DataTable
      title="Agendamentos"
      description={role === 'CLIENTE' ? 'Crie e acompanhe seus horários.' : 'Acompanhe horários e atualize o status dos atendimentos.'}
      columns={columns}
      rows={items.data}
      loading={loading}
      total={items.total}
      page={items.page}
      lastPage={items.lastPage}
      onPageChange={load}
      filters={
        <>

          <select
            className="filter-input"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="AGENDADO">Agendado</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
          </select>


          <select
            className="filter-input"
            value={barbershopId}
            onChange={e => setBarbershopId(e.target.value)}
          >
            <option value="">Todas as barbearias</option>
            {barbershops.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>


          <select
            className="filter-input"
            value={serviceId}
            onChange={e => setServiceId(e.target.value)}
          >
            <option value="">Todos os serviços</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>


          <select
            className="filter-input"
            value={userId}
            onChange={e => setUserId(e.target.value)}
          >
            <option value="">Todos os clientes</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </>
      }
      actions={<AppButton onClick={() => setModal(true)}><CalendarPlus size={16} /> Novo agendamento</AppButton>}
    />
    <EntityModal open={modal} title="Criar agendamento" subtitle={role === 'CLIENTE' ? 'O agendamento será criado para seu usuário.' : 'Escolha cliente, unidade, serviço e horário.'} onClose={() => setModal(false)}>
      <AppointmentForm currentUser={user} onCancel={() => setModal(false)} onSubmit={async payload => { await createAppointment(payload); setModal(false); load(1); }} />
    </EntityModal>
  </>;
}

export default function AppointmentsPage() {
  return <ProtectedPage href="/agendamentos">{user => <AppointmentsContent user={user} />}</ProtectedPage>;
}
