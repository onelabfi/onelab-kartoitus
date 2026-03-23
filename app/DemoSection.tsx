'use client';

import { useState } from 'react';
import Link from 'next/link';

const slides = [
  { src: '/slide2.png', caption: 'Etusivu — kartoitukset & tila' },
  { src: '/slide3.png', caption: 'Perustiedot — osoite, tilaaja, tyyppi' },
  { src: '/slide4.png', caption: 'Näytteet — sijainti, materiaali, kuva' },
  { src: '/slide1.png', caption: 'Lähetys — valmis laboratorioon' },
  { src: '/slide5.png', caption: 'Yhteenveto — näytteet ja kuvat' },
];

export default function DemoSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => (i - 1 + slides.length) % slides.length);
  const next = () => setCurrent(i => (i + 1) % slides.length);

  return (
    <section
      aria-label="Demo"
      style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '80px 1.5rem' }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

        {/* Heading */}
        <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, marginBottom: 8 }}>
          Katso miten se toimii
        </h2>
        <p style={{ color: '#9CA3AF', fontSize: 15, marginBottom: 40 }}>
          Kolme vaihetta — kohde, näytteet, lähetys
        </p>

        {/* Phone mockup slideshow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
          <button
            onClick={prev}
            aria-label="Edellinen"
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            ‹
          </button>

          <div style={{ position: 'relative', width: 220, flexShrink: 0 }}>
            <div style={{ borderRadius: 36, overflow: 'hidden', border: '4px solid #1C1C1E', boxShadow: '0 32px 64px rgba(0,0,0,0.6)', aspectRatio: '9/19.5', background: '#000' }}>
              <img
                src={slides[current].src}
                alt={slides[current].caption}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>

          <button
            onClick={next}
            aria-label="Seuraava"
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? '#2563EB' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }}
            />
          ))}
        </div>

        <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 64 }}>{slides[current].caption}</p>

        {/* Benefit text */}
        <div style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 20, padding: '32px 24px', marginBottom: 48, display: 'inline-block', textAlign: 'left', maxWidth: 480 }}>
          <p style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Saat selkeän vastauksen:</p>
          <p style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.8 }}>
            – Sisältääkö asbestia<br />
            – Miten purkaa turvallisesti
          </p>
        </div>

        {/* Report preview */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Tämän raportin asiakas saa</p>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', height: 480, position: 'relative' }}>
            <iframe
              src="https://onelab-kartoitus.vercel.app/r/e04846e5-263b-4d76-a2bd-749d531a8215"
              title="Esimerkkikartoitusraportti"
              style={{ width: '100%', height: '100%', border: 'none', background: '#101921' }}
              loading="lazy"
            />
            {/* Overlay to prevent interaction */}
            <div style={{ position: 'absolute', inset: 0, cursor: 'default' }} />
          </div>
          <a
            href="https://onelab-kartoitus.vercel.app/r/e04846e5-263b-4d76-a2bd-749d531a8215"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: 12, color: '#60A5FA', fontSize: 13, textDecoration: 'none' }}
          >
            Avaa raportti kokonaan ↗
          </a>
        </div>

        {/* Pricing callout */}
        <div style={{ background: 'linear-gradient(135deg, rgba(27,58,107,0.5), rgba(37,99,235,0.2))', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 20, padding: '36px 24px', marginBottom: 40 }}>
          <p style={{ fontSize: 'clamp(1.2rem,3vw,1.6rem)', fontWeight: 800, marginBottom: 8 }}>
            Ilman kartoittajaa —<br />vain näytteen hinta
          </p>
          <p style={{ color: '#9CA3AF', fontSize: 14 }}>
            Ei konsulttihintoja. Ota näytteet itse, laboratorio analysoi, saat virallisen raportin.
          </p>
        </div>

        <Link
          href="/login"
          style={{ background: 'linear-gradient(135deg,#1B3A6B,#2563EB)', color: '#fff', fontWeight: 700, fontSize: 16, padding: '18px 40px', borderRadius: 16, textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 32px rgba(37,99,235,0.35)' }}
        >
          Aloita →
        </Link>
      </div>
    </section>
  );
}
