'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { AppButton } from '@/components/ui/AppButton';
import { listBarbershops } from '@/src/services/barbershops.service';
import {
  createWorkSchedule,
  deleteWorkSchedule,
  listProfessionalsOptions,
  listWorkSchedules,
  updateWorkSchedule,
  type ProfessionalOption,
  type WorkSchedule,
} from '@/src/services/work-schedules.service';
import type { Barbershop } from '@/src/types/api';

const days = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

const emptyForm = {
  professionalId: '',
  barbershopId: '',
  dayOfWeeks: [] as string[],
  startTime: '09:00',
  endTime: '18:00',
  isActive: true,
};

export default function Page() {
  return (
    <ProtectedPage href="/horarios">
      {(user: any) => <SchedulesPage user={user} />}
    </ProtectedPage>
  );
}

function SchedulesPage({ user }: { user: any }) {
  const canManage = user?.role === 'ADMIN' || user?.role === 'BARBEIRO';

  const [items, setItems] = useState<WorkSchedule[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalOption[]>([]);
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);

  const [filters, setFilters] = useState({
    professionalName: '',
    professionalEmail: '',
    barbershopId: '',
    dayOfWeek: '',
    isActive: '',
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<WorkSchedule | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const professionalNameById = useMemo(() => {
    const map = new Map<number, string>();

    professionals.forEach((item) => {
      map.set(item.id, item.name || `Profissional ${item.id}`);
    });

    return map;
  }, [professionals]);

  const barbershopNameById = useMemo(() => {
    const map = new Map<number, string>();

    barbershops.forEach((item) => {
      map.set(item.id, item.name);
    });

    return map;
  }, [barbershops]);

  const professionalsForSelectedBarbershop = useMemo(() => {
    if (!form.barbershopId) return professionals;

    return professionals.filter(
      (item) =>
        !item.barbershopId ||
        String(item.barbershopId) === String(form.barbershopId),
    );
  }, [professionals, form.barbershopId]);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [barbershopData, professionalData] = await Promise.all([
          listBarbershops({ page: 1, limit: 100 }),
          listProfessionalsOptions({
            page: 1,
            limit: 100,
            isActive: true,
          }),
        ]);

        const units = barbershopData.data || [];
        const professionalsList = professionalData.data || [];

        setBarbershops(units);
        setProfessionals(professionalsList);

        setForm((prev) => ({
          ...prev,
          barbershopId:
            prev.barbershopId ||
            user?.barbershopId ||
            units[0]?.id ||
            '',
        }));
      } catch (err) {
        console.error('Erro ao carregar opções:', err);
        setError('Não foi possível carregar profissionais e barbearias.');
      }
    }

    loadOptions();
  }, [user?.barbershopId]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await listWorkSchedules({
        page,
        limit,
        ...appliedFilters,
      });

      setItems(response.data || []);
      setTotal(response.total || 0);
      setLastPage(Math.max(response.lastPage || 1, 1));
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar horários.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, appliedFilters]);

  useEffect(() => {
    load();
  }, [load]);

  function applyFilters() {
    setPage(1);
    setAppliedFilters(filters);
  }

  function clearFilters() {
    const empty = {
      professionalName: '',
      professionalEmail: '',
      barbershopId: '',
      dayOfWeek: '',
      isActive: '',
    };

    setFilters(empty);
    setAppliedFilters(empty);
    setPage(1);
  }

  function toggleDay(day: number) {
    const value = String(day);

    const alreadySelected = form.dayOfWeeks.includes(value);

    setForm({
      ...form,
      dayOfWeeks: alreadySelected
        ? form.dayOfWeeks.filter((item) => item !== value)
        : [...form.dayOfWeeks, value],
    });
  }

  function getDayLabel(day: number) {
    return days.find((item) => item.value === Number(day))?.label || day;
  }

  function startEdit(item: WorkSchedule) {
    setEditing(item);

    setForm({
      professionalId: String(item.professionalId || ''),
      barbershopId: String(item.barbershopId || ''),
      dayOfWeeks: [String(item.dayOfWeek)],
      startTime: item.startTime?.slice(0, 5) || '09:00',
      endTime: item.endTime?.slice(0, 5) || '18:00',
      isActive: item.isActive ?? true,
    });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.professionalId) {
      setError('Selecione o profissional.');
      return;
    }

    if (!form.barbershopId) {
      setError('Selecione a barbearia.');
      return;
    }

    if (form.dayOfWeeks.length === 0) {
      setError('Selecione pelo menos um dia da semana.');
      return;
    }

    if (!form.startTime || !form.endTime) {
      setError('Informe o horário de início e fim.');
      return;
    }

    if (form.startTime >= form.endTime) {
      setError('O horário de início deve ser menor que o horário de fim.');
      return;
    }

    if (editing && form.dayOfWeeks.length > 1) {
      setError(
        'Na edição, selecione apenas um dia. Para vários dias, cadastre um novo horário.',
      );
      return;
    }

    setSaving(true);

    try {
      const basePayload = {
        professionalId: Number(form.professionalId),
        barbershopId: Number(form.barbershopId),
        startTime: form.startTime,
        endTime: form.endTime,
        isActive: form.isActive,
      };

      if (editing) {
        await updateWorkSchedule(editing.id, {
          ...basePayload,
          dayOfWeek: Number(form.dayOfWeeks[0]),
        });
      } else {
        await Promise.all(
          form.dayOfWeeks.map((day) =>
            createWorkSchedule({
              ...basePayload,
              dayOfWeek: Number(day),
            }),
          ),
        );
      }

      cancelEdit();
      await load();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar horário.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: WorkSchedule) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o horário de ${getDayLabel(item.dayOfWeek)}?`,
    );

    if (!confirmed) return;

    try {
      await deleteWorkSchedule(item.id);
      await load();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir horário.');
    }
  }

  return (
    <main className="dashboard-page">
      <section className="page-header">
        <div>
          <h1>Horários</h1>
          <p>Controle a agenda de trabalho dos profissionais.</p>
        </div>
      </section>

      <section className="card">
        <h2>Filtros</h2>

        <div className="grid-3">
          <label>
            Nome do profissional
            <input
              placeholder="Buscar por nome"
              value={filters.professionalName}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  professionalName: e.target.value,
                })
              }
            />
          </label>

          <label>
            E-mail do profissional
            <input
              placeholder="Buscar por e-mail"
              value={filters.professionalEmail}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  professionalEmail: e.target.value,
                })
              }
            />
          </label>

          <label>
            Barbearia
            <select
              value={filters.barbershopId}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  barbershopId: e.target.value,
                })
              }
            >
              <option value="">Todas</option>
              {barbershops.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Dia da semana
            <select
              value={filters.dayOfWeek}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dayOfWeek: e.target.value,
                })
              }
            >
              <option value="">Todos</option>
              {days.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select
              value={filters.isActive}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  isActive: e.target.value,
                })
              }
            >
              <option value="">Todos</option>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </label>
        </div>

        <div className="modal-actions">
          <AppButton type="button" onClick={applyFilters}>
            Filtrar
          </AppButton>

          <AppButton type="button" variant="ghost" onClick={clearFilters}>
            Limpar
          </AppButton>
        </div>
      </section>

      {canManage && (
        <section className="card">
          <h2>{editing ? 'Editar horário' : 'Novo horário'}</h2>

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
                      professionalId: '',
                    })
                  }
                >
                  <option value="">Selecione a barbearia</option>
                  {barbershops.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Profissional
                <select
                  required
                  value={form.professionalId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      professionalId: e.target.value,
                    })
                  }
                >
                  <option value="">Selecione o profissional</option>
                  {professionalsForSelectedBarbershop.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name || `Profissional ${item.id}`}
                      {item.email ? ` - ${item.email}` : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>Dias da semana</label>

            <div className="grid-3">
              {days.map((day) => (
                <label key={day.value}>
                  <input
                    type="checkbox"
                    checked={form.dayOfWeeks.includes(String(day.value))}
                    onChange={() => toggleDay(day.value)}
                  />
                  {day.label}
                </label>
              ))}
            </div>

            {editing && (
              <p>
                Na edição, altere apenas um dia. Para criar vários dias de uma
                vez, cancele a edição e cadastre um novo horário.
              </p>
            )}

            <div className="grid-2">
              <label>
                Início
                <input
                  type="time"
                  required
                  value={form.startTime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      startTime: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Fim
                <input
                  type="time"
                  required
                  value={form.endTime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      endTime: e.target.value,
                    })
                  }
                />
              </label>
            </div>

            <label>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isActive: e.target.checked,
                  })
                }
              />
              Horário ativo
            </label>

            <div className="modal-actions">
              {editing && (
                <AppButton type="button" variant="ghost" onClick={cancelEdit}>
                  Cancelar edição
                </AppButton>
              )}

              <AppButton disabled={saving}>
                {saving
                  ? 'Salvando...'
                  : editing
                    ? 'Salvar alterações'
                    : 'Cadastrar horário'}
              </AppButton>
            </div>
          </form>
        </section>
      )}

      <section className="card">
        <h2>Lista de horários</h2>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p>Carregando horários...</p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Profissional</th>
                  <th>Barbearia</th>
                  <th>Dia</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th>Status</th>
                  {canManage && <th>Ações</th>}
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {professionalNameById.get(item.professionalId) ||
                        `ID ${item.professionalId}`}
                    </td>
                    <td>
                      {barbershopNameById.get(item.barbershopId) ||
                        `ID ${item.barbershopId}`}
                    </td>
                    <td>{getDayLabel(item.dayOfWeek)}</td>
                    <td>{String(item.startTime).slice(0, 5)}</td>
                    <td>{String(item.endTime).slice(0, 5)}</td>
                    <td>{item.isActive ? 'Ativo' : 'Inativo'}</td>

                    {canManage && (
                      <td>
                        <div className="modal-actions">
                          <AppButton
                            type="button"
                            variant="ghost"
                            onClick={() => startEdit(item)}
                          >
                            Editar
                          </AppButton>

                          <AppButton
                            type="button"
                            variant="ghost"
                            onClick={() => remove(item)}
                          >
                            Excluir
                          </AppButton>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={canManage ? 8 : 7}>
                      Nenhum horário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="modal-actions">
              <AppButton
                type="button"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </AppButton>

              <span>
                Página {page} de {lastPage} — Total: {total}
              </span>

              <AppButton
                type="button"
                variant="ghost"
                disabled={page >= lastPage}
                onClick={() => setPage(page + 1)}
              >
                Próxima
              </AppButton>
            </div>
          </>
        )}
      </section>
    </main>
  );
}