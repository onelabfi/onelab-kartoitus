'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Survey } from '@/lib/supabase';

export default function AdminReportsPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selected, setSelected] = useState<Survey | null>(null);

  useEffect(() => {
    supabase.from('surveys').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setSurveys(data);
    });
  }, []);

  const statusColors: Record<string, string> = { draft: '#6B7280', submitted: '#2563EB', analyzing: '#F59E0B', complete: '#10B981' };
  const statusLabels: Record<string, string> = { draft: 'Luonnos', submitted: 'Lähetetty', analyzing: 'Analysoinnissa', complete: 'Valmis' };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Raportit</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-500">
              <th className="text-left px-5 py-3 font-medium">Asiakas</th>
              <th className="text-left px-5 py-3 font-medium">Kohde</th>
              <th className="text-left px-5 py-3 font-medium">Päivämäärä</th>
              <th className="text-left px-5 py-3 font-medium">Tila</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map(s => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="px-5 py-3">
                  <button
                    onClick={() => setSelected(s)}
                    className="text-left hover:text-blue-600 font-medium transition-colors"
                  >
                    {s.tilaaja_nimi || s.user_id.slice(0, 8) + '...'}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <Link href={`/admin/raportit/${s.id}`} className="text-blue-600 hover:underline font-medium">{s.name}</Link>
                  <p className="text-xs text-gray-400">{s.city}</p>
                </td>
                <td className="px-5 py-3 text-gray-500">{new Date(s.date).toLocaleDateString('fi-FI')}</td>
                <td className="px-5 py-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: statusColors[s.status] }}>
                    {statusLabels[s.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Client details modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-gray-900">Asiakkaan tiedot</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg">👤</span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Nimi</p>
                  <p className="text-sm font-semibold text-gray-900">{selected.tilaaja_nimi || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">✉️</span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Sähköposti</p>
                  {selected.tilaaja_email
                    ? <a href={`mailto:${selected.tilaaja_email}`} className="text-sm font-semibold text-blue-600 hover:underline">{selected.tilaaja_email}</a>
                    : <p className="text-sm text-gray-400">—</p>
                  }
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">📞</span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Puhelin</p>
                  {selected.tilaaja_puhelin
                    ? <a href={`tel:${selected.tilaaja_puhelin}`} className="text-sm font-semibold text-blue-600 hover:underline">{selected.tilaaja_puhelin}</a>
                    : <p className="text-sm text-gray-400">—</p>
                  }
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Kohde</p>
              <p className="text-sm font-medium text-gray-700">{selected.name}</p>
              <p className="text-xs text-gray-400">{selected.city} · {new Date(selected.date).toLocaleDateString('fi-FI')}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Sulje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
