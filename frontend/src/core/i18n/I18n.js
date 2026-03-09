import en from './en.js';
import es from './es.js';
export default class I18n {
    constructor() {
        const saved = localStorage.getItem('frontend.locale');
        this.locale = saved === 'en' ? 'en' : 'es';
        this.dictionaries = {
            es: es,
            en: en,
        };
    }
    static getInstance() {
        if (!I18n.instance) {
            I18n.instance = new I18n();
        }
        return I18n.instance;
    }
    t(key) {
        return this.dictionaries[this.locale][key] ?? key;
    }
    setLocale(locale) {
        if (this.locale === locale) {
            return;
        }
        this.locale = locale;
        localStorage.setItem('frontend.locale', locale);
        window.dispatchEvent(new CustomEvent('localeChanged', {
            detail: { locale },
        }));
    }
    getLocale() {
        return this.locale;
    }
}
