'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Survey } from '@/lib/supabase';

export default function AdminReportsPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);

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
                <td className="px-5 py-3">{s.tilaaja_nimi || s.user_id.slice(0, 8) + '...'}</td>
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
    </div>
  );
}
