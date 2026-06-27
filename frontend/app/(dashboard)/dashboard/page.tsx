'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CalendarCheck, Clock, Package, Scissors, Star, Store, Ticket, UserRound, Users, Tags } from 'lucide-react';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { canAccessRoute, explainRole, roleLabels } from '@/src/lib/permissions';
import { getBarbershop } from '@/src/services/barbershops.service';
import type { Barbershop, User } from '@/src/types/api';

const cards = [
  { href: '/barbearias', title: 'Unidades', text: 'Endereço, funcionamento e dados das barbearias.', icon: Store },
  { href: '/usuarios', title: 'Usuários', text: 'Clientes, funcionários e gerentes.', icon: Users },
  { href: '/servicos', title: 'Serviços', text: 'Cortes, barba, preço e duração.', icon: Scissors },
  { href: '/agendamentos', title: 'Agenda', text: 'Reservas, cancelamentos e status dos atendimentos.', icon: CalendarCheck },
  { href: '/profissionais', title: 'Profissionais', text: 'Barbeiros e especialidades.', icon: UserRound },
  { href: '/horarios', title: 'Horários', text: 'Escalas de atendimento.', icon: Clock },
  { href: '/categorias', title: 'Categorias', text: 'Organização dos serviços.', icon: Tags },
  { href: '/produtos', title: 'Produtos', text: 'Itens vendidos na barbearia.', icon: Package },
  { href: '/cupons', title: 'Cupons', text: 'Descontos e campanhas.', icon: Ticket },
  { href: '/avaliacoes', title: 'Avaliações', text: 'Notas e comentários dos clientes.', icon: Star },
];

function DashboardContent({ user }: { user: User }) {
  const [unit, setUnit] = useState<Barbershop | null>(null);
  const visibleCards = cards.filter(card => canAccessRoute(user, card.href));

  useEffect(() => {
    if (!user.barbershopId) return;
    getBarbershop(user.barbershopId).then(setUnit).catch(() => undefined);
  }, [user.barbershopId]);

  return <div className="page-stack">
    <section className="hero-card">
      <p className="eyebrow">Navalha Prime</p>
      <h1>Bem-vindo, {user.name}</h1>
      <p>{explainRole(user)}</p>
      <div className="profile-strip"><strong>{user.name}</strong><span>{roleLabels[user.role as keyof typeof roleLabels]}</span><span>{unit?.name || 'Acesso geral'}</span></div>
    </section>
    <section className="metrics-grid">
      {visibleCards.map(card => { const Icon = card.icon; return <Link href={card.href} key={card.href} className="metric-card"><Icon size={28}/><h2>{card.title}</h2><p>{card.text}</p></Link>; })}
    </section>
  </div>;
}

export default function DashboardPage() {
  return <ProtectedPage href="/dashboard">{user => <DashboardContent user={user} />}</ProtectedPage>;
}
