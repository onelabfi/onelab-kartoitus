'use client';

import { useState } from 'react';

const slides = [
  { src: '/slide1.png', caption: 'Lähetys — valmis laboratorioon' },
  { src: '/slide2.png', caption: 'Etusivu — kartoitukset & tila' },
  { src: '/slide3.png', caption: 'Perustiedot — osoite, tilaaja, tyyppi' },
  { src: '/slide4.png', caption: 'Näytteet — sijainti, materiaali, kuva' },
  { src: '/slide5.png', caption: 'Yhteenveto — näytteet ja kuvat' },
];

const REPORT_SLIDE = 5;

export default function DemoSection() {
  const [showSlides, setShowSlides] = useState(false);
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => Math.max(0, i - 1));
  const next = () => setCurrent(i => Math.min(slides.length, i + 1)); // slides.length = report card index
  const total = slides.length + 1; // +1 for report card

  const isReport = current === REPORT_SLIDE;

  return (
    <section
      aria-label="Demo"
      style={{ padding: '60px 1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Phone mockup with Aloita Demo button */}
      <div style={{ position: 'relative', width: 260, flexShrink: 0 }}>
        <div style={{
          borderRadius: 32,
          overflow: 'hidden',
          border: '4px solid #1C1C1E',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          aspectRatio: '9/19.5',
        }}>
          <img
            src="/layout.png"
            alt="Kartoittaja-sovellus"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Aloita Demo overlay button */}
        <button
          onClick={() => { setShowSlides(true); setCurrent(0); }}
          style={{
            position: 'absolute',
            bottom: 24,
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
            boxShadow: '0 4px 20px rgba(37,99,235,0.5)',
            whiteSpace: 'nowrap',
          }}
        >
          ▶ Aloita Demo
        </button>
      </div>

      {/* Slideshow — shown after button click */}
      {showSlides && (
        <div style={{ width: '100%', maxWidth: 500, marginTop: 40 }}>
          {/* Slide */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            {/* Prev */}
            <button
              onClick={prev}
              disabled={current === 0}
              aria-label="Edellinen"
              style={{
                background: current === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)',
                border: 'none', color: current === 0 ? '#444' : '#fff',
                width: 40, height: 40, borderRadius: '50%',
                cursor: current === 0 ? 'default' : 'pointer',
                fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >‹</button>

            {/* Phone frame */}
            <div style={{ flexShrink: 0 }}>
              {isReport ? (
                /* Report card */
                <div style={{
                  width: 260,
                  aspectRatio: '9/19.5',
                  borderRadius: 32,
                  border: '4px solid #1C1C1E',
                  background: '#0D1829',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 20,
                  padding: 24,
                  textAlign: 'center',
                  boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
                }}>
                  <div style={{ fontSize: 48 }}>📄</div>
                  <p style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.3 }}>
                    Tämän raportin asiakas saa
                  </p>
                  <a
                    href="/report.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'linear-gradient(135deg,#1B3A6B,#2563EB)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 14,
                      padding: '12px 24px',
                      borderRadius: 12,
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                  >
                    Avaa esimerkkiraportti ↗
                  </a>
                </div>
              ) : (
                <div style={{
                  width: 260,
                  borderRadius: 32,
                  overflow: 'hidden',
                  border: '4px solid #1C1C1E',
                  boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
                  aspectRatio: '9/19.5',
                  background: '#000',
                }}>
                  <img
                    src={slides[current].src}
                    alt={slides[current].caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                  />
                </div>
              )}
            </div>

            {/* Next */}
            <button
              onClick={next}
              disabled={current === REPORT_SLIDE}
              aria-label="Seuraava"
              style={{
                background: current === REPORT_SLIDE ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)',
                border: 'none', color: current === REPORT_SLIDE ? '#444' : '#fff',
                width: 40, height: 40, borderRadius: '50%',
                cursor: current === REPORT_SLIDE ? 'default' : 'pointer',
                fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >›</button>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
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

          {/* Caption */}
          <p style={{ color: '#6B7280', fontSize: 13, textAlign: 'center', marginTop: 10, marginBottom: 0 }}>
            {isReport ? 'Valmis raportti tilaajalle' : slides[current].caption}
          </p>
        </div>
      )}
    </section>
  );
}
