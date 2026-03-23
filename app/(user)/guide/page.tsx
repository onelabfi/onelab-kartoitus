'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/useOnboarding';

const steps = [
  {
    icon: '🧪',
    title: 'Ota näyte',
    content: [
      'Valitse epäilyttävä materiaali (esim. laatta, liima, tasoite)',
      'Ota pieni pala varovasti (noin 2–5 cm)',
      'Vältä pölyn muodostumista',
      'Käytä tarvittaessa suojavarusteita (esim. hengityssuojain, hanskat)',
      'Sulje näyte tiiviiseen näytepussiin',
    ],
  },
  {
    icon: '📝',
    title: 'Täytä tiedot',
    content: [
      'Täytä Kartoittajan pyytämät tiedot',
      'Kohteen tiedot (osoite tai kuvaus)',
      'Näytteen sijainti (esim. kylpyhuoneen lattia)',
      'Valokuva näytekohdasta',
      'Varmista, että tiedot vastaavat otettua näytettä',
    ],
  },
  {
    icon: '📦',
    title: 'Toimita lab',
    content: [
      'Ota näyte ja sulje se tiiviisti näytepussiin',
      'Ota valokuva näytekohdasta (mistä näyte otettiin)',
      'Ota valokuva suljetusta näytepussista niin, että merkintä näkyy selkeästi',
      'Toimita tai postita näyte laboratorioon',
      'Onelab, Ukkohauentie 11–13 A, 02170 Espoo',
      'Seuraa analyysin etenemistä sovelluksessa',
    ],
  },
  {
    icon: '📊',
    title: 'Tulokset',
    content: [
      'Näyte analysoidaan laboratoriossa',
      'Saat ilmoituksen, kun tulokset ovat valmiit',
      'Raportti sisältää selkeän tiedon asbestin esiintymisestä',
      'Raportti täyttää asbestilainsäädännön vaatimukset',
    ],
  },
];

export default function GuidePage() {
  const router = useRouter();
  const { completed } = useOnboarding();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col pb-28" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <button
          onClick={() => router.back()}
          className="text-sm mb-6 flex items-center gap-1"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          ← Takaisin
        </button>
        <h1 className="text-2xl font-bold text-white mb-1">Näytteenotto-ohje</h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Seuraa näitä vaiheita turvalliseen näytteenottoon
        </p>
      </div>

      {/* Visual step row */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-center">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all"
                  style={{
                    background: openIndex === i ? 'rgba(37,99,235,0.25)' : 'rgba(255,255,255,0.05)',
                    border: openIndex === i ? '1.5px solid #2563EB' : '1.5px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {step.icon}
                </div>
                <span className="text-[9px] font-semibold text-center leading-tight" style={{ color: openIndex === i ? '#60A5FA' : 'rgba(255,255,255,0.35)', maxWidth: 52 }}>
                  {step.title}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className="w-8 h-[2px] mx-1 mb-4 rounded-full" style={{ background: 'rgba(37,99,235,0.4)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Expandable cards */}
      <div className="px-6 space-y-2">
        {steps.map((step, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden transition-all"
            style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <button
              className="w-full px-5 py-4 flex items-center justify-between text-left"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{step.icon}</span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Vaihe {i + 1}
                  </span>
                  <p className="text-white font-semibold text-sm leading-tight">{step.title}</p>
                </div>
              </div>
              <span className="text-lg font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {openIndex === i ? '−' : '+'}
              </span>
            </button>
            {openIndex === i && (
              <ul className="px-5 pb-4 space-y-2">
                {step.content.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Warning block */}
      <div className="mx-6 mt-5 p-4 rounded-2xl" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.35)' }}>
        <p className="text-sm font-semibold text-yellow-400 mb-1">⚠️ Muista</p>
        <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Jos olet epävarma materiaalista, vältä sen käsittelyä ja toimi varoen.
        </p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Tarvittaessa käytä suojavarusteita.
        </p>
      </div>

      {/* CTA */}
      <div className="px-6 mt-5">
        <button
          onClick={() => completed ? router.push('/kartoitukset/uusi') : router.push('/onboarding')}
          className="w-full py-4 rounded-2xl font-bold text-white text-base"
          style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2563EB 100%)' }}
        >
          {completed ? 'Aloita kartoitus →' : 'Suorita perehdytys ensin →'}
        </button>

        <p className="text-xs text-center mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Tämä ohje ei korvaa pätevän asbestikartoittajan tekemää virallista kartoitusta.
        </p>
      </div>
    </div>
  );
}
