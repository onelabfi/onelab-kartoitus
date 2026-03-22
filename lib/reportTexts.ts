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

export function generateYleista(
  surveyName: string,
  city: string,
  kohde_tyyppi: string | null,
  samples: Array<{ asbestos_detected: boolean | null }>
): string {
  const hasAsbestos = samples.some(s => s.asbestos_detected === true);
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

  if (hasAsbestos) {
    base +=
      'Kohteen rakenteissa ei havaittu asbestia tai muita haitta-aineita kaikissa näytteissä. Osassa näytteitä havaittiin asbestia.';
  } else {
    base +=
      'Kohteen rakenteissa ei havaittu asbestia tai muita haitta-aineita. Materiaalit voidaan purkaa normaalipurkuna.';
  }

  return base;
}
