import en from './en.js'
import es from './es.js'

type Locale = 'es' | 'en'
type Dictionary = Record<string, string>

export default class I18n {
  private static instance: I18n
  private locale: Locale
  private readonly dictionaries: Record<Locale, Dictionary>

  private constructor() {
    const saved = localStorage.getItem('frontend.locale')
    this.locale = saved === 'en' ? 'en' : 'es'
    this.dictionaries = {
      es: es as Dictionary,
      en: en as Dictionary,
    }
  }

  static getInstance(): I18n {
    if (!I18n.instance) {
      I18n.instance = new I18n()
    }

    return I18n.instance
  }

  t(key: string): string {
    return this.dictionaries[this.locale][key] ?? key
  }

  setLocale(locale: Locale): void {
    if (this.locale === locale) {
      return
    }

    this.locale = locale
    localStorage.setItem('frontend.locale', locale)

    window.dispatchEvent(
      new CustomEvent('localeChanged', {
        detail: { locale },
      }),
    )
  }

  getLocale(): Locale {
    return this.locale
  }
}
