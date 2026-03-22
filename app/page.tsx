'use client';
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/home');
    });
  }, [router]);

  return (
    <div className="min-h-screen" style={{ background: '#0A0F1A' }}>
      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:flex min-h-screen">
        {/* Left: marketing */}
        <div className="flex-1 flex flex-col justify-center px-16 xl:px-24 py-16">
          {/* Logo / brand */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #1B3A6B, #2563EB)' }}>🔬</div>
              <span className="text-white font-bold text-lg tracking-tight">Onelab Kartoittaja</span>
            </div>
            <p className="text-sm" style={{ color: '#6B7280' }}>Asbestikartoitustyökalu</p>
          </div>

          <h1 className="text-5xl xl:text-6xl font-black text-white leading-tight mb-6">
            Asbestikartoitus<br />
            <span style={{ color: '#2563EB' }}>tehokkaasti.</span>
          </h1>

          <p className="text-lg mb-4 max-w-md leading-relaxed" style={{ color: '#9CA3AF' }}>
            Mobiilisovellus asbestikartoittajille — kerää näytteet, dokumentoi kohteet ja lähetä kartoitus suoraan laboratorioon.
          </p>

          <div className="space-y-3 mb-10 max-w-md">
            {[
              { icon: '📍', text: 'Osoitteen automaattitäyttö Google Mapsilla' },
              { icon: '📷', text: 'Valokuvat suoraan jokaiselle näytteelle' },
              { icon: '📄', text: 'Automaattinen PDF-raportti tuloksista' },
              { icon: '🔔', text: 'Reaaliaikainen tilastatus laboratorion kanssa' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="text-sm" style={{ color: '#9CA3AF' }}>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base shadow-xl active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2563EB 100%)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              Avaa kartoittaja-sovellus
              <span className="text-lg">→</span>
            </Link>
            <a
              href="https://onelab.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-sm font-semibold"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}
            >
              onelab.fi ↗
            </a>
          </div>

          <p className="text-xs mt-8" style={{ color: '#4B5563' }}>
            Analyysi: Onelab Oy · Asbestikartoitus remonttikohteisiin
          </p>
        </div>

        {/* Right: phone mockup with hero */}
        <div className="w-[480px] xl:w-[560px] flex items-center justify-center p-16 relative">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.12) 0%, transparent 70%)' }} />
          {/* Phone frame */}
          <div className="relative w-64 xl:w-72">
            <div
              className="rounded-[3rem] overflow-hidden shadow-2xl border-4 aspect-[9/19.5]"
              style={{ borderColor: '#1C1C1E', background: '#1C1C1E', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)' }}
            >
              <img
                src="/hero.png"
                alt="Kartoittaja app"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 rounded-full" style={{ background: '#1C1C1E' }} />
          </div>
        </div>
      </div>

      {/* ── MOBILE LAYOUT (full-screen hero) ── */}
      <div className="md:hidden relative min-h-screen w-full overflow-hidden flex flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero.png)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.8) 100%)' }}
        />
        <div className="relative flex flex-col justify-end min-h-screen max-w-md mx-auto w-full px-6 pb-16">
          <div className="mb-6">
            <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border border-white/20 text-white/70">
              Analyysi: Onelab
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 leading-tight">
            Asbestikartoitus<br />tehokkaasti.
          </h1>
          <p className="text-sm text-white/60 mb-8">
            Mobiilisovellus asbestikartoittajille
          </p>
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
    </div>
  );
}
