import React from 'react'

import { localeInstance } from '../../i18n'

const TermsOfService = () => {
  const { tosPage } = localeInstance.get.localizations

  return (
    <form className="uk-form-stacked">
      <fieldset className="uk-fieldset">
        <legend id="form-title" className="uk-legend color-primary">
          {tosPage.header}
        </legend>
      </fieldset>
      <div className="uk-margin">
        <textarea id="terms" className="uk-textarea" rows={18} value={tosPage.tos} disabled />
      </div>
    </form>
  )
}

export default TermsOfService
