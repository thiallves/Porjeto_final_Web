'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { getToken } from '@/src/lib/storage';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => { if (!getToken()) router.push('/login'); }, [router]);
  return <div className="app-shell"><Sidebar /><main className="main-content">{children}</main></div>;
}
