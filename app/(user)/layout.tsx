'use client';
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/login');
    });
  }, [router]);

  return (
    <div className="min-h-screen pb-20" style={{ background: '#1C1C1E' }}>
      <div className="max-w-md mx-auto">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
