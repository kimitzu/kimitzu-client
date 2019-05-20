import React from 'react'

import { FormSelector } from '../Selector'

import './RegistrationForm.css'

interface Props {
  [key: string]: any
}

const RegistrationForm = (props: Props) => (
  <form className="uk-form-stacked">
    <fieldset className="uk-fieldset">
      <div className="uk-margin">
        <label className="uk-form-label color-primary">FULL NAME</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" placeholder="John Doe" />
        </div>
      </div>
      <div className="uk-margin">
        <label className="uk-form-label color-primary">DESCRIPTION</label>
        <div className="uk-form-controls">
          <textarea
            id="description"
            className="uk-textarea"
            rows={3}
            placeholder="Say something..."
          />
        </div>
      </div>
      <div className="uk-margin">
        <label className="uk-form-label color-primary">AVATAR</label>
        <div id="avatar-item" className="uk-form-controls">
          <div>
            <a className="uk-icon-button uk-margin-small-right color-primary" uk-icon="user" />
          </div>
        </div>
      </div>
      <div className="uk-margin">
        <label className="uk-form-label color-primary">COUNTRY</label>
        <div id="form-select" className="uk-form-controls">
          <select className="uk-select">
            <FormSelector options={props.availableCountries} />
          </select>
        </div>
      </div>
      <div className="uk-margin">
        <label className="uk-form-label color-primary">CURRENCY</label>
        <div id="form-select" className="uk-form-controls">
          <select className="uk-select">
            <FormSelector options={props.availableCurrencies} />
          </select>
        </div>
      </div>
    </fieldset>
  </form>
)

export default RegistrationForm
