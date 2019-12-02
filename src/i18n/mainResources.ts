import translationsEN from './languages/en.json'
import translationsES from './languages/es.json'
import translationsFR from './languages/fr.json'
import translationsPT from './languages/pt.json'
import translationsSV from './languages/sv.json'
import { Localizations } from './LocalizationsInterface.js'

const en = translationsEN as Localizations
const es = translationsES as Localizations
const fr = translationsFR as Localizations
const pt = translationsPT as Localizations
const sv = translationsSV as Localizations

const resources = {
  localizations: {
    en,
    'en-AU': en,
    'en-BZ': en,
    'en-CA': en,
    'en-CB': en,
    'en-GB': en,
    'en-IE': en,
    'en-JM': en,
    'en-NZ': en,
    'en-PH': en,
    'en-TT': en,
    'en-US': en,
    'en-ZA': en,
    'en-ZW': en,
    es,
    'es-AR': es,
    'es-BO': es,
    'es-CL': es,
    'es-CO': es,
    'es-CR': es,
    'es-DO': es,
    'es-EC': es,
    'es-ES': es,
    'es-GT': es,
    'es-HN': es,
    'es-MX': es,
    'es-NI': es,
    'es-PA': es,
    'es-PE': es,
    'es-PR': es,
    'es-PY': es,
    'es-SV': es,
    'es-UY': es,
    'es-VE': es,
    fr,
    'fr-CA': fr,
    'fr-CH': fr,
    'fr-FR': fr,
    'fr-LU': fr,
    'fr-MC': fr,
    sv,
    'sv-FI': sv,
    'sv-SE': sv,
    pt,
    'pt-BR': pt,
    'pt-PT': pt,
  },
}

export default resources
