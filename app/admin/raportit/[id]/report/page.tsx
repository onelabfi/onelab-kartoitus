'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Survey, Sample, AppSettings } from '@/lib/supabase';
import {
  TUTKIMUSMENETELMAT,
  ANALYYSIVARMUUS,
  ANALYSOINTIMENETELMA,
  SOPIMUSEHDOT,
  ONELAB_NAME,
  ONELAB_LOGO,
  generateYleista,
} from '@/lib/reportTexts';

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

function ReportHeader({
  title,
  subtitle,
  dateStr,
  logo,
  companyInfo,
}: {
  title: string;
  subtitle?: string;
  dateStr: string;
  logo?: React.ReactNode;
  companyInfo?: string;
}) {
  return (
    <div
      className="report-header rounded-t-2xl print:rounded-none px-8 sm:px-10 py-6"
      style={{ backgroundColor: '#101921' }}
    >
      <div className="flex items-center justify-between">
        <div>
          {logo}
          {companyInfo && (
            <p className="text-[11px] text-white/50">{companyInfo}</p>
          )}
        </div>
        <div className="text-right">
          <h2 className="text-base font-bold tracking-wide text-white">{title}</h2>
          {subtitle && <p className="text-[11px] text-white/60">{subtitle}</p>}
          <p className="text-[11px] text-white/50 mt-1">{dateStr}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editTilaaja, setEditTilaaja] = useState('');
  const [editKohde, setEditKohde] = useState('');
  const [editYleista, setEditYleista] = useState('');
  const [editPolyavyys, setEditPolyavyys] = useState<Record<string, number>>({});
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  const handleSendReport = async () => {
    if (!survey) return;
    setSending(true);
    setSendStatus('idle');
    try {
      const res = await fetch(`/api/surveys/${survey.id}/send-report`, { method: 'POST' });
      if (res.ok) {
        setSendStatus('sent');
        setSurvey({ ...survey, report_sent_at: new Date().toISOString(), status: 'complete' });
      } else {
        setSendStatus('error');
      }
    } catch {
      setSendStatus('error');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('surveys').select('*').eq('id', id).single(),
      supabase.from('survey_samples').select('*').eq('survey_id', id).order('created_at'),
      supabase.from('app_settings').select('*').eq('id', SETTINGS_ID).single(),
    ])
      .then(([{ data: surveyData }, { data: samplesData }, { data: settingsData }]) => {
        if (surveyData) setSurvey(surveyData);
        if (samplesData) setSamples(samplesData);
        if (settingsData) setAppSettings(settingsData);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (survey && samples) {
      setEditTilaaja('');
      setEditKohde(`${survey.name}${survey.city ? ', ' + survey.city : ''}`);
      setEditYleista(
        generateYleista(survey.name, survey.city, survey.kohde_tyyppi, samples)
      );
      const polyMap: Record<string, number> = {};
      samples.forEach(s => {
        polyMap[s.id] = 3;
      });
      setEditPolyavyys(polyMap);
    }
  }, [survey, samples]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#101921' }}
      >
        <p className="text-gray-400">Ladataan raporttia...</p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#101921' }}
      >
        <p className="text-red-400">Kartoitusta ei löytynyt.</p>
      </div>
    );
  }

  const pendingSamples = samples.filter(s => s.asbestos_detected === null);
  if (pendingSamples.length > 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8"
        style={{ backgroundColor: '#101921' }}
      >
        <div className="max-w-md text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Tulokset puuttuvat</h2>
          <p className="text-gray-600 mb-4">
            Raporttia ei voi luoda ennen kuin kaikkien näytteiden tulokset on syötetty.
          </p>
          <div className="text-left bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Odottavat näytteet:</p>
            {pendingSamples.map((s, i) => (
              <p key={s.id} className="text-sm text-gray-700">
                {i + 1}. {s.location}
                {s.sub_location ? ` · ${s.sub_location}` : ''}
              </p>
            ))}
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            ← Takaisin
          </button>
        </div>
      </div>
    );
  }

  const surveyDate = new Date(survey.date);
  const dateStr = surveyDate.toLocaleDateString('fi-FI', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  const asbestosSamples = samples.filter(s => s.asbestos_detected === true);

  const kartoittajaName = appSettings?.kartoittaja_name || 'Kartoittaja';
  const kartoittajaTitle = appSettings?.kartoittaja_title || 'Asbestikartoittaja';
  const kartoittajaCredentials = appSettings?.kartoittaja_credentials || '';
  const companyName = appSettings?.company_name || 'Yritys';
  const logoUrl = appSettings?.logo_url || null;
  const signatureUrl = appSettings?.signature_url || null;

  // Dynamic logo for page 1 (company logo from settings)
  const page1Logo = logoUrl ? (
    <img src={logoUrl} alt={companyName} className="h-12 mb-2 print:h-10 object-contain" />
  ) : (
    <p className="text-lg font-bold text-white mb-2">{companyName}</p>
  );

  // Onelab logo for page 2
  const page2Logo = (
    <img
      src={ONELAB_LOGO}
      alt={ONELAB_NAME}
      className="h-12 mb-2 print:h-10 object-contain"
      onError={e => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );

  return (
    <div className="min-h-screen report-bg text-gray-900 text-[13px] leading-relaxed">
      {/* Print / action buttons */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg"
          >
            Tulosta / PDF
          </button>
          <button
            onClick={handleSendReport}
            disabled={sending}
            className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 shadow-lg disabled:opacity-50"
          >
            {sending ? 'Lähetetään...' : 'Lähetä raportti'}
          </button>
          <button
            onClick={() => window.history.back()}
            className="bg-white/10 text-white/80 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 shadow-lg backdrop-blur"
          >
            Takaisin
          </button>
        </div>
        {survey.report_sent_at && sendStatus !== 'error' && (
          <p className="text-green-400 text-xs bg-black/40 px-3 py-1 rounded-lg">
            ✓ Lähetetty {new Date(survey.report_sent_at).toLocaleString('fi-FI')}
          </p>
        )}
        {sendStatus === 'sent' && !survey.report_sent_at && (
          <p className="text-green-400 text-xs bg-black/40 px-3 py-1 rounded-lg">
            ✓ Raportti lähetetty
          </p>
        )}
        {sendStatus === 'error' && (
          <p className="text-red-400 text-xs bg-black/40 px-3 py-1 rounded-lg">
            Lähetys epäonnistui. Yritä uudelleen.
          </p>
        )}
      </div>

      {/* ═══════════════ PAGE 1: ASBESTIKARTOITUSRAPORTTI ═══════════════ */}
      <div className="max-w-[750px] mx-auto px-4 sm:px-6 pt-8 pb-4 print:px-0 print:py-0 print:max-w-none">
        <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-700 print:rounded-none print:shadow-none print:border-none">
          {/* Dark header */}
          <ReportHeader
            title="ASBESTIKARTOITUSRAPORTTI"
            dateStr={dateStr}
            logo={page1Logo}
            companyInfo={companyName}
          />

          {/* White content */}
          <div className="bg-white p-8 sm:p-10 print:p-0 print:pt-4">
            {/* Info fields */}
            <table className="w-full mb-6">
              <tbody className="text-[13px]">
                <tr>
                  <td className="py-1 pr-8 text-gray-500 w-40">Kartoittaja</td>
                  <td className="py-1 font-medium">
                    {kartoittajaName}
                    {kartoittajaTitle ? `, ${kartoittajaTitle}` : ''}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-8 text-gray-500">Tilaaja</td>
                  <td className="py-1 font-medium">
                    <input
                      type="text"
                      value={editTilaaja}
                      onChange={e => setEditTilaaja(e.target.value)}
                      placeholder="Tilaajan nimi..."
                      className="w-full bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-0 py-0 font-medium print:border-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-8 text-gray-500">Kartoituskohde</td>
                  <td className="py-1 font-medium">
                    <input
                      type="text"
                      value={editKohde}
                      onChange={e => setEditKohde(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-0 py-0 font-medium print:border-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-8 text-gray-500">Kartoituspäivä</td>
                  <td className="py-1 font-medium">{dateStr}</td>
                </tr>
              </tbody>
            </table>

            {/* Yleistä kohteesta */}
            <div className="mb-6">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 pr-8 text-gray-500 w-40 align-top">Yleistä kohteesta</td>
                    <td className="py-1">
                      <textarea
                        value={editYleista}
                        onChange={e => setEditYleista(e.target.value)}
                        rows={6}
                        className="w-full bg-transparent border border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none rounded px-1 py-0.5 resize-y text-[13px] leading-relaxed print:border-none print:p-0 print:resize-none"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Asbestos materials table */}
            {asbestosSamples.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-2">Asbestia sisältävät materiaalit</h3>
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b border-gray-400">
                      <th className="text-left py-1.5 pr-3 font-semibold text-gray-600">Näyte</th>
                      <th className="text-left py-1.5 pr-3 font-semibold text-gray-600">Sijainti</th>
                      <th className="text-left py-1.5 pr-3 font-semibold text-gray-600">Materiaali</th>
                      <th className="text-left py-1.5 pr-3 font-semibold text-gray-600">Tyyppi</th>
                      <th className="text-left py-1.5 pr-3 font-semibold text-gray-600">m²</th>
                      <th className="text-left py-1.5 font-semibold text-gray-600">Pölyävyys</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asbestosSamples.map((s, i) => {
                      const materialStr = s.materials?.length ? s.materials.join(', ') : s.material;
                      const locationStr = [s.location, s.sub_location].filter(Boolean).join(' · ');
                      return (
                        <tr key={s.id} className="border-b border-gray-200">
                          <td className="py-1.5 pr-3">
                            {s.sample_code || `N-${String(i + 1).padStart(3, '0')}`}
                          </td>
                          <td className="py-1.5 pr-3">{locationStr}</td>
                          <td className="py-1.5 pr-3">{materialStr || '-'}</td>
                          <td className="py-1.5 pr-3 text-red-700 font-medium">
                            {s.asbestos_type || '-'}
                          </td>
                          <td className="py-1.5 pr-3">{s.area_m2 ?? '-'}</td>
                          <td className="py-1.5">
                            <input
                              type="number"
                              value={editPolyavyys[s.id] ?? 3}
                              onChange={e =>
                                setEditPolyavyys(prev => ({
                                  ...prev,
                                  [s.id]: Number(e.target.value),
                                }))
                              }
                              className="w-12 bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-0 py-0 text-center print:border-none"
                              min={1}
                              max={5}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tutkimusmenetelmät */}
            <div className="mb-4">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 pr-8 text-gray-500 w-40 align-top">Tutkimusmenetelmät</td>
                    <td className="py-1">{TUTKIMUSMENETELMAT}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Analyysivarmuus */}
            <div className="mb-8">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 pr-8 text-gray-500 w-40 align-top">Analyysivarmuus</td>
                    <td className="py-1">{ANALYYSIVARMUUS}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature */}
            <hr className="border-gray-300 mb-4" />
            <div className="ml-40">
              {signatureUrl && (
                <img
                  src={signatureUrl}
                  alt="Allekirjoitus"
                  className="h-16 mb-1 print:h-14"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <p className="font-medium">
                {kartoittajaName}, {kartoittajaTitle}
              </p>
              {kartoittajaCredentials && (
                <p className="text-[11px] text-gray-500">{kartoittajaCredentials}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ PAGE 2: LABORATORIOANALYYSI ═══════════════ */}
      <div className="max-w-[750px] mx-auto px-4 sm:px-6 py-4 print:px-0 print:py-0 print:max-w-none page-break-before">
        <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-700 print:rounded-none print:shadow-none print:border-none">
          {/* Dark header with Onelab logo */}
          <ReportHeader
            title="ASBESTILABORATORIOANALYYSI"
            subtitle="- Liite kartoitusraporttiin"
            dateStr={dateStr}
            logo={page2Logo}
            companyInfo={ONELAB_NAME}
          />

          {/* White content */}
          <div className="bg-white p-8 sm:p-10 print:p-0 print:pt-4">
            {/* Info fields */}
            <table className="w-full mb-6">
              <tbody className="text-[13px]">
                <tr>
                  <td className="py-1 pr-8 text-gray-500 w-44">Tilaaja</td>
                  <td className="py-1 font-medium">{editTilaaja || '—'}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-8 text-gray-500">Näytteenottokohde</td>
                  <td className="py-1 font-medium">{editKohde}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-8 text-gray-500">Näytteenottaja</td>
                  <td className="py-1 font-medium">{kartoittajaName}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-8 text-gray-500">Näytteenottopäivä</td>
                  <td className="py-1 font-medium">{dateStr}</td>
                </tr>
              </tbody>
            </table>

            {/* Laboratoriotulokset */}
            <h3 className="text-sm font-semibold mb-2">Laboratoriotulokset</h3>
            <table className="w-full border-collapse text-[12px] mb-6">
              <thead>
                <tr className="border-b-2 border-gray-400">
                  <th className="text-left py-1.5 pr-3 font-semibold text-gray-600 w-12">Näyte</th>
                  <th className="text-left py-1.5 pr-3 font-semibold text-gray-600">Sijainti</th>
                  <th className="text-left py-1.5 pr-3 font-semibold text-gray-600">Materiaali</th>
                  <th className="text-left py-1.5 font-semibold text-gray-600">Tulos</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((s, i) => {
                  const materialStr = s.materials?.length ? s.materials.join(', ') : s.material;
                  const locationStr = [s.location, s.sub_location].filter(Boolean).join(' · ');
                  const tulos =
                    s.asbestos_detected === true
                      ? `Sisältää asbestia: ${s.asbestos_type || 'tyyppi tuntematon'}`
                      : 'Ei sisällä asbestia';
                  return (
                    <tr key={s.id} className="border-b border-gray-200">
                      <td className="py-2 pr-3">
                        {s.sample_code || `N-${String(i + 1).padStart(3, '0')}`}
                      </td>
                      <td className="py-2 pr-3">{locationStr}</td>
                      <td className="py-2 pr-3">{materialStr || '-'}</td>
                      <td
                        className={`py-2 ${s.asbestos_detected ? 'text-red-700 font-semibold' : ''}`}
                      >
                        {tulos}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Analysointimenetelmä */}
            <div className="mb-4">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 pr-8 text-gray-500 w-44 align-top">
                      Analysointimenetelmä
                    </td>
                    <td className="py-1">{ANALYSOINTIMENETELMA}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Sopimusehdot */}
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 pr-8 text-gray-500 w-44 align-top">Sopimusehdot</td>
                    <td className="py-1">{SOPIMUSEHDOT}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Sample photos */}
            {samples.some(s => s.photo_url) && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold mb-4">Näytekuvat</h3>
                <div className="space-y-4">
                  {samples.map((s, i) => {
                    if (!s.photo_url) return null;
                    const materialStr = s.materials?.length ? s.materials.join(', ') : s.material;
                    const locationStr = [s.location, s.sub_location].filter(Boolean).join(' · ');
                    return (
                      <div key={s.id} className="mb-4 break-inside-avoid">
                        <img
                          src={s.photo_url}
                          alt={`Näyte ${i + 1}`}
                          className="max-w-full max-h-[400px] object-contain rounded border border-gray-200"
                        />
                        <p className="text-[12px] text-gray-600 mt-1">
                          {s.sample_code || `N-${String(i + 1).padStart(3, '0')}`}: {locationStr}
                          {materialStr ? `, ${materialStr}` : ''}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-8 print:hidden" />

      {/* Print styles */}
      <style jsx global>{`
        .report-bg {
          background-color: #101921;
        }
        @media print {
          aside,
          nav,
          .print\\:hidden {
            display: none !important;
          }
          .report-bg {
            background: white !important;
          }
          .report-header {
            background-color: #101921 !important;
            break-inside: avoid;
          }
          body {
            background: white !important;
          }
          @page {
            margin: 10mm;
            size: A4;
          }
          .page-break-before {
            break-before: page;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          textarea,
          input {
            border: none !important;
            outline: none !important;
            resize: none !important;
          }
        }
        @media screen {
          .page-break-before {
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  );
}
