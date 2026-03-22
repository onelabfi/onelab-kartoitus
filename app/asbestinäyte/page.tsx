import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Asbestinäyte — Miten otetaan ja miksi | Onelab Kartoittaja',
  description: 'Asbestinäyte on pieni materiaalinäyte, joka analysoidaan laboratoriossa asbestipitoisuuden selvittämiseksi. Lue miten asbestinäyte otetaan turvallisesti ja mitä tapahtuu analyysin jälkeen.',
  keywords: 'asbestinäyte, asbestinäytteenotto, asbestianalyysi, asbestikartoitus, asbestinäyte laboratorio',
  openGraph: {
    title: 'Asbestinäyte — Miten otetaan ja miksi',
    description: 'Asbestinäyte selvittää sisältääkö rakennusmateriaali asbestia. Lue ohjeet turvalliseen näytteenottoon.',
    url: 'https://onelab-kartoitus.vercel.app/asbestinäyte',
    siteName: 'Onelab Kartoittaja',
    locale: 'fi_FI',
    type: 'article',
  },
};

const nav = { background: '#0A0F1A', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem' } as const;
const navInner = { maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 } as const;
const page = { background: '#0A0F1A', color: '#fff', fontFamily: 'system-ui, sans-serif', minHeight: '100vh' } as const;
const wrap = { maxWidth: 820, margin: '0 auto', padding: '64px 1.5rem 80px' } as const;
const badge = { display: 'inline-flex', alignItems: 'center', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 999, padding: '6px 14px', marginBottom: 24 } as const;
const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, margin: '32px 0' } as const;
const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 } as const;
const warn = { background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 16, padding: 24, margin: '32px 0' } as const;
const cta = { background: 'linear-gradient(135deg,#1B3A6B,#2563EB)', color: '#fff', fontWeight: 700, fontSize: 16, padding: '16px 32px', borderRadius: 16, textDecoration: 'none', display: 'inline-block', marginTop: 8 } as const;
const muted = { color: '#9CA3AF' } as const;
const divider = { border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '40px 0' } as const;

