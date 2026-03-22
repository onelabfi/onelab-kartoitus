import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Asbesti remonttikohteessa — Mitä pitää tietää | Onelab',
  description: 'Asbesti remonttikohteessa on vakava turvallisuusriski. Lue mistä materiaaleista asbestia löytyy, mitä laki vaatii ennen remonttia ja miten toimitaan kun asbestia löydetään.',
  keywords: 'asbesti remontti, asbesti vanha talo, asbestia kylpyhuoneessa, asbestia lattiassa, asbesti ennen purkua, asbestipitoinen materiaali',
  openGraph: {
    title: 'Asbesti remonttikohteessa — Mitä pitää tietää',
    description: 'Mistä asbestia löytyy, mitä laki vaatii ennen remonttia ja miten toimitaan kun asbestia löydetään vanhoissa rakennuksissa.',
    url: 'https://onelab-kartoitus.vercel.app/asbesti-remontti',
    siteName: 'Onelab Kartoittaja',
    locale: 'fi_FI',
    type: 'article',
  },
};

const page = { background: '#0A0F1A', color: '#fff', fontFamily: 'system-ui, sans-serif', minHeight: '100vh' } as const;
const nav = { background: '#0A0F1A', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem' } as const;
const navInner = { maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 } as const;
const wrap = { maxWidth: 820, margin: '0 auto', padding: '64px 1.5rem 80px' } as const;
const badge = { display: 'inline-flex', alignItems: 'center', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 999, padding: '6px 14px', marginBottom: 24 } as const;
const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 } as const;
const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, margin: '32px 0' } as const;
const warn = { background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 16, padding: 24, margin: '32px 0' } as const;
const danger = { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16, padding: 24, margin: '32px 0' } as const;
const cta = { background: 'linear-gradient(135deg,#1B3A6B,#2563EB)', color: '#fff', fontWeight: 700, fontSize: 16, padding: '16px 32px', borderRadius: 16, textDecoration: 'none', display: 'inline-block', marginTop: 8 } as const;
const muted = { color: '#9CA3AF' } as const;
const divider = { border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '40px 0' } as const;
const table = { width: '100%', borderCollapse: 'collapse' as const, fontSize: 14, margin: '24px 0' };
const th = { textAlign: 'left' as const, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' as const, letterSpacing: '0.05em' };
const td = { padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 14, color: '#D1D5DB', verticalAlign: 'top' as const };

const materials = [
  { material: 'Lattialaatat ja -liimat', location: 'Keittiö, kylpyhuone, eteinen', risk: 'Korkea', years: 'Ennen 1990' },
  { material: 'Vinyylimatot ja muovimatto', location: 'Kaikki tilat', risk: 'Korkea', years: 'Ennen 1990' },
  { material: 'Tasoitteet ja saumausaineet', location: 'Seinät, katot', risk: 'Keski', years: 'Ennen 1994' },
  { material: 'Putkieristeet', location: 'Kellari, tekniset tilat', risk: 'Erittäin korkea', years: 'Ennen 1990' },
  { material: 'Ruiskutusmassat (akustiikka)', location: 'Katot, käytävät', risk: 'Erittäin korkea', years: 'Ennen 1980' },
  { material: 'Eterniittilevyt', location: 'Julkisivu, katto', risk: 'Keski', years: 'Ennen 1994' },
  { material: 'Ilmastointikanavien eristeet', location: 'Tekninen tila, ullakko', risk: 'Korkea', years: 'Ennen 1988' },
  { material: 'Patteritiivisteet', location: 'Kaikki tilat', risk: 'Keski', years: 'Ennen 1990' },
];

export default function AsbestiRemonttiPage() {
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
            Asbesti remonttikohteessa —<br />
            <span style={{ color: '#2563EB' }}>mitä sinun tulee tietää</span>
          </h1>

          <p style={{ fontSize: 17, ...muted, lineHeight: 1.8, marginBottom: 40, maxWidth: 680 }}>
            Asbesti on vaarallinen kuitumineraali, jota käytettiin rakennusmateriaaleissa laajasti Suomessa aina 1990-luvun alkuun asti. Remonttikohteessa asbestin kohtaaminen on todennäköistä — ja vaarallista, ellei siihen varauduta oikein.
          </p>

          <div style={danger} role="alert" aria-label="Tärkeä varoitus">
            <p style={{ fontWeight: 700, marginBottom: 8, color: '#FCA5A5' }}>🚨 Älä pura ennen kartoitusta</p>
            <p style={{ ...muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              Asbestikuituja vapautuu ilmaan kun asbestipitoisia materiaaleja rikotaan, hiotaan tai leikataan. Hengitetyt kuidut aiheuttavat vakavia keuhkosairauksia — asbestoosin, keuhkopussin muutoksia ja syöpää. Oireet voivat ilmetä vasta 20–40 vuotta altistuksen jälkeen.
            </p>
          </div>

          <hr style={divider} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 16 }}>Mistä materiaaleista asbestia löytyy?</h2>
          <p style={{ ...muted, fontSize: 15, lineHeight: 1.8, marginBottom: 8 }}>
            Suomalaisissa rakennuksissa asbestia käytettiin yli 3 000 eri tuotteessa. Alla on yleisimmät riskimateriaalit ja niiden sijainnit.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Materiaali</th>
                  <th style={th}>Tyypillinen sijainti</th>
                  <th style={th}>Riskitaso</th>
                  <th style={th}>Ajanjakso</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.material}>
                    <td style={{ ...td, fontWeight: 600, color: '#fff' }}>{m.material}</td>
                    <td style={td}>{m.location}</td>
                    <td style={{ ...td, color: m.risk === 'Erittäin korkea' ? '#FCA5A5' : m.risk === 'Korkea' ? '#FCD34D' : '#86EFAC' }}>{m.risk}</td>
                    <td style={td}>{m.years}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr style={divider} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 24 }}>Miten tunnistaa asbestipitoisuuden riski?</h2>

          <div style={cardGrid}>
            {[
              { icon: '📅', title: 'Tarkista rakennusvuosi', desc: 'Jos rakennus on valmistunut ennen 1994, asbestipitoisuus on mahdollinen. Ennen 1980 rakennetuissa riski on erityisen suuri.' },
              { icon: '📋', title: 'Selvitä materiaalit', desc: 'Pyydä rakennuksen asiakirjat taloyhtiöltä tai rakennusvalvonnasta. Aiemmissa remonteissa tehdyt kartoitukset ovat arvokasta tietoa.' },
              { icon: '🔍', title: 'Aistinvarainen arviointi', desc: 'Tasoitteet, liimat ja eristeet joita ei voi luotettavasti tunnistaa visuaalisesti täytyy näytteistää.' },
              { icon: '🧪', title: 'Laboratorionäyte', desc: 'Ainoa varma tapa selvittää asbestipitoisuus on laboratorioanalyysi. Silmämääräinen tarkastus ei riitä.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={card}>
                <div style={{ fontSize: 28, marginBottom: 12 }} aria-hidden="true">{icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</h3>
                <p style={{ ...muted, fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          <hr style={divider} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 24 }}>Mitä tehdä kun asbestia löytyy?</h2>

          <ol style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
            {[
              { n: '1', title: 'Älä riko tai liikuta materiaalia', desc: 'Ehjä asbestipitoinen materiaali ei ole välitön terveysvaaraa, jos sitä ei häiritä. Riskit syntyvät kun kuituja vapautuu ilmaan.' },
              { n: '2', title: 'Merkitse asbestipitoinen alue', desc: 'Varoita muita rakentajia ja työmaan henkilöstöä asbestilöydöksestä. Merkitse alue selvästi.' },
              { n: '3', title: 'Tilaa asbestipurku ammattilaiselta', desc: 'Asbestipitoisten materiaalien purku vaatii asbestipurkutyön pätevyyden (lupa Aluehallintavirastolta). Älä yritä itse.' },
              { n: '4', title: 'Huolehdi dokumentoinnista', desc: 'Asbestipurusta tulee tehdä kirjallinen turvallisuussuunnitelma ja toimittaa ilmoitus työterveys- ja turvallisuusviranomaiselle.' },
              { n: '5', title: 'Jätteenkäsittely', desc: 'Asbestijäte on ongelmajätettä. Se tulee pakata tiiviisti, merkitä asianmukaisesti ja toimittaa hyväksyttyyn vastaanottopaikaan.' },
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

          <div style={warn} role="note" aria-label="Pintaremonttivinkki">
            <p style={{ fontWeight: 700, marginBottom: 8, color: '#FDE047' }}>💡 Pintaremontti vs. purkukohde</p>
            <p style={{ ...muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              Pintaremontissa (maalataan, tapetoitaan, uusi lattia vanhan päälle) asbestipitoinen materiaali voidaan usein jättää paikoilleen, jos se on ehjä. Purkutyössä kaikki asbestipitoinen materiaali on poistettava ennen varsinaisia töitä.
            </p>
          </div>

          <hr style={divider} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 16 }}>Dokumentoi remonttikohteen kartoitus digitaalisesti</h2>
          <p style={{ ...muted, fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
            Onelab Kartoittaja on mobiilisovellus asbestinäytteiden dokumentointiin remonttikohteessa. Kirjaa sijainti Google Maps -osoitehaulla, valokuvaa näytteet ja lähetä tiedot laboratorioon — raportti valmistuu automaattisesti.
          </p>
          <Link href="/login" style={cta}>Aloita kartoitus ilmaiseksi →</Link>

          <hr style={divider} />

          <nav aria-label="Lisää aiheesta">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Lue myös</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <li><Link href="/asbestinäyte" style={{ color: '#60A5FA', textDecoration: 'none', fontSize: 15 }}>→ Miten asbestinäyte otetaan</Link></li>
              <li><Link href="/asbestikartoitus-ohjeet" style={{ color: '#60A5FA', textDecoration: 'none', fontSize: 15 }}>→ Asbestikartoitus — ohjeet ja vaatimukset</Link></li>
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
