'use client';
import { FormEvent, useEffect, useState } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import type { Barbershop } from '@/src/types/api';
import type { BarbershopPayload } from '@/src/services/barbershops.service';

type Props = { initial?: Barbershop | null; onSubmit: (payload: BarbershopPayload) => Promise<void>; onCancel: () => void; };
const empty = { name: '', address: '', city: '', neighborhood: '', openingTime: '08:00:00', closingTime: '18:00:00', cancellationLimitHours: 2, dailyAppointmentLimit: 30, isActive: true };

export function BarbershopForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<any>(empty);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => setForm(initial ? { ...empty, ...initial } : empty), [initial]);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError('');
    if (!form.name || !form.address || !form.city || !form.neighborhood) return setError('Preencha nome, endereço, cidade e bairro.');
    setLoading(true);
    try { await onSubmit({ ...form, cancellationLimitHours: Number(form.cancellationLimitHours), dailyAppointmentLimit: Number(form.dailyAppointmentLimit) }); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }
  return <form className="entity-form" onSubmit={submit}>
    <div className="grid-2"><label>Nome<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Cidade<input value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></label></div>
    <label>Endereço<input value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label>
    <div className="grid-2"><label>Bairro<input value={form.neighborhood} onChange={e=>setForm({...form,neighborhood:e.target.value})}/></label><label>Status<select value={String(form.isActive)} onChange={e=>setForm({...form,isActive:e.target.value==='true'})}><option value="true">Ativa</option><option value="false">Inativa</option></select></label></div>
    <div className="grid-2"><label>Abertura<input value={form.openingTime} onChange={e=>setForm({...form,openingTime:e.target.value})}/></label><label>Fechamento<input value={form.closingTime} onChange={e=>setForm({...form,closingTime:e.target.value})}/></label></div>
    <div className="grid-2"><label>Limite cancelamento (h)<input type="number" value={form.cancellationLimitHours} onChange={e=>setForm({...form,cancellationLimitHours:e.target.value})}/></label><label>Limite diário<input type="number" value={form.dailyAppointmentLimit} onChange={e=>setForm({...form,dailyAppointmentLimit:e.target.value})}/></label></div>
    {error && <p className="form-error">{error}</p>}
    <div className="modal-actions"><AppButton type="button" variant="ghost" onClick={onCancel}>Cancelar</AppButton><AppButton disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</AppButton></div>
  </form>;
}
