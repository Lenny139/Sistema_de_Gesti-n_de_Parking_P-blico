import { describe, it, expect, beforeEach } from 'vitest'
import I18n from '../../core/i18n/I18n.js'

describe('I18n', () => {
  beforeEach(() => {
    localStorage.clear()
    // @ts-expect-error - reset singleton
    ;(I18n as any).instance = undefined
  })

  it('debe ser un Singleton', () => {
    const a = I18n.getInstance()
    const b = I18n.getInstance()
    expect(a).toBe(b)
  })

  it('locale por defecto es "es"', () => {
    const i18n = I18n.getInstance()
    expect(i18n.getLocale()).toBe('es')
  })

  it('t() retorna la traducción en español', () => {
    const i18n = I18n.getInstance()
    expect(i18n.t('login')).toBe('Iniciar sesión')
  })

  it('setLocale("en") cambia el idioma', () => {
    const i18n = I18n.getInstance()
    i18n.setLocale('en')
    expect(i18n.getLocale()).toBe('en')
    expect(i18n.t('login')).toBe('Login')
  })

  it('t() con clave inexistente retorna la clave como fallback', () => {
    const i18n = I18n.getInstance()
    expect(i18n.t('clave_que_no_existe')).toBe('clave_que_no_existe')
  })

  it('setLocale persiste en localStorage', () => {
    const i18n = I18n.getInstance()
    i18n.setLocale('en')
    expect(localStorage.getItem('frontend.locale')).toBe('en')
  })
})
