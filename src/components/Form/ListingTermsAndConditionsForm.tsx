import React from 'react'

import { FormLabel } from '../Label'

interface Props {
  handleInputChange: () => void
  termsAndConditions: string
  handleContinue: () => void
}

const ListingTermsAndConditionsForm = ({
  handleInputChange,
  handleContinue,
  termsAndConditions,
}: Props) => (
  <form className="uk-form-stacked uk-flex uk-flex-column full-width">
    <fieldset className="uk-fieldset">
      <div className="uk-margin">
        <FormLabel label="TERMS AND CONDITIONS" />
        <textarea
          className="uk-textarea"
          rows={10}
          onChange={handleInputChange}
          value={termsAndConditions}
          placeholder="What are the terms and conditions of the listing? What are you as responsible for as a vendor? is there a warranty? When is the transaction final? etc"
        />
        <label className="form-label-desciptor">
          If left blank, the listing will display "No terms and conditions entered"
        </label>
      </div>
    </fieldset>
    <div className="submit-btn-div">
      <button className="uk-button uk-button-primary" onClick={handleContinue}>
        CONTINUE
      </button>
    </div>
  </form>
)

export default ListingTermsAndConditionsForm
