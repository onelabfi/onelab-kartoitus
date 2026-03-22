'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, submitted: 0, analyzing: 0, complete: 0 });

  useEffect(() => {
    supabase.from('surveys').select('status').then(({ data }) => {
      if (!data) return;
      setStats({
        total: data.length,
        submitted: data.filter(s => s.status === 'submitted').length,
        analyzing: data.filter(s => s.status === 'analyzing').length,
        complete: data.filter(s => s.status === 'complete').length,
      });
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Kaikki', value: stats.total, color: '#1B2B4B' },
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
    </div>
  );
}
