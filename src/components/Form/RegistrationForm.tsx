import React from 'react'

import { FormLabel } from '../Label'
import { FormSelector } from '../Selector'

import ProfileInterface from '../../models/Profile'

import './RegistrationForm.css'

interface Props {
  data: ProfileInterface
  availableCountries: Array<{ label: string; value: string }>
  currencyTypes: Array<{ label: string; value: string }>
  fiatCurrencies: Array<{ label: string; value: string }>
  cryptoCurrencies: Array<{ label: string; value: string }>
  languages: Array<{ label: string; value: string }>
  unitOfMeasurements: Array<{ label: string; value: string }>
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onChange: (field: string, value: any) => void
}

const RegistrationForm = (props: Props) => (
  <form className="uk-form-stacked" onSubmit={props.onSubmit}>
    <fieldset className="uk-fieldset">
      <div className="uk-margin">
        <FormLabel label="USERNAME" required />
        <div className="uk-form-controls">
          <input
            className="uk-input"
            type="text"
            placeholder="John Doe"
            value={props.data.handle || ''}
            onChange={event => props.onChange('handle', event.target.value)}
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="FULL NAME" required />
        <div className="uk-form-controls">
          <input
            className="uk-input"
            type="text"
            placeholder="John Doe"
            value={props.data.name || ''}
            onChange={event => props.onChange('name', event.target.value)}
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="DESCRIPTION" />
        <div className="uk-form-controls">
          <textarea
            id="description"
            className="uk-textarea"
            rows={3}
            placeholder="In 500 words or less tell us something about yourself and the services you offer..."
            value={props.data.about || ''}
            onChange={event => props.onChange('about', event.target.value)}
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="AVATAR" />
        <div id="avatar-item" className="uk-form-controls">
          <div id="child-icon">
            <a className="uk-icon-button color-primary" uk-icon="user" />
          </div>
          <div id="child-slider">
            <input className="uk-range" type="range" value="2" min="0" max="10" step="0.1" />
          </div>
          <div id="child-btn">
            <button className="uk-button uk-button-primary">CHANGE</button>
          </div>
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="COUNTRY" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={props.availableCountries}
            defaultVal={
              props.data.extLocation
                ? props.data.extLocation.addresses[props.data.extLocation.primary].country
                : ''
            }
            onChange={event =>
              props.onChange('extLocation.addresses', [{ country: event.target.value }])
            }
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="WHAT CURRENCY SHOULD WE DISPLAY THE PRICES" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={props.currencyTypes}
            defaultVal={props.data.preferences ? props.data.preferences.currencyDisplay : ''}
            onChange={event => props.onChange('preferences.currencyDisplay', event.target.value)}
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="PREFERRED FIAT CURRENCY" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={props.fiatCurrencies}
            defaultVal={props.data.preferences ? props.data.preferences.fiat : ''}
            onChange={event => props.onChange('preferences.fiat', event.target.value)}
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="PREFERRED CRYPTO CURRENCY" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={props.cryptoCurrencies}
            defaultVal={props.data.preferences ? props.data.preferences.cryptocurrency : ''}
            onChange={event => props.onChange('preferences.cryptocurrency', event.target.value)}
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="PREFERRED LANGUAGE" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={props.languages}
            defaultVal={props.data.preferences ? props.data.preferences.language : ''}
            onChange={event => props.onChange('preferences.language', event.target.value)}
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="PREFERRED UNITS" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={props.unitOfMeasurements}
            defaultVal={props.data.preferences ? props.data.preferences.measurementUnit : ''}
            onChange={event => props.onChange('preferences.measurementUnit', event.target.value)}
            required
          />
        </div>
      </div>
    </fieldset>
    <button className="uk-button uk-button-primary uk-align-center" type="submit">
      Submit
    </button>
  </form>
)

export default RegistrationForm
