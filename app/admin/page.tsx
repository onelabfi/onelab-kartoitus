'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const PRICE_PER_SAMPLE = 39.90;
const VAT = 0.255;
const PRICE_WITH_VAT = PRICE_PER_SAMPLE * (1 + VAT); // ~50.07€

function fmt(n: number) {
  return n.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function isThisWeek(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return d >= weekAgo;
}

function isThisMonth(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, submitted: 0, analyzing: 0, complete: 0, pending: 0 });
  const [revenue, setRevenue] = useState({ today: 0, week: 0, month: 0, total: 0, sampleCount: 0 });

  useEffect(() => {
    const paidStatuses = ['submitted', 'analyzing', 'complete'];

    Promise.all([
      supabase.from('surveys').select('id, status, created_at'),
      supabase.from('survey_samples').select('survey_id'),
    ]).then(([{ data: surveys }, { data: samples }]) => {
      if (!surveys || !samples) return;

      setStats({
        total: surveys.length,
        submitted: surveys.filter(s => s.status === 'submitted').length,
        analyzing: surveys.filter(s => s.status === 'analyzing').length,
        complete: surveys.filter(s => s.status === 'complete').length,
        pending: surveys.filter(s => s.status === 'pending_payment').length,
      });

      // Count samples per survey
      const samplesBySurvey: Record<string, number> = {};
      for (const s of samples) {
        samplesBySurvey[s.survey_id] = (samplesBySurvey[s.survey_id] || 0) + 1;
      }

      const paidSurveys = surveys.filter(s => paidStatuses.includes(s.status));

      let today = 0, week = 0, month = 0, total = 0, totalSamples = 0;
      for (const s of paidSurveys) {
        const n = samplesBySurvey[s.id] || 0;
        const amount = n * PRICE_WITH_VAT;
        total += amount;
        totalSamples += n;
        if (isToday(s.created_at)) today += amount;
        if (isThisWeek(s.created_at)) week += amount;
        if (isThisMonth(s.created_at)) month += amount;
      }

      setRevenue({ today, week, month, total, sampleCount: totalSamples });
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Kaikki', value: stats.total, color: '#1B2B4B' },
          { label: 'Odottaa maksua', value: stats.pending, color: '#EF4444' },
          { label: 'Lähetetty', value: stats.submitted, color: '#2563EB' },
          { label: 'Analysoinnissa', value: stats.analyzing, color: '#F59E0B' },
          { label: 'Valmiit', value: stats.complete, color: '#10B981' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue meter */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Liikevaihto <span className="text-sm font-normal text-gray-400">sis. ALV 25,5%</span></h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tänään', value: revenue.today, color: '#2563EB' },
          { label: 'Tällä viikolla', value: revenue.week, color: '#7C3AED' },
          { label: 'Tässä kuussa', value: revenue.month, color: '#0891B2' },
          { label: 'Yhteensä', value: revenue.total, color: '#10B981' },
        ].map(r => (
          <div key={r.label} className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-2xl font-bold" style={{ color: r.color }}>{fmt(r.value)}</p>
            <p className="text-sm text-gray-500 mt-1">{r.label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">Laskenta: {revenue.sampleCount} näytettä × {fmt(PRICE_WITH_VAT)}/näyte</p>
    </div>
  );
}
