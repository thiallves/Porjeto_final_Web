'use client';
import { FormEvent, useEffect, useState } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { listBarbershops } from '@/src/services/barbershops.service';
import type { Barbershop, Service, ServiceType } from '@/src/types/api';
import type { ServicePayload } from '@/src/services/services.service';

type Props = { initial?: Service | null; onSubmit: (payload: ServicePayload) => Promise<void>; onCancel: () => void; };
const empty = { name: 'CORTE_MAQUINA' as ServiceType, price: 25, duration: 30, barbershopId: '', isActive: true };

export function ServiceForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<any>(empty);
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //ajustado para aparecer as barbearias cadastradas
  useEffect(() => {
    listBarbershops({ page: 1, limit: 100 })
      .then(data => setBarbershops(data.data || []))
      .catch((err) => {
        console.log('Erro ao carregar barbearias:', err);
        setBarbershops([]);
      });
  }, []);


  useEffect(() => {
    setForm(initial ? { ...empty, ...initial } : { ...empty, barbershopId: barbershops[0]?.id ? String(barbershops[0].id) : '' });
  }, [initial, barbershops]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.barbershopId) return setError('Selecione a barbearia.');
    if (Number(form.price) <= 0 || Number(form.duration) <= 0) return setError('Preço e duração devem ser maiores que zero.');
    setLoading(true);
    try {

      //ajustado para consguir salvar um novo serviço

      const payload: any = {
        name: form.name,
        price: Number(form.price),
        duration: Number(form.duration),
        barbershopId: Number(form.barbershopId),
      };

      //  mudar status no update
      if (initial) {
        payload.isActive = form.isActive;
      }

      await onSubmit(payload);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return <form className="entity-form" onSubmit={submit}>
    <label>Tipo do serviço<select value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}><option value="CORTE_MAQUINA">Corte Máquina</option><option value="CORTE_TESOURA">Corte Tesoura</option><option value="BARBA">Barba</option></select></label>
    <div className="grid-2"><label>Preço<input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></label><label>Duração em minutos<input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></label></div>
    <label>Barbearia<select required value={form.barbershopId} onChange={e => setForm({ ...form, barbershopId: e.target.value })}><option value="">Selecione a barbearia</option>{barbershops.map(item => <option key={item.id} value={item.id}>{item.name} - {item.city}</option>)}</select></label>
    <label>Status<select value={String(form.isActive)} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}><option value="true">Ativo</option><option value="false">Inativo</option></select></label>
    {error && <p className="form-error">{error}</p>}
    <div className="modal-actions"><AppButton type="button" variant="ghost" onClick={onCancel}>Cancelar</AppButton><AppButton disabled={loading}>{loading ? 'Salvando...' : 'Salvar serviço'}</AppButton></div>
  </form>;
}
