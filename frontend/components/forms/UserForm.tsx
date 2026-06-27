'use client';
import { FormEvent, useEffect, useState } from 'react';
import { AppButton } from '@/components/ui/AppButton';
//import { listBarbershops } from '@/src/services/barbershops.service';
import type { Barbershop, User, UserRole } from '@/src/types/api';
import type { UserPayload } from '@/src/services/users.service';

type Props = {
  initial?: User | null;
  barbershops: Barbershop[];
  onSubmit: (payload: UserPayload) => Promise<void>; onCancel: () => void;
};
const empty = { name: '', email: '', password: '123456', phone: '', role: 'CLIENTE' as UserRole, barbershopId: '' };

export function UserForm({ initial, barbershops, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<any>(empty);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  /*const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listBarbershops({ page: 1, limit: 100, isActive: true })
      .then(data => setBarbershops(data.data || []))
      .catch(() => setBarbershops([]));
  }, []);*/

  useEffect(() => setForm(initial ? { ...empty, ...initial, password: '', barbershopId: initial.barbershopId ?? '' } : empty), [initial]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone) return setError('Preencha nome, e-mail e telefone.');
    if (!initial && (!form.password || form.password.length < 6)) return setError('Senha obrigatória com pelo menos 6 caracteres.');
    if (form.role === 'BARBEIRO' && !form.barbershopId) return setError('Funcionário/barbeiro precisa estar vinculado a uma barbearia.');
    const payload: UserPayload = { name: form.name, email: form.email, phone: form.phone, role: form.role, barbershopId: form.barbershopId ? Number(form.barbershopId) : undefined };
    if (form.password) payload.password = form.password;
    setLoading(true);
    try { await onSubmit(payload); } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

  return <form className="entity-form" onSubmit={submit}>
    <div className="grid-2"><label>Nome<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>E-mail<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label></div>
    <div className="grid-2"><label>Telefone<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label><label>Senha<input type="password" value={form.password} placeholder={initial ? 'Manter senha atual' : '123456'} onChange={e => setForm({ ...form, password: e.target.value })} /></label></div>
    <div className="grid-2"><label>Perfil<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option>ADMIN</option><option>BARBEIRO</option><option>CLIENTE</option></select></label><label>Barbearia<select value={form.barbershopId} onChange={e => setForm({ ...form, barbershopId: e.target.value })}><option value="">Sem barbearia</option>{barbershops.map(item => <option key={item.id} value={item.id}>{item.name} - {item.city}</option>)}</select></label></div>
    {form.role === 'BARBEIRO' && <p className="hint">Para funcionário/barbeiro, escolha a unidade onde ele trabalha.</p>}
    {error && <p className="form-error">{error}</p>}
    <div className="modal-actions"><AppButton type="button" variant="ghost" onClick={onCancel}>Cancelar</AppButton><AppButton disabled={loading}>{loading ? 'Salvando...' : 'Salvar usuário'}</AppButton></div>
  </form>;
}
