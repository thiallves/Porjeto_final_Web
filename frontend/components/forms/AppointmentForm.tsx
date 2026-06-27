'use client';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { listBarbershops } from '@/src/services/barbershops.service';
import { listServices } from '@/src/services/services.service';
import { listUsers } from '@/src/services/users.service';
import type { AppointmentPayload } from '@/src/services/appointments.service';
import type { Barbershop, Service, User } from '@/src/types/api';

type Props = { onSubmit: (payload: AppointmentPayload) => Promise<void>; onCancel: () => void; currentUser?: User };

export function AppointmentForm({ onSubmit, onCancel, currentUser }: Props) {
  const isAdmin = currentUser?.role === 'ADMIN';
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const [form, setForm] = useState<any>({ barbershopId: '', serviceId: '', userId: '', barberId: '', date: tomorrow });
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [barbers, setBarbers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSelectClient =
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'BARBEIRO';

  useEffect(() => {
    const isAdmin = currentUser?.role === 'ADMIN';

    const requests: any[] = [
      listBarbershops({ page: 1, limit: 100 })
    ];


    if (currentUser?.role === 'ADMIN') {
      requests.push(
        listUsers({ page: 1, limit: 100, role: 'CLIENTE' }),
        listUsers({ page: 1, limit: 100, role: 'BARBEIRO' })
      );
    } else if (currentUser?.role === 'BARBEIRO') {
      requests.push(
        listUsers({ page: 1, limit: 100, role: 'CLIENTE' })
      );
    } else {
    }

    Promise.all(requests)
      .then((results) => {
        const barbershopData = results[0];
        const units = barbershopData.data || [];

        setBarbershops(units);

        if (currentUser?.role === 'ADMIN') {
          const clientData = results[1];
          const barberData = results[2];

          setClients(clientData?.data || []);
          setBarbers(barberData?.data || []);

        } else if (currentUser?.role === 'BARBEIRO') {
          const clientData = results[1];

          setClients(clientData?.data || []);
        }

        setForm((prev: any) => ({
          ...prev,
          barbershopId:
            prev.barbershopId ||
            currentUser?.barbershopId ||
            units[0]?.id ||
            ''
        }));
      })
      .catch((err) => {
        console.error('Erro ao carregar opções:', err);
        setError('Não foi possível carregar as opções do formulário.');
      });

  }, [currentUser?.barbershopId]);


  useEffect(() => {
    if (!form.barbershopId) return;
    listServices({ page: 1, limit: 100, barbershopId: form.barbershopId, isActive: true })
      .then(data => {
        const list = data.data || [];
        setServices(list);
        setForm((prev: any) => ({ ...prev, serviceId: list.some(item => String(item.id) === String(prev.serviceId)) ? prev.serviceId : (list[0]?.id || '') }));
      })
      .catch(() => setServices([]));
  }, [form.barbershopId]);

  const barbersForUnit = useMemo(() => {
    if (!form.barbershopId) return barbers;
    return barbers.filter(item => !item.barbershopId || String(item.barbershopId) === String(form.barbershopId));
  }, [barbers, form.barbershopId]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.barbershopId || !form.serviceId || !form.date) return setError('Preencha barbearia, serviço e data.');
    const payload: AppointmentPayload = { barbershopId: Number(form.barbershopId), serviceId: Number(form.serviceId), date: new Date(form.date).toISOString() };
    if (isAdmin && form.userId) payload.userId = Number(form.userId);
    if (form.barberId) payload.barberId = Number(form.barberId);
    setLoading(true);
    try { await onSubmit(payload); } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

  return <form className="entity-form" onSubmit={submit}>
    <div className="grid-2">
      <label>Barbearia
        <select required value={form.barbershopId} onChange={e => setForm({ ...form, barbershopId: e.target.value, serviceId: '', barberId: '' })}>
          <option value="">Selecione a barbearia</option>
          {barbershops.map(item => <option key={item.id} value={item.id}>{item.name} - {item.city}</option>)}
        </select>
      </label>
      <label>Serviço
        <select required value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })}>
          <option value="">Selecione o serviço</option>
          {services.map(item => <option key={item.id} value={item.id}>{item.name.replaceAll('_', ' ')} - {Number(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>)}
        </select>
      </label>
    </div>
    <div className="grid-2">
      {canSelectClient && (
        <label>Cliente
          <select
            value={form.userId}
            onChange={e =>
              setForm({ ...form, userId: e.target.value })
            }
          >
            <option value="">Selecionar cliente</option>
            {clients.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.email}
              </option>
            ))}
          </select>
        </label>
      )}
      <label>Barbeiro
        <select value={form.barberId} onChange={e => setForm({ ...form, barberId: e.target.value })}>
          <option value="">Sem preferência</option>
          {barbersForUnit.map(item => <option key={item.id} value={item.id}>{item.name} - {item.email}</option>)}
        </select>
      </label>
    </div>
    <label>Data e hora<input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
    {error && <p className="form-error">{error}</p>}
    <div className="modal-actions"><AppButton type="button" variant="ghost" onClick={onCancel}>Cancelar</AppButton><AppButton disabled={loading}>{loading ? 'Agendando...' : 'Criar agendamento'}</AppButton></div>
  </form>;
}
