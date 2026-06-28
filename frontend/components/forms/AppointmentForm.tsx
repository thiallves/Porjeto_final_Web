'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { listBarbershops } from '@/src/services/barbershops.service';
import { listServices } from '@/src/services/services.service';
import { listUsers } from '@/src/services/users.service';
import type { AppointmentPayload } from '@/src/services/appointments.service';
import type { Barbershop, Service, User } from '@/src/types/api';

type Props = {
  onSubmit: (payload: AppointmentPayload) => Promise<void>;
  onCancel: () => void;
  currentUser?: User;
};

export function AppointmentForm({ onSubmit, onCancel, currentUser }: Props) {
  const isAdmin = currentUser?.role === 'ADMIN';

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  const [form, setForm] = useState<any>({
    barbershopId: '',
    serviceId: '',
    userId: '',
    barberId: '',
    date: tomorrow,
  });

  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [barbers, setBarbers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSelectClient =
    currentUser?.role === 'ADMIN' || currentUser?.role === 'BARBEIRO';

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      setError('');

      try {
        const barbershopData = await listBarbershops({
          page: 1,
          limit: 100,
        });

        if (!active) return;

        const units = barbershopData.data || [];
        setBarbershops(units);

        setForm((prev: any) => ({
          ...prev,
          barbershopId:
            prev.barbershopId ||
            currentUser?.barbershopId ||
            units[0]?.id ||
            '',
        }));
      } catch (err) {
        console.error('Erro ao carregar barbearias:', err);
        setError('Não foi possível carregar as barbearias.');
      }

      if (canSelectClient) {
        try {
          const clientData = await listUsers({
            page: 1,
            limit: 100,
            role: 'CLIENTE',
          });

          if (!active) return;

          setClients(clientData.data || []);
        } catch (err) {
          console.error('Erro ao carregar clientes:', err);
          setClients([]);
        }
      }

      try {
        const barberData = await listUsers({
          page: 1,
          limit: 100,
          role: 'BARBEIRO',
        });

        if (!active) return;

        setBarbers(barberData.data || []);
      } catch (err) {
        console.error('Erro ao carregar barbeiros:', err);
        setBarbers([]);
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, [currentUser?.barbershopId, currentUser?.role, canSelectClient]);

  useEffect(() => {
    if (!form.barbershopId) {
      setServices([]);
      setForm((prev: any) => ({
        ...prev,
        serviceId: '',
      }));
      return;
    }

    setServices([]);

    listServices({
      page: 1,
      limit: 100,
      barbershopId: form.barbershopId,
      isActive: true,
    })
      .then((data) => {
        const list = data.data || [];

        setServices(list);

        setForm((prev: any) => ({
          ...prev,
          serviceId: list.some((item) => String(item.id) === String(prev.serviceId))
            ? prev.serviceId
            : list[0]?.id || '',
        }));
      })
      .catch((err) => {
        console.error('Erro ao carregar serviços:', err);
        setServices([]);
        setForm((prev: any) => ({
          ...prev,
          serviceId: '',
        }));
      });
  }, [form.barbershopId]);

  const barbersForUnit = useMemo(() => {
    if (!form.barbershopId) return barbers;

    return barbers.filter(
      (item: any) =>
        !item.barbershopId ||
        String(item.barbershopId) === String(form.barbershopId),
    );
  }, [barbers, form.barbershopId]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.barbershopId || !form.serviceId || !form.date) {
      setError('Preencha barbearia, serviço e data.');
      return;
    }

    const payload: AppointmentPayload = {
      barbershopId: Number(form.barbershopId),
      serviceId: Number(form.serviceId),
      date: new Date(form.date).toISOString(),
    };

    if (isAdmin && form.userId) {
      payload.userId = Number(form.userId);
    }

    if (form.barberId) {
      payload.barberId = Number(form.barberId);
    }

    setLoading(true);

    try {
      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar agendamento.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="entity-form" onSubmit={submit}>
      <div className="grid-2">
        <label>
          Barbearia
          <select
            required
            value={form.barbershopId}
            onChange={(e) =>
              setForm({
                ...form,
                barbershopId: e.target.value,
                serviceId: '',
                barberId: '',
              })
            }
          >
            <option value="">Selecione a barbearia</option>
            {barbershops.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.city}
              </option>
            ))}
          </select>
        </label>

        <label>
          Serviço
          <select
            required
            value={form.serviceId}
            disabled={!form.barbershopId || services.length === 0}
            onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
          >
            <option value="">
              {!form.barbershopId
                ? 'Selecione uma barbearia primeiro'
                : services.length === 0
                  ? 'Nenhum serviço disponível'
                  : 'Selecione o serviço'}
            </option>

            {services.map((item) => (
              <option key={item.id} value={item.id}>
                {String(item.name).replaceAll('_', ' ')} -{' '}
                {Number(item.price).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid-2">
        {canSelectClient && (
          <label>
            Cliente
            <select
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            >
              <option value="">Selecionar cliente</option>
              {clients.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.email}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Preferência de barbeiro
          <select
            value={form.barberId}
            onChange={(e) => setForm({ ...form, barberId: e.target.value })}
          >
            <option value="">Sem preferência</option>

            {barbersForUnit.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.email}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Data e hora
        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="modal-actions">
        <AppButton type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </AppButton>

        <AppButton disabled={loading}>
          {loading ? 'Agendando...' : 'Criar agendamento'}
        </AppButton>
      </div>
    </form>
  );
}