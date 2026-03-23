'use client';

import { useState } from 'react';

const slides = [
  { src: '/slide1.png', caption: 'Lähetys — valmis laboratorioon' },
  { src: '/slide2.png', caption: 'Etusivu — kartoitukset & tila' },
  { src: '/slide3.png', caption: 'Perustiedot — osoite, tilaaja, tyyppi' },
  { src: '/slide4.png', caption: 'Näytteet — sijainti, materiaali, kuva' },
  { src: '/slide5.png', caption: 'Yhteenveto — näytteet ja kuvat' },
];

const FRAME_W = 348;
// same aspect ratio as a phone screen
const FRAME_STYLE: React.CSSProperties = {
  width: FRAME_W,
  aspectRatio: '9/19.5',
  borderRadius: 22,
  overflow: 'hidden',
  border: '4px solid #1C1C1E',
  boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
  background: '#000',
  position: 'relative',
  flexShrink: 0,
};

export default function DemoSection() {
  const [started, setStarted] = useState(false);
  // 0-4 = slides, 5 = report card
  const [current, setCurrent] = useState(0);
  const total = slides.length + 1;
  const isReport = current === slides.length;

  const prev = () => setCurrent(i => Math.max(0, i - 1));
  const next = () => setCurrent(i => Math.min(total - 1, i + 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>

      {/* Phone frame — same size always */}
      <div style={FRAME_STYLE}>
        {!started ? (
          /* Hero image */
          <>
            <img
              src="/layout.png"
              alt="Kartoittaja-sovellus"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Aloita Demo button overlay */}
            <button
              onClick={() => setStarted(true)}
              style={{
                position: 'absolute',
                bottom: 28,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg,#1B3A6B,#2563EB)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                padding: '12px 28px',
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(37,99,235,0.6)',
                whiteSpace: 'nowrap',
                zIndex: 2,
              }}
            >
              ▶ Aloita Demo
            </button>
          </>
        ) : isReport ? (
          /* Report card */
          <div style={{
            width: '100%',
            height: '100%',
            background: '#0D1829',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            padding: 28,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 48 }}>📄</div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 6 }}>
                Saat selkeän vastauksen:
              </p>
              <p style={{ color: '#9CA3AF', fontSize: 13, lineHeight: 1.8, marginBottom: 4 }}>
                – Sisältääkö asbestia<br />
                – Miten purkaa turvallisesti
              </p>
              <p style={{ color: '#60A5FA', fontSize: 13, fontWeight: 600, marginTop: 8 }}>
                Ilman kartoittajaa —<br />vain näytteen hinta
              </p>
            </div>
            <a
              href="/report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg,#1B3A6B,#2563EB)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                padding: '12px 22px',
                borderRadius: 12,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Avaa esimerkkiraportti ↗
            </a>
          </div>
        ) : (
          /* App screenshot */
          <img
            src={slides[current].src}
            alt={slides[current].caption}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
          />
        )}
      </div>

      {/* Navigation (only when started) */}
      {started && (
        <>
          {/* Arrows + dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
            <button
              onClick={prev}
              disabled={current === 0}
              aria-label="Edellinen"
              style={{
                background: current === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: current === 0 ? '#444' : '#fff',
                width: 36, height: 36, borderRadius: '50%',
                cursor: current === 0 ? 'default' : 'pointer',
                fontSize: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >‹</button>

            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Slide ${i + 1}`}
                  style={{
                    width: i === current ? 22 : 7,
                    height: 7,
                    borderRadius: 4,
                    background: i === current ? '#2563EB' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={current === total - 1}
              aria-label="Seuraava"
              style={{
                background: current === total - 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: current === total - 1 ? '#444' : '#fff',
                width: 36, height: 36, borderRadius: '50%',
                cursor: current === total - 1 ? 'default' : 'pointer',
                fontSize: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >›</button>
          </div>

          <p style={{ color: '#6B7280', fontSize: 12, marginTop: 8, textAlign: 'center' }}>
            {isReport ? 'Valmis raportti tilaajalle' : slides[current].caption}
          </p>
        </>
      )}
    </div>
  );
}
