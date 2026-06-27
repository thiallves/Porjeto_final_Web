'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionUser, getToken } from '@/src/lib/storage';
import { canAccessRoute, roleHome } from '@/src/lib/permissions';
import type { User } from '@/src/types/api';

export function ProtectedPage({ href, children }: { href: string; children: (user: User) => React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    const current = getSessionUser();
    if (!token || !current) {
      router.replace('/login');
      return;
    }
    if (!canAccessRoute(current, href)) {
      router.replace(roleHome[current.role as keyof typeof roleHome] || '/dashboard');
      return;
    }
    setUser(current);
    setReady(true);
  }, [href, router]);

  if (!ready || !user) return <div className="empty-state">Carregando permissões do usuário...</div>;
  return <>{children(user)}</>;
}
