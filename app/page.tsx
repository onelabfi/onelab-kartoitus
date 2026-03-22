'use client';
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // If already logged in, go straight to app
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/home');
    });
  }, [router]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Hero background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero.png)' }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.75) 100%)' }} />

      {/* Content */}
      <div className="relative flex flex-col justify-end min-h-screen max-w-md mx-auto w-full px-6 pb-16">
        {/* Analyysi badge */}
        <div className="mb-6">
          <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border border-white/20 text-white/70">
            Analyysi: Onelab
          </span>
        </div>

        {/* CTA */}
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold text-lg shadow-2xl active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2563EB 100%)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          Aloita
          <span className="text-xl">→</span>
        </Link>

        <p className="text-center text-xs mt-4 text-white/40">
          Asbestikartoitustyökalu remonttikohteisiin
        </p>
      </div>
    </div>
  );
}
