'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';
import { AuthProvider } from '@/lib/AuthContext';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/login');
    });
  }, [router]);

  return (
    <AuthProvider>
      <div className="min-h-screen pb-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-md mx-auto">
          {children}
        </div>
        <BottomNav />
      </div>
    </AuthProvider>
  );
}
