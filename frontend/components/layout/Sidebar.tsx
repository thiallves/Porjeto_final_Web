'use client';
import { useEffect, useState } from 'react';
import type { User } from '@/src/types/api';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CalendarDays, Clock, Home, LogOut, Package, Scissors, Star, Store, Tags, Ticket, UserRound, Users } from 'lucide-react';
import clsx from 'clsx';
import { clearSession, getSessionUser } from '@/src/lib/storage';
import { canAccessRoute, roleLabels } from '@/src/lib/permissions';

const nav = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/barbearias', label: 'Unidades', icon: Store },
  { href: '/usuarios', label: 'Usuários', icon: Users },
  { href: '/servicos', label: 'Serviços', icon: Scissors },
  { href: '/agendamentos', label: 'Agenda', icon: CalendarDays },
  { href: '/profissionais', label: 'Profissionais', icon: UserRound },
  { href: '/horarios', label: 'Horários', icon: Clock },
  { href: '/categorias', label: 'Categorias', icon: Tags },
  { href: '/produtos', label: 'Produtos', icon: Package },
  { href: '/cupons', label: 'Cupons', icon: Ticket },
  { href: '/avaliacoes', label: 'Avaliações', icon: Star },
];

export function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); useEffect(() => { setUser(getSessionUser()); }, []);
  const visibleNav = nav.filter(item => canAccessRoute(user, item.href));

  function logout() {
    clearSession();
    router.push('/login');
  }

  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark">NP</div><div><strong>Navalha Prime</strong><span>Barbearia</span></div></div>
    <nav>{visibleNav.map(item => { const Icon = item.icon; return <Link key={item.href} className={clsx('nav-link', path === item.href && 'active')} href={item.href}><Icon size={18} />{item.label}</Link>; })}</nav>
    <div className="sidebar-footer"><p>Logado como</p><strong>{user?.name || 'Usuário'}</strong><span>{user?.role ? roleLabels[user.role as keyof typeof roleLabels] : 'Perfil'}</span><button onClick={logout}><LogOut size={16} /> Sair</button></div>
  </aside>;
}
