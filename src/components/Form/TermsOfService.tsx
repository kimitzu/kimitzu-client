import React from 'react'

import tos from '../../constants/TermsOfService.json'

// TODO: move somewhere else
const termsOfService = tos.content

const TermsOfService = () => (
  <form className="uk-form-stacked">
    <fieldset className="uk-fieldset">
      <legend id="form-title" className="uk-legend color-primary">
        Terms of Service
      </legend>
    </fieldset>
    <div className="uk-margin">
      <textarea id="terms" className="uk-textarea" rows={18} value={termsOfService} disabled />
    </div>
  </form>
)

export default TermsOfService
