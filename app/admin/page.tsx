'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const PRICE_EX_VAT = 39.90;
const VAT_RATE = 0.255;
const PRICE_WITH_VAT = PRICE_EX_VAT * (1 + VAT_RATE);

function fmt(n: number) {
  return n.toLocaleString('fi-FI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function isToday(d: string) {
  const t = new Date(d), now = new Date();
  return t.getDate() === now.getDate() && t.getMonth() === now.getMonth() && t.getFullYear() === now.getFullYear();
}
function isThisWeek(d: string) {
  return new Date(d) >= new Date(Date.now() - 7 * 86400000);
}
function isThisMonth(d: string) {
  const t = new Date(d), now = new Date();
  return t.getMonth() === now.getMonth() && t.getFullYear() === now.getFullYear();
}

type TxSurvey = { id: string; name: string; tilaaja_nimi: string | null; created_at: string; samples: number };

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, submitted: 0, analyzing: 0, complete: 0, pending: 0 });
  const [paidSurveys, setPaidSurveys] = useState<TxSurvey[]>([]);
  const [txModal, setTxModal] = useState<{ label: string; rows: TxSurvey[] } | null>(null);

  useEffect(() => {
    const paidStatuses = ['submitted', 'analyzing', 'complete'];
    Promise.all([
      supabase.from('surveys').select('id, name, tilaaja_nimi, status, created_at'),
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

      const countBySurvey: Record<string, number> = {};
      for (const s of samples) countBySurvey[s.survey_id] = (countBySurvey[s.survey_id] || 0) + 1;

      const paid: TxSurvey[] = surveys
        .filter(s => paidStatuses.includes(s.status))
        .map(s => ({ id: s.id, name: s.name, tilaaja_nimi: s.tilaaja_nimi, created_at: s.created_at, samples: countBySurvey[s.id] || 0 }));

      setPaidSurveys(paid);
    });
  }, []);

  const totalRevenue = (rows: TxSurvey[]) => rows.reduce((sum, r) => sum + r.samples * PRICE_WITH_VAT, 0);
  const totalVat = (rows: TxSurvey[]) => rows.reduce((sum, r) => sum + r.samples * PRICE_EX_VAT * VAT_RATE, 0);
  const totalExVat = (rows: TxSurvey[]) => rows.reduce((sum, r) => sum + r.samples * PRICE_EX_VAT, 0);

  const periods = [
    { label: 'Tänään', rows: paidSurveys.filter(s => isToday(s.created_at)), color: '#2563EB' },
    { label: 'Tällä viikolla', rows: paidSurveys.filter(s => isThisWeek(s.created_at)), color: '#7C3AED' },
    { label: 'Tässä kuussa', rows: paidSurveys.filter(s => isThisMonth(s.created_at)), color: '#0891B2' },
    { label: 'Yhteensä', rows: paidSurveys, color: '#10B981' },
  ];

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
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Liikevaihto</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        {periods.map(r => (
          <button
            key={r.label}
            onClick={() => setTxModal({ label: r.label, rows: r.rows })}
            className="bg-white rounded-xl p-5 shadow-sm text-left hover:shadow-md transition-shadow cursor-pointer"
          >
            <p className="text-2xl font-bold" style={{ color: r.color }}>{fmt(totalExVat(r.rows))}</p>
            <p className="text-xs text-gray-400 mt-0.5">+ ALV {fmt(totalVat(r.rows))}</p>
            <p className="text-sm text-gray-500 mt-1">{r.label}</p>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mb-8">{paidSurveys.reduce((s,r)=>s+r.samples,0)} näytettä × {fmt(PRICE_EX_VAT)} + ALV 25,5%</p>

      {/* Transactions modal */}
      {txModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={() => setTxModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="font-bold text-lg text-gray-900">Tapahtumat — {txModal.label}</h2>
                <p className="text-sm text-gray-500">{fmt(totalExVat(txModal.rows))} + ALV {fmt(totalVat(txModal.rows))} = {fmt(totalRevenue(txModal.rows))}</p>
              </div>
              <button onClick={() => setTxModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="overflow-y-auto flex-1">
              {txModal.rows.length === 0
                ? <p className="text-center text-gray-400 py-8 text-sm">Ei tapahtumia</p>
                : txModal.rows.map(r => (
                  <Link key={r.id} href={`/admin/raportit/${r.id}`} onClick={() => setTxModal(null)}
                    className="flex items-center justify-between px-5 py-3 border-b hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.tilaaja_nimi || '—'}</p>
                      <p className="text-xs text-gray-400">{r.name} · {new Date(r.created_at).toLocaleDateString('fi-FI')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">{fmt(r.samples * PRICE_EX_VAT)}</p>
                      <p className="text-xs text-gray-400">{r.samples} näyte{r.samples !== 1 ? 'ttä' : ''}</p>
                    </div>
                  </Link>
                ))
              }
            </div>
            <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
              <button onClick={() => setTxModal(null)} className="w-full py-2 rounded-xl text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300">Sulje</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
