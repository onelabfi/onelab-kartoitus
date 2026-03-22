import type { Survey, Sample } from './supabase';

// Static text constants — never change
export const TUTKIMUSMENETELMAT =
  'Näytteiden tutkimiseen on käytetty JEOL LIVE Analysis menetelmää hyödyntäen JEOL pyyhkäisyelektronimikroskooppia (SEM) sekä JEOL LIVE-EDS alkuaineanalysaattoria.';

export const ANALYYSIVARMUUS =
  'LIVE Analysis menetelmässä haetut atomit paikallistetaan reaaliaikaisella JEOL LIVE -ohjelmistolla hyödyntäen reaaliaikaista alkuaineanalysaattoria (LIVE-EDS). Mahdolliset kuidut tunnistetaan niiden molekyylirakenteesta alkuaineanalysaattorilla (EDS). Analyysien virhemahdollisuus on korkeitaan 0,0001 %.';

export const ANALYSOINTIMENETELMA =
  'Näytteiden tutkimiseen on käytetty JEOL LIVE Analysis menetelmää hyödyntäen JEOL pyyhkäisyelektronimikroskooppia (SEM) sekä JEOL LIVE-EDS alkuaineanalysaattoria.';

export const SOPIMUSEHDOT =
  'Yleiset KSE 2013 sopimusehdot koskevat tätä toimeksiantoa. Raportin käyttö tai siihen viittaminen edellyttää toimitusehtoin hyväksymisen.';

export const ONELAB_NAME = 'Onelab';
export const ONELAB_LOGO = '/onelab logo.png';

// Finnish genitive forms for known location names
const LOCATION_GENITIVE: Record<string, string> = {
  'Keittiö': 'Keittiön',
  'KPH': 'KPH:n',
  'WC': 'WC:n',
  'MH': 'MH:n',
  'OH': 'OH:n',
  'Eteinen': 'Eteisen',
  'Kellari': 'Kellarin',
  'Ullakko': 'Ullakon',
  'Katto': 'Katon',
  'Sauna': 'Saunan',
  'Julkisivu': 'Julkisivun',
};

function toGenitive(location: string): string {
  if (LOCATION_GENITIVE[location]) return LOCATION_GENITIVE[location];
  // Fallback: if ends in vowel, add 'n'; otherwise add ':n'
  const vowels = 'aeiouäöåAEIOUÄÖÅ';
  if (vowels.includes(location.slice(-1))) return location + 'n';
  return location + ':n';
}

function getMaterial(s: { material: string; materials: string[] | null; material_muu?: string | null }): string {
  if (s.materials && s.materials.length > 0) {
    const mats = s.materials.filter(m => m !== 'Muu');
    if (s.material_muu) mats.push(s.material_muu);
    return mats.join(', ').toLowerCase();
  }
  return (s.material || '').toLowerCase();
}

export function generateYleista(
  surveyName: string,
  city: string,
  kohde_tyyppi: string | null,
  samples: Array<{
    asbestos_detected: boolean | null;
    location: string;
    material: string;
    materials: string[] | null;
    material_muu?: string | null;
  }>
): string {
  const asbestosSamples = samples.filter(s => s.asbestos_detected === true);
  const cleanSamples = samples.filter(s => s.asbestos_detected === false);
  const hasAsbestos = asbestosSamples.length > 0;
  const hasClean = cleanSamples.length > 0;
  const isPurku = kohde_tyyppi?.toLowerCase().includes('puret') || kohde_tyyppi?.toLowerCase().includes('purettava');
  const isPinta = kohde_tyyppi?.toLowerCase().includes('pinta');

  let base = `Kohde ${surveyName} sijaitsee ${city || 'kohteessa'}. `;

  if (isPurku) {
    base += 'Kohteessa on tarkoitus suorittaa purkutyö. ';
  } else if (isPinta) {
    base += 'Kohteessa on tarkoitus suorittaa pintaremontti. ';
  }

  base +=
    'Kohde kartoitettiin aistinvaraisesti ja näytteistettiin niiltä osin, kun oli epäiltävää, että materiaalissa saattaa olla asbestia tai muita haitta-aineita. ';

  // "no asbestos in any sample" sentence — only for demolition sites
  if (isPurku && !hasAsbestos) {
    base += 'Kohteen rakenteissa ei havaittu asbestia tai muita haitta-aineita kaikissa näytteissä. ';
  }

  if (hasAsbestos) {
    // Build list: "Keittiön liima, WC:n laatta"
    const parts = asbestosSamples.map(s => {
      const loc = toGenitive(s.location);
      const mat = getMaterial(s);
      return `${loc} ${mat}`;
    });

    // Join with comma except last which uses " ja "
    let list: string;
    if (parts.length === 1) {
      list = parts[0];
    } else {
      list = parts.slice(0, -1).join(', ') + ' ja ' + parts[parts.length - 1];
    }

    base += `${list.charAt(0).toUpperCase() + list.slice(1)} sisältää asbestia.`;

    if (hasClean) {
      base += ' Muut tutkitut materiaalit voidaan purkaa normaalipurkuna.';
    }
  } else {
    base += 'Tutkitut materiaalit voidaan purkaa normaalipurkuna.';
  }

  return base;
}
