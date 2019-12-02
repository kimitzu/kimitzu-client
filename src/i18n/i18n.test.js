import { localeInstance, i18n } from '.'

describe('Internationalization', () => {
  it('Should properly initialize object', () => {
    expect(localeInstance).toEqual({ language: 'en', fallback: 'en', cache: {}, resources: {} })
  })

  it('Should switch language', () => {
      const locale = new i18n()
      locale.setLanguage('tl')
      expect(locale).toEqual({ language: 'tl', fallback: 'en', cache: {}, resources: {} })
  })

  it('Should translate from EN to ES', () => {
      const locale = new i18n()
      expect(locale.get.localizations.usernameLabel).toEqual('Username')
      locale.setLanguage('es')
      expect(locale.get.localizations.usernameLabel).toEqual('Nombre de usuario')
  })

  it('Should fallback to EN if translation is not found', () => {
    const locale = new i18n()
    expect(locale.get.localizations.usernameLabel).toEqual('Username')
    locale.setLanguage('tl')
    expect(locale.get.localizations.usernameLabel).toEqual('Username')
})
})
