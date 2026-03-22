'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/login') { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.replace('/admin/login'); return; }
      supabase.from('admin_users').select('id').eq('user_id', data.session.user.id).single()
        .then(({ data: admin }) => {
          if (!admin) { router.replace('/admin/login'); return; }
          setAuthed(true);
          setLoading(false);
        });
    });
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-400">...</p></div>;
  if (!authed) return null;

  const logout = async () => { await supabase.auth.signOut(); router.replace('/admin/login'); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-slate-900 text-white flex flex-col">
        <div className="p-5 border-b border-slate-700">
          <p className="font-bold text-sm">Admin</p>
          <p className="text-xs text-slate-400 mt-0.5">Asbestikartoitus</p>
        </div>
        <nav className="flex-1 py-4">
          {[
            { href: '/admin', label: 'Dashboard', icon: '📊' },
            { href: '/admin/raportit', label: 'Raportit', icon: '📋' },
          ].map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${pathname === item.href ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button onClick={logout} className="text-sm text-slate-400 hover:text-white">🚪 Kirjaudu ulos</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
