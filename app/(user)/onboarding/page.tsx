'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/useOnboarding';

const steps = [
  {
    icon: '⚠️',
    title: 'Mitä on asbesti?',
    content: 'Asbesti on vaarallinen kuitumateriaali. Altistuminen tapahtuu hengittämällä mikroskooppisia kuituja. Pitkäaikainen altistuminen voi aiheuttaa vakavia keuhkosairauksia, mukaan lukien syöpää.',
  },
  {
    icon: '🏠',
    title: 'Missä asbestia esiintyy?',
    content: 'Ennen vuotta 1994 rakennetuissa kohteissa asbesti on yleistä. Tyypillisiä paikkoja: lattialaatat ja liimat, putkieristeet, tasoitteet, saumat, vesikatto, ja parvekelaatat.',
  },
  {
    icon: '💨',
    title: 'Pölyävyys',
    content: 'Arvio 1–5:\n1 = Ehjä, ei pölyä\n2 = Lievä pölyävyys\n3 = Pölyää käsiteltäessä\n4 = Pölyää helposti\n5 = Erittäin pölyävä / mureneva\n\nMitä korkeampi arvo, sitä vaarallisempi purkaa.',
  },
  {
    icon: '🧪',
    title: 'Näytteenotto',
    content: 'Vältä turhaa pölyämistä. Älä riko materiaalia enempää kuin tarvitaan. Käytä suojavarusteita (hengityssuojain, hanskat). Ota pieni pala ja laita heti suljettavaan astiaan.',
  },
  {
    icon: '📏',
    title: 'Työkalun rajaus',
    content: 'Tämä työkalu soveltuu pieniin kohteisiin (asunto, kylpyhuone, yksittäinen tila). Laajoissa tai monimutkaisissa kohteissa käytä pätevää asbestikartoittajaa.',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { complete } = useOnboarding();
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState(false);

  const isLast = step === steps.length - 1;
  const current = steps[step];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
            Pakollinen perehdytys
          </span>
          <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>
            {step + 1} / {steps.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-1 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%`, background: 'linear-gradient(90deg, #2563EB, #3B82F6)' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4">
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-5xl mb-4">{current.icon}</div>
          <h2 className="text-xl font-bold text-white mb-3">{current.title}</h2>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {current.content}
          </p>
        </div>

        {/* Final step confirmation */}
        {isLast && (
          <div className="mb-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0 transition-all"
                style={{
                  background: checked ? '#2563EB' : 'rgba(255,255,255,0.08)',
                  border: checked ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.15)',
                }}
                onClick={() => setChecked(!checked)}
              >
                {checked && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Olen lukenut ja ymmärtänyt kaikki ohjeet
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-6">
        <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Tämä työkalu ei korvaa pätevän asbestikartoittajan tekemää virallista kartoitusta.
        </p>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-10 pt-4 flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-3.5 rounded-2xl font-semibold text-sm"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
          >
            Takaisin
          </button>
        )}
        {!isLast ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2563EB 100%)' }}
          >
            Seuraava →
          </button>
        ) : (
          <button
            disabled={!checked}
            onClick={() => { complete(); router.replace('/home'); }}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-all"
            style={{
              background: checked ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' : 'rgba(255,255,255,0.1)',
              opacity: checked ? 1 : 0.5,
            }}
          >
            ✓ Aloita kartoitus
          </button>
        )}
      </div>
    </div>
  );
}
