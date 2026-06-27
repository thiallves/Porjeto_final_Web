'use client';

import { FormEvent, useEffect, useState } from 'react';
import { UserRole } from '@/src/types/api';
import { useRouter } from 'next/navigation';
import { Scissors } from 'lucide-react';
import { AppButton } from '@/components/ui/AppButton';
import { createUser } from '@/src/services/users.service';
import { listBarbershops } from '@/src/services/barbershops.service';

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState<{
        name: string;
        email: string;
        phone: string;
        password: string;
        role: UserRole;
        barbershopId: string;
    }>({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'CLIENTE',
        barbershopId: '',
    });


    const [barbershops, setBarbershops] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        listBarbershops({ page: 1, limit: 100 })
            .then((res) => setBarbershops(res.data || []))
            .catch(() => setBarbershops([]));
    }, []);

    async function submit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await createUser({
                name: form.name,
                email: form.email,
                phone: form.phone,
                password: form.password,
                role: form.role,


                barbershopId:
                    form.role === 'BARBEIRO'
                        ? Number(form.barbershopId)
                        : undefined,
            });

            router.push('/login');

        } catch (err: any) {
            setError(err.message || 'Erro ao cadastrar');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">


            <section className="login-hero">
                <div className="brand big">
                    <div className="brand-mark">
                        <Scissors size={28} />
                    </div>
                    <div>
                        <strong>Navalha Prime</strong>
                        <span>Barbearia</span>
                    </div>
                </div>

                <h1>Comece agora.</h1>
                <p>
                    Crie sua conta para agendar horários ou atuar como barbeiro em uma barbearia.
                </p>

                <div className="login-stats">
                    <span>Cadastro rápido</span>
                    <span>Agendamento online</span>
                    <span>Gestão simples</span>
                </div>
            </section>


            <section className="login-card">
                <p className="eyebrow">Cadastro</p>
                <h2>Criar conta</h2>

                <form onSubmit={submit} className="entity-form">

                    <label>
                        Nome
                        <input
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </label>

                    <label>
                        E-mail
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </label>

                    <label>
                        Telefone
                        <input
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </label>

                    <label>
                        Senha
                        <input
                            type="password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </label>


                    <label>
                        Tipo de usuário
                        <select
                            value={form.role}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    role: e.target.value as UserRole,
                                    barbershopId: '', 
                                })
                            }
                        >
                            <option value="CLIENTE">Cliente</option>
                            <option value="BARBEIRO">Barbeiro</option>
                        </select>
                    </label>


                    {form.role === 'BARBEIRO' && (
                        <label>
                            Barbearia
                            <select
                                value={form.barbershopId}
                                onChange={e =>
                                    setForm({ ...form, barbershopId: e.target.value })
                                }
                                required
                            >
                                <option value="">Selecionar barbearia</option>
                                {barbershops.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    {error && <p className="form-error">{error}</p>}

                    <AppButton disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Criar conta'}
                    </AppButton>


                    <p style={{ marginTop: '12px', textAlign: 'center' }}>
                        Já tem conta?{' '}
                        <span
                            onClick={() => router.push('/login')}
                            style={{ color: '#D4A64A', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Entrar
                        </span>
                    </p>

                </form>
            </section>
        </main>
    );
}