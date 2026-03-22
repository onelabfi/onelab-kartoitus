import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Asbestikartoitus — Ohjeet, vaatimukset ja vaiheet | Onelab',
  description: 'Asbestikartoitus on lakisääteinen selvitys ennen purkutyötä tai remonttia vanhoissa rakennuksissa. Lue mitä asbestikartoitus tarkoittaa, mitä se maksaa ja miten se tehdään.',
  keywords: 'asbestikartoitus, asbestikartoitus ohjeet, asbestikartoitus vaatimukset, asbestikartoitus hinta, asbestikartoitus ennen purkua',
  openGraph: {
    title: 'Asbestikartoitus — Ohjeet, vaatimukset ja vaiheet',
    description: 'Kaikki mitä sinun tulee tietää asbestikartoituksesta — milloin se vaaditaan, miten se tehdään ja mitä se maksaa.',
    url: 'https://onelab-kartoitus.vercel.app/asbestikartoitus-ohjeet',
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
const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, margin: '32px 0' } as const;
const warn = { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16, padding: 24, margin: '32px 0' } as const;
const infoBox = { background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: 16, padding: 24, margin: '32px 0' } as const;
const cta = { background: 'linear-gradient(135deg,#1B3A6B,#2563EB)', color: '#fff', fontWeight: 700, fontSize: 16, padding: '16px 32px', borderRadius: 16, textDecoration: 'none', display: 'inline-block', marginTop: 8 } as const;
const muted = { color: '#9CA3AF' } as const;
const divider = { border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '40px 0' } as const;

