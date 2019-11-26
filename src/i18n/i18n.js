import languages from './lang.json'
import mainResources from './mainResources'

export default class i18n {
  /**
   * @type {string}
   * @desc Sets the locale for the entire app, components are automatically
   * updated. **Note:** please use i18n.setLanguage() since it has safeguards.
   */
  language = 'en'

  /**
   * @type {string}
   * @desc Fallback language to use when the locale resource is not available
   * for the set language.
   */
  fallback = 'en'

  /**
   * Serves as a proxy to force the object to be accepted by the coverage check.
   * @param {*} data any valid javascript object
   */
  bypass(data) {
    return data
  }

  cache = {}

  /**
   * @desc Sets the language, silently does nothing if passed with an invalid language
   * code.
   * @param {*} lang Language code to switch locale to.
   */
  setLanguage(lang) {
    if (!lang) {
      return
    }
    if (Object.values(languages).includes(lang)) {
      this.language = lang
    } else {
      this.language = 'en'
    }
  }

  /**
   * @desc Sets the fallback language, has the same behaviour as `setLanguage`.
   * @param {*} lang Language code to use as a fallback.
   */
  setFallback(lang) {
    if (Object.values(languages).includes(lang)) {
      this.fallback = lang
    } else {
      throw Error(`${lang} is not a valid language-code`)
    }
  }

  /**
   * @desc Forces the locale to use a specified language as a fallback. Used when
   * specifiying locale resource.
   * @example
   * mainResources = {
   *    Greeting : {
   *      en: 'Hello world',
   *      jp: 'おはよう世界さん',
   *      jp-ok: this.fallbackTo('jp') //Will use jp's 'おはよう世界さん'
   *    }
   * }
   * @param {*} lang Language to use as a fallback. Note: the resource must exist.
   */
  fallbackTo(lang) {
    return `!!Fallback->${lang}`
  }

  /**
   * @type {object}
   * @desc Returns the lanuage codes and it's English name.
   * To get just the codes call `Object.keys(i18n.languages)`
   */
  get languages() {
    function swap(json) {
      const ret = {}
      Object.entries(json).forEach(x => {
        const [val, key] = x
        ret[key] = val
      })
      return ret
    }
    return swap(languages)
  }

  /**
   * @returns {object}
   * @desc Returns a compiled resource object depending on what locale has been
   * selected.
   */
  get get() {
    if (Object.keys(this.cache).includes(this.language)) {
      return this.cache[this.language]
    }

    const compiled = {}
    const t = this
    if (!t.resources) {
      t.resources = {}
    }
    t.resources = Object.assign(t.resources, mainResources)

    Object.keys(t.resources).forEach(resourceName => {
      let resource = t.resources[resourceName][this.language]
      if (typeof resource == 'string') {
        if (resource && resource.startsWith('!!Fallback')) {
          const i18nFallback = resource.split('->')[1]
          resource = t.resources[resourceName][i18nFallback]
        }
      }

      if (!resource) {
        resource = t.resources[resourceName][this.fallback]
      }

      compiled[resourceName] = resource
    })

    let handler = {
      get(t, name) {
        return t[name]
      },
    }
    this.cache[this.language] = new Proxy(compiled, handler)
    return compiled
  }

  /**
   * Formats the resource string, used since you can't use string templates.
   * @param {stringTemplate} name The resource to format.
   * @param  {...any} formatArgs The data to populate the template string with.
   * @example
   * Locale.format('Hello {0} {1}', 'A', 'B') // Returns 'Hello A B'
   */
  format(stringTemplate, ...formatArgs) {
    const text = stringTemplate.replace(/{(\d+)}/g, (match, number) => {
      if (typeof formatArgs[number] !== 'undefined') {
        return formatArgs[number]
      }
      return match
    })
    return text
  }
}