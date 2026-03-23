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
          {companyInfo && <p className="text-[11px] text-white/50">{companyInfo}</p>}
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

export default function PublicReportPage() {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

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
        <p className="text-red-400">Raporttia ei löytynyt.</p>
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
  const ylaista = generateYleista(survey.name, survey.city, survey.kohde_tyyppi, samples);

  const kartoittajaName = appSettings?.kartoittaja_name || 'Kartoittaja';
  const kartoittajaTitle = appSettings?.kartoittaja_title || 'Asbestikartoittaja';
  const kartoittajaCredentials = appSettings?.kartoittaja_credentials || '';
  const companyName = appSettings?.company_name || 'Yritys';
  const logoUrl = appSettings?.logo_url || null;
  const signatureUrl = appSettings?.signature_url || null;

  const kohde = `${survey.name}${survey.city ? ', ' + survey.city : ''}`;

  const page1Logo = logoUrl ? (
    <img src={logoUrl} alt={companyName} className="h-12 mb-2 print:h-10 object-contain" />
  ) : companyName && companyName !== 'Yritys' ? (
    <p className="text-lg font-bold text-white mb-2">{companyName}</p>
  ) : (
    <img src="/kartoittaja-gen.png" alt="Kartoittaja.com" style={{ height: 48, width: 'auto', maxWidth: 130, display: 'block', marginBottom: 8 }} />
  );

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
      {/* PDF button */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg"
        >
          Lataa PDF
        </button>
      </div>

      {/* ═══════════════ PAGE 1: ASBESTIKARTOITUSRAPORTTI ═══════════════ */}
      <div className="max-w-[750px] mx-auto px-4 sm:px-6 pt-8 pb-4 print:px-0 print:py-0 print:max-w-none">
        <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-700 print:rounded-none print:shadow-none print:border-none">
          <ReportHeader
            title="Asbestikartoitusraportti"
            subtitle="Laboratorioanalyysillä varmennettu"
            dateStr={dateStr}
            logo={page1Logo}
            companyInfo={companyName !== 'Yritys' ? companyName : undefined}
          />

          <div className="bg-white p-8 sm:p-10 print:p-0 print:pt-4">
            <table className="w-full mb-6">
              <tbody className="text-[13px]">
                <tr>
                  <td className="py-1 pr-8 text-gray-500 w-40">Näytteenottaja</td>
                  <td className="py-1 font-medium">{survey.tilaaja_nimi || kartoittajaName}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-8 text-gray-500">Kartoituskohde</td>
                  <td className="py-1 font-medium">{kohde}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-8 text-gray-500">Kartoituspäivä</td>
                  <td className="py-1 font-medium">{dateStr}</td>
                </tr>
              </tbody>
            </table>

            <div className="mb-6">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 pr-8 text-gray-500 w-40 align-top">Yleistä kohteesta</td>
                    <td className="py-1">{ylaista}</td>
                  </tr>
                </tbody>
              </table>
            </div>

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
                          <td className="py-1.5">3</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

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
                Näytteenottaja, {survey.tilaaja_nimi || kartoittajaName}
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
          <ReportHeader
            title="ASBESTILABORATORIOANALYYSI"
            subtitle="- Liite kartoitusraporttiin"
            dateStr={dateStr}
            logo={page2Logo}
          />

          <div className="bg-white p-8 sm:p-10 print:p-0 print:pt-4">
            <table className="w-full mb-6">
              <tbody className="text-[13px]">
                <tr>
                  <td className="py-1 pr-8 text-gray-500 w-44">Näytteenottokohde</td>
                  <td className="py-1 font-medium">{kohde}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-8 text-gray-500">Näytteenottaja</td>
                  <td className="py-1 font-medium">{survey.tilaaja_nimi || kartoittajaName}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-8 text-gray-500">Näytteenottopäivä</td>
                  <td className="py-1 font-medium">{dateStr}</td>
                </tr>
              </tbody>
            </table>

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

      <div className="h-8 print:hidden" />

      <style jsx global>{`
        .report-bg {
          background-color: #101921;
        }
        @media print {
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
