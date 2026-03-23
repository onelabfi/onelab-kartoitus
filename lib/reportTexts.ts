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
export const ONELAB_LOGO = '/onelab-logo.png';

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

// Map sub_location codes to Finnish genitive
function subLocGenitive(sub: string | null | undefined): string {
  if (!sub) return '';
  if (sub.includes('Seinä') || sub.startsWith('S')) return 'seinän ';
  if (sub.includes('Lattia') || sub.startsWith('L')) return 'lattian ';
  return '';
}

export function generateYleista(
  surveyName: string,
  city: string,
  kohde_tyyppi: string | null,
  samples: Array<{
    asbestos_detected: boolean | null;
    location: string;
    sub_location?: string | null;
    material: string;
    materials: string[] | null;
    material_muu?: string | null;
  }>,
  katto?: string | null,
  runko?: string | null,
): string {
  const asbestosSamples = samples.filter(s => s.asbestos_detected === true);
  const cleanSamples = samples.filter(s => s.asbestos_detected === false);
  const hasAsbestos = asbestosSamples.length > 0;
  const hasClean = cleanSamples.length > 0;
  const isPurku = kohde_tyyppi?.toLowerCase().includes('puret') || kohde_tyyppi?.toLowerCase().includes('purettava');
  const isPinta = kohde_tyyppi?.toLowerCase().includes('pinta');

  // Opening sentence: "Kohteessa X ollaan tekemässä pintaremonttia/purkutyötä."
  let base: string;
  if (isPurku) {
    if (katto && runko) {
      const kattoAdj = katto.toLowerCase() + 'kattoinen';
      const runkoNoun = runko.toLowerCase() + 'rakennus';
      base = `Kohteessa ${surveyName} on tarkoitus purkaa ${kattoAdj} ${runkoNoun}. `;
    } else {
      base = `Kohteessa ${surveyName} ollaan tekemässä purkutyötä. `;
    }
  } else if (isPinta) {
    base = `Kohteessa ${surveyName} ollaan tekemässä pintaremonttia. `;
  } else {
    base = `Kohde ${surveyName} kartoitettiin asbestin varalta. `;
  }

  base +=
    'Kohde tarkastettiin aistinvaraisesti ja näytteitä otettiin epäilyttävistä materiaaleista mahdollisen asbestin tai muiden haitta-aineiden selvittämistä varten. ';

  if (hasAsbestos) {
    // Build list: "KPH:n seinän laatta, laasti" / "KPH:n lattian laasti"
    const parts = asbestosSamples.map(s => {
      const loc = toGenitive(s.location);
      const sub = subLocGenitive(s.sub_location);
      const mat = getMaterial(s);
      return `${loc} ${sub}${mat}`;
    });

    let list: string;
    if (parts.length === 1) {
      list = parts[0];
    } else {
      list = parts.slice(0, -1).join(', ') + ' ja ' + parts[parts.length - 1];
    }

    base += `${list.charAt(0).toUpperCase() + list.slice(1)} sisältää asbestia.`;

    if (hasClean) {
      base += ' Muut tutkitut materiaalit voidaan tulosten perusteella purkaa normaalipurkuna.';
    }
  } else {
    base += 'Materiaalit voidaan tulosten perusteella purkaa normaalipurkuna.';
  }

  base += ' Tulokset perustuvat näytteenottoon ja laboratorioanalyysiin.';

  return base;
}
