import { useLanguageStore } from '../store/languageStore'
import en from '../locales/en.json'
import am from '../locales/am.json'
import om from '../locales/om.json'
import so from '../locales/so.json'
import ti from '../locales/ti.json'

const translations = { en, am, om, so, ti }

export function useTranslation() {
  const { language } = useLanguageStore()

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      if (value && value[k]) { value = value[k] } else { value = undefined; break }
    }
    if (!value) {
        let enVal = translations['en']
        for (const k of keys) {
          if (enVal && enVal[k]) enVal = enVal[k]
          else return key
        }
        return enVal || key
    }
    return value
  }

  return { t, language }
}
