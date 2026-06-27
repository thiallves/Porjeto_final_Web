'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scissors } from 'lucide-react';
import { AppButton } from '@/components/ui/AppButton';
import { login } from '@/src/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@email.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(email, password); router.push('/dashboard'); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }
  return <main className="login-page">
    <section className="login-hero">
      <div className="brand big"><div className="brand-mark"><Scissors size={28} /></div><div><strong>Navalha Prime</strong><span>Barbearia</span></div></div>
      <h1>Seu visual no horário certo.</h1>
      <p>Agende cortes, acompanhe serviços e gerencie a rotina da barbearia em um painel simples e moderno.</p>
      <div className="login-stats"><span>Agenda online</span><span>Serviços premium</span><span>Atendimento rápido</span></div>
    </section>
    <section className="login-card">
      <p className="eyebrow">Acesso</p><h2>Entrar</h2>
      <form onSubmit={submit} className="entity-form">
        <label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Senha<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
        {error && <p className="form-error">{error}</p>}
        <AppButton disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </AppButton>

        <p style={{ marginTop: '12px', textAlign: 'center' }}>
          Não tem conta?{' '}
          <a
            onClick={() => router.push('/register')}
            style={{ color: '#D4A64A', cursor: 'pointer', fontWeight: 500 }}
          >
            Cadastre-se
          </a>
        </p>
        
      </form>
    </section>
  </main>;
}
