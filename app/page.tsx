import Link from 'next/link';
import Image from 'next/image';
import AuthRedirect from './AuthRedirect';

const features = [
  { icon: '📍', title: 'Google Maps -osoitehaku', desc: 'Kohteen osoite täydentyy automaattisesti — ei kirjoitusvirheitä, ei turhaa aikaa.' },
  { icon: '📷', title: 'Valokuvat näytteistä', desc: 'Ota kuva suoraan sovelluksessa jokaiselle näytteelle. Tallennetaan automaattisesti raporttiin.' },
  { icon: '📄', title: 'Automaattinen PDF-raportti', desc: 'Laboratorio syöttää tulokset ja järjestelmä luo valmiin asbestikartoitusraportin.' },
  { icon: '🔔', title: 'Reaaliaikainen tilastatus', desc: 'Näet heti kun analyysi on valmis ja raportti lähetetty.' },
  { icon: '🔒', title: 'Pakollinen perehdytys', desc: 'Sovellus varmistaa että kartoittaja on perehtynyt turvalliseen näytteenottoon ennen aloitusta.' },
  { icon: '🏗️', title: 'Kohteen tyypin mukainen raportti', desc: 'Pintaremontti, purkukohde tai muu — raportti mukautuu automaattisesti.' },
];

const steps = [
  { n: '1', title: 'Kirjaudu sisään', desc: 'Luo tili tai kirjaudu olemassa olevalla tunnuksella.' },
  { n: '2', title: 'Suorita perehdytys', desc: 'Lue turvalliset näytteenotto-ohjeet — pakollinen ennen ensimmäistä kartoitusta.' },
  { n: '3', title: 'Aloita kartoitus', desc: 'Syötä kohteen tiedot, lisää näytteet ja valokuvat.' },
  { n: '4', title: 'Saat raportin', desc: 'Onelabin laboratorio analysoi näytteet ja lähettää valmiin PDF-raportin.' },
];

export default function LandingPage() {
  return (
    <>
      <AuthRedirect />
      <div style={{ background: '#0A0F1A', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

        {/* NAV */}
        <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1B3A6B,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }} aria-hidden="true">🔬</div>
              <span style={{ fontWeight: 800, fontSize: 16 }}>Onelab Kartoittaja</span>
            </div>
            <Link href="/login" style={{ background: 'linear-gradient(135deg,#1B3A6B,#2563EB)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 22px', borderRadius: 12, textDecoration: 'none' }}>
              Kirjaudu sisään →
            </Link>
          </div>
        </nav>

        <main>
          {/* HERO */}
          <section aria-label="Esittely" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 1.5rem 60px', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 999, padding: '6px 14px', marginBottom: 24 }}>
                <span style={{ color: '#60A5FA', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Analyysi: Onelab Oy</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
                Asbestikartoitus<br />
                <span style={{ color: '#2563EB' }}>tehokkaasti.</span>
              </h1>
              <p style={{ fontSize: 17, color: '#9CA3AF', lineHeight: 1.7, maxWidth: 480, marginBottom: 32 }}>
                Mobiilisovellus asbestinäytteiden keräämiseen, dokumentointiin ja kuvaamiseen.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/login" style={{ background: 'linear-gradient(135deg,#1B3A6B,#2563EB)', color: '#fff', fontWeight: 700, fontSize: 16, padding: '16px 32px', borderRadius: 16, textDecoration: 'none', boxShadow: '0 8px 32px rgba(37,99,235,0.35)' }}>
                  Avaa sovellus →
                </Link>
                <a href="https://onelab.fi" target="_blank" rel="noopener noreferrer" style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#9CA3AF', fontWeight: 600, fontSize: 15, padding: '16px 28px', borderRadius: 16, textDecoration: 'none' }}>
                  onelab.fi ↗
                </a>
              </div>
            </div>
            <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 260 }}>
                <div style={{ borderRadius: 44, overflow: 'hidden', border: '4px solid #1C1C1E', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', aspectRatio: '9/19.5' }}>
                  <Image src="/hero.png" alt="Onelab Kartoittaja mobiilisovellus asbestikartoitukseen" style={{ objectFit: 'cover' }} width={260} height={565} priority />
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section aria-label="Ominaisuudet" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '72px 1.5rem' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>Kaikki mitä tarvitset asbestikartoitukseen</h2>
              <p style={{ color: '#9CA3AF', textAlign: 'center', marginBottom: 48, fontSize: 15 }}>Suunniteltu kentällä työskenteleville kartoittajille</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
                {features.map(({ icon, title, desc }) => (
                  <div key={title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }} aria-hidden="true">{icon}</div>
                    <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{title}</h3>
                    <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section aria-label="Näin se toimii" style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 1.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>Näin se toimii</h2>
            <p style={{ color: '#9CA3AF', textAlign: 'center', marginBottom: 48, fontSize: 15 }}>Ensimmäisestä kirjautumisesta valmiiseen asbestikartoitusraporttiin</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
              {steps.map(({ n, title, desc }) => (
                <div key={n} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#1B3A6B,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, marginBottom: 16 }} aria-hidden="true">{n}</div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Vaihe {n}: {title}</h3>
                  <p style={{ color: '#9CA3AF', fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section aria-label="Aloita" style={{ background: 'linear-gradient(135deg, rgba(27,58,107,0.4), rgba(37,99,235,0.15))', border: '1px solid rgba(37,99,235,0.2)', margin: '0 1.5rem 80px', borderRadius: 28, padding: '56px 32px', textAlign: 'center', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, marginBottom: 12 }}>Valmis aloittamaan?</h2>
            <p style={{ color: '#9CA3AF', fontSize: 15, marginBottom: 32 }}>Rekisteröidy ilmaiseksi ja aloita ensimmäinen asbestikartoitus tänään.</p>
            <Link href="/login" style={{ background: 'linear-gradient(135deg,#1B3A6B,#2563EB)', color: '#fff', fontWeight: 700, fontSize: 16, padding: '18px 40px', borderRadius: 16, textDecoration: 'none', display: 'inline-block' }}>
              Luo tili ilmaiseksi →
            </Link>
          </section>
        </main>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#9CA3AF', fontSize: 13 }}>
            © 2026 Onelab Oy · Asbestikartoitus remonttikohteisiin ·{' '}
            <a href="https://onelab.fi" style={{ color: '#9CA3AF' }}>onelab.fi</a>
          </p>
          <p style={{ color: '#9CA3AF', fontSize: 12, marginTop: 6 }}>
            Tämä sovellus ei korvaa pätevän asbestikartoittajan tekemää virallista kartoitusta.
          </p>
        </footer>
      </div>
    </>
  );
}