export default function AsbestinäytePage() {
  return (
    <div style={page}>
      <nav style={nav} aria-label="Sivuston navigaatio">
        <div style={navInner}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1B3A6B,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }} aria-hidden="true">🔬</div>
            <span style={{ fontWeight: 800, fontSize: 16 }}>Onelab Kartoittaja</span>
          </Link>
          <Link href="/login" style={{ background: 'linear-gradient(135deg,#1B3A6B,#2563EB)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 22px', borderRadius: 12, textDecoration: 'none' }}>
            Kirjaudu sisään →
          </Link>
        </div>
      </nav>

      <main>
        <article style={wrap}>
          <div style={badge}>
            <span style={{ color: '#60A5FA', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Analyysi: Onelab Oy</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>
            Asbestinäyte —<br />
            <span style={{ color: '#2563EB' }}>mitä se on ja miksi se otetaan</span>
          </h1>

          <p style={{ fontSize: 17, ...muted, lineHeight: 1.8, marginBottom: 40, maxWidth: 680 }}>
            Asbestinäyte on pieni pala rakennusmateriaalia, joka lähetetään laboratorioon analysoitavaksi. Analyysi selvittää, sisältääkö materiaali asbestia ja kuinka paljon. Ennen remonttia tai purkutyötä asbestinäytteenotto on usein lakisääteinen vaatimus.
          </p>

          <hr style={divider} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 24 }}>Milloin asbestinäyte on tarpeen?</h2>

          <div style={cardGrid}>
            {[
              { icon: '🏗️', title: 'Ennen purkutyötä', desc: 'Rakennuksen purkaminen tai isompi remontti ennen 1994 rakennuksessa vaatii asbestikartoituksen.' },
              { icon: '🚿', title: 'Kylpyhuoneremontti', desc: 'Vanhoissa laatatuissa tiloissa liimat, tasoitteet ja eristeet voivat sisältää asbestia.' },
              { icon: '🏠', title: 'Lattiaremontti', desc: 'Vinyylimatot, linoleum ja niiden alusliimat ovat tyypillisiä asbestipitoisuuden lähteitä.' },
              { icon: '🔧', title: 'Putkistoremontti', desc: 'Putkien eristyksissä ja liitosmateriaaleissa saattaa esiintyä asbestia.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={card}>
                <div style={{ fontSize: 28, marginBottom: 12 }} aria-hidden="true">{icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</h3>
                <p style={{ ...muted, fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          <hr style={divider} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 24 }}>Miten asbestinäyte otetaan?</h2>

          <ol style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
            {[
              { n: '1', title: 'Tunnista epäiltävä materiaali', desc: 'Materiaalit, joissa ennen 1994 saattoi olla asbestia: tasoitteet, liimat, vinyylimatot, putki- ja levyeristeet, ruiskutusmassat.' },
              { n: '2', title: 'Suojaudu ennen ottoa', desc: 'Käytä hengityssuojainta (vähintään P2-luokka) ja suojahansikkaita. Kostuta materiaali kevyesti ennen ottoa pölyn minimoimiseksi.' },
              { n: '3', title: 'Ota pieni näyte', desc: 'Irrota varovasti noin 1–2 cm² kokoinen pala materiaalista. Vältä turhaa murentamista ja pölyn muodostumista.' },
              { n: '4', title: 'Merkitse ja pakkaa', desc: 'Laita näyte suljettuun muovipussiin ja merkitse selvästi: sijainti, materiaali, ottopäivä.' },
              { n: '5', title: 'Toimita laboratorioon', desc: 'Toimita näyte Onelabin laboratorioon postitse tai henkilökohtaisesti. Tulokset saapuvat yleensä 1–3 arkipäivässä.' },
            ].map(({ n, title, desc }) => (
              <li key={n} style={{ display: 'flex', gap: 20, marginBottom: 28, alignItems: 'flex-start' }}>
                <div style={{ minWidth: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#1B3A6B,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }} aria-hidden="true">{n}</div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{title}</h3>
                  <p style={{ ...muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div style={warn} role="note" aria-label="Turvallisuushuomio">
            <p style={{ fontWeight: 700, marginBottom: 8, color: '#FDE047' }}>⚠️ Tärkeä turvallisuushuomio</p>
            <p style={{ ...muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              Jos olet epävarma materiaalin asbestipitoisuudesta, käsittele sitä aina asbestia sisältävänä. Älä riko tai murenna materiaalia ilman asianmukaista suojausta. Asbestikuidut ovat hengitysteille vaarallisia eivätkä näy paljain silmin.
            </p>
          </div>

          <hr style={divider} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 16 }}>Mitä laboratorio analysoi?</h2>
          <p style={{ ...muted, fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
            Onelabin laboratorio analysoi näytteen polarisaatiomikroskopialla (PLM) tai pyyhkäisyelektronimikroskopialla (SEM). Analyysi tunnistaa asbestimineraalit ja niiden pitoisuuden materiaalissa. Tuloksena saat kirjallisen raportin, jossa ilmoitetaan:
          </p>
          <ul style={{ ...muted, fontSize: 15, lineHeight: 2, paddingLeft: 24 }}>
            <li>Sisältääkö materiaali asbestia (kyllä / ei)</li>
            <li>Asbestityyppi: krysotiili, antofylliitti, krokidoliitti tai muu</li>
            <li>Arvioitu pitoisuus prosentteina</li>
            <li>Suositukset jatkotoimenpiteistä</li>
          </ul>

          <hr style={divider} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 16 }}>Dokumentoi näytteet Onelab Kartoittaja -sovelluksella</h2>
          <p style={{ ...muted, fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
            Onelab Kartoittaja -sovellus on suunniteltu helpottamaan asbestinäytteenoton dokumentointia kentällä. Sovelluksessa voit kirjata näytteen sijainnin, materiaalin, ottaa valokuvan ja lähettää tiedot suoraan laboratorioon — kaikki puhelimella.
          </p>
          <Link href="/login" style={cta}>Avaa Onelab Kartoittaja →</Link>

          <hr style={divider} />

          <nav aria-label="Lisää aiheesta">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Lue myös</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <li><Link href="/asbestikartoitus-ohjeet" style={{ color: '#60A5FA', textDecoration: 'none', fontSize: 15 }}>→ Asbestikartoitus — ohjeet ja vaatimukset</Link></li>
              <li><Link href="/asbesti-remontti" style={{ color: '#60A5FA', textDecoration: 'none', fontSize: 15 }}>→ Asbesti remonttikohteessa</Link></li>
            </ul>
          </nav>

          <footer style={{ marginTop: 64, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 32, textAlign: 'center' }}>
            <p style={{ ...muted, fontSize: 13 }}>© 2026 Onelab Oy · <a href="https://onelab.fi" style={{ color: '#6B7280' }}>onelab.fi</a></p>
            <p style={{ color: '#6B7280', fontSize: 11, marginTop: 6 }}>Tämä sivusto ei korvaa pätevän asbestikartoittajan tekemää virallista kartoitusta.</p>
          </footer>
        </article>
      </main>
    </div>
  );
}