export default function AsbestikartoitusOhjeetPage() {
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
            Asbestikartoitus —<br />
            <span style={{ color: '#2563EB' }}>ohjeet ja vaatimukset</span>
          </h1>

          <p style={{ fontSize: 17, ...muted, lineHeight: 1.8, marginBottom: 40, maxWidth: 680 }}>
            Asbestikartoitus on systemaattinen selvitys rakennuksen asbestipitoisista materiaaleista. Se on lakisääteinen vaatimus ennen purkutyötä tai merkittävää remonttia kaikissa ennen vuotta 1994 rakennetuissa rakennuksissa.
          </p>

          <div style={warn} role="note" aria-label="Lakisääteinen vaatimus">
            <p style={{ fontWeight: 700, marginBottom: 8, color: '#FCA5A5' }}>📋 Lakisääteinen vaatimus</p>
            <p style={{ ...muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              Työturvallisuuslaki (738/2002) ja valtioneuvoston asetus asbestityöstä (798/2015) velvoittavat teettämään asbestikartoituksen ennen purkutöitä. Laiminlyönnistä voi seurata sakko tai rakennustyön keskeytys.
            </p>
          </div>

          <hr style={divider} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 16 }}>Milloin asbestikartoitus vaaditaan?</h2>
          <p style={{ ...muted, fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
            Asbestikartoitus on pakollinen aina kun ennen vuotta 1994 rakennetussa rakennuksessa tehdään töitä, jotka voivat rikkoa tai häiritä asbestipitoisia materiaaleja.
          </p>

          <div style={cardGrid}>
            {[
              { icon: '🏚️', title: 'Kokonaan purettava rakennus', desc: 'Koko rakennuksen purkaminen edellyttää täydellistä asbestikartoitusta kaikista rakenteista.' },
              { icon: '🚿', title: 'Märkätilat ja kylpyhuoneet', desc: 'Kylpyhuoneet, saunat ja wc-tilat sisältävät usein asbestipitoisia laattaliimoja ja tasoitteita.' },
              { icon: '🏠', title: 'Lattiaremontti', desc: 'Vanhat vinyylimatot, muovimatto ja niiden alusliimat ovat yleisiä asbestilähteitä.' },
              { icon: '🔨', title: 'Väliseinien purku', desc: 'Levyseinät ja niiden tasoitteet sekä akustiikkalevyt saattavat sisältää asbestia.' },
              { icon: '🌡️', title: 'LVIS-remontti', desc: 'Putkieristeet, hormit ja patterit voivat olla asbestipitoisia vanhoissa rakennuksissa.' },
              { icon: '🏗️', title: 'Julkisivuremontti', desc: 'Eterniittilevyt, julkisivutasoitteet ja ikkunatiivisteet saattavat sisältää asbestia.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={card}>
                <div style={{ fontSize: 28, marginBottom: 12 }} aria-hidden="true">{icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</h3>
                <p style={{ ...muted, fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          <hr style={divider} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 24 }}>Asbestikartoituksen vaiheet</h2>

          <ol style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
            {[
              { n: '1', title: 'Rakennuksen esiselvitys', desc: 'Selvitetään rakennusvuosi, käytetyt rakennusmateriaalit ja aiemmat remontit piirustuksista ja asiakirjoista.' },
              { n: '2', title: 'Aistinvarainen tarkastus', desc: 'Kartoittaja käy läpi kaikki tilat ja tunnistaa visuaalisesti epäilyttävät materiaalit: tasoitteet, liimat, levyt, eristeet, tiivisteet.' },
              { n: '3', title: 'Näytteenotto', desc: 'Epäilyttävistä materiaaleista otetaan pieniä näytteitä, jotka merkitään ja pakataan huolellisesti laboratoriota varten.' },
              { n: '4', title: 'Laboratorioanalyysi', desc: 'Onelabin laboratorio analysoi näytteet ja selvittää asbestipitoisuuden sekä asbestilajin.' },
              { n: '5', title: 'Kartoitusraportti', desc: 'Tuloksista laaditaan kirjallinen asbestikartoitusraportti, jossa luetellaan asbestipitoiset materiaalit ja niiden sijainnit.' },
              { n: '6', title: 'Jatkotoimenpiteet', desc: 'Raportin perusteella suunnitellaan asbestinpurku tai -suojaus pätevän asbestipurkuurakoitsijan toimesta ennen varsinaisia töitä.' },
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

          <hr style={divider} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 16 }}>Asbestikartoitusraportti</h2>
          <p style={{ ...muted, fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
            Asbestikartoitusraportti on virallinen dokumentti, joka tulee säilyttää koko rakennuksen elinkaaren ajan. Hyvä asbestikartoitusraportti sisältää:
          </p>
          <ul style={{ ...muted, fontSize: 15, lineHeight: 2.2, paddingLeft: 24, marginBottom: 24 }}>
            <li>Kohteen perustiedot: osoite, rakennusvuosi, kohdetyyppi</li>
            <li>Kartoitusmenetelmä ja käytetyt laitteet</li>
            <li>Lista tutkituista materiaaleista ja sijainneista</li>
            <li>Laboratorioanalyysitulokset jokaisesta näytteestä</li>
            <li>Asbestipitoisten materiaalien sijainti rakennuksessa</li>
            <li>Pölyävyysluokitus (1–5) kullekin materiaalille</li>
            <li>Toimenpidesuositukset</li>
          </ul>

          <div style={infoBox} role="note" aria-label="Pölyävyysluokitus">
            <p style={{ fontWeight: 700, marginBottom: 12, color: '#93C5FD' }}>📊 Pölyävyysluokitus 1–5</p>
            <ul style={{ ...muted, fontSize: 14, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
              <li><strong style={{ color: '#fff' }}>1</strong> — Ehjä, ei pölyä — normaalipurku</li>
              <li><strong style={{ color: '#fff' }}>2</strong> — Lievä pölyävyys — varoitoimenpiteet</li>
              <li><strong style={{ color: '#fff' }}>3</strong> — Pölyää käsiteltäessä — asbestipurku</li>
              <li><strong style={{ color: '#fff' }}>4</strong> — Pölyää helposti — asbestipurku suljettuna</li>
              <li><strong style={{ color: '#fff' }}>5</strong> — Erittäin pölyävä / mureneva — erityistoimenpiteet</li>
            </ul>
          </div>

          <hr style={divider} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 16 }}>Dokumentoi kartoitus digitaalisesti</h2>
          <p style={{ ...muted, fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
            Onelab Kartoittaja -sovellus on mobiilityökalu asbestikartoituksen dokumentointiin. Kirjaa näytteet, valokuvat ja sijaintitiedot suoraan puhelimella — laboratorio syöttää tulokset ja raportti luodaan automaattisesti.
          </p>
          <Link href="/login" style={cta}>Aloita kartoitus →</Link>

          <hr style={divider} />

          <nav aria-label="Lisää aiheesta">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Lue myös</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <li><Link href="/asbestinäyte" style={{ color: '#60A5FA', textDecoration: 'none', fontSize: 15 }}>→ Miten asbestinäyte otetaan</Link></li>
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
