import React from 'react'

import { FormLabel } from '../Label'
import { FormSelector } from '../Selector'

import { Profile } from '../../models/Profile'

import config from '../../config'
import './RegistrationForm.css'

interface Props {
  avatar: string
  data: Profile
  isSubmitting: boolean
  availableCountries: Array<{ label: string; value: string }>
  cryptoCurrencies: Array<{ label: string; value: string }>
  currencyTypes: Array<{ label: string; value: string }>
  fiatCurrencies: Array<{ label: string; value: string }>
  languages: Array<{ label: string; value: string }>
  unitOfMeasurements: Array<{ label: string; value: string }>
  onChange: (field: string, value: any, parentField?: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
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
            onChange={event => props.onChange('handle', event.target.value, 'registrationForm')}
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="NAME" />
        <div className="uk-form-controls">
          <input
            className="uk-input"
            type="text"
            placeholder="John Doe"
            value={props.data.name || ''}
            onChange={event => props.onChange('name', event.target.value, 'registrationForm')}
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="DESCRIPTION" />
        <div className="uk-form-controls">
          <textarea
            className="uk-textarea"
            rows={3}
            placeholder="In 500 words or less tell us something about yourself and the services you offer..."
            value={props.data.about || ''}
            onChange={event => props.onChange('about', event.target.value, 'registrationForm')}
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="AVATAR" />
        <div id="avatar-item" className="uk-form-controls">
          <div id="child-icon">
            {props.data.avatarHashes.tiny && !props.avatar ? (
              <img src={`${config.openBazaarHost}/ob/images/${props.data.avatarHashes.tiny}`} />
            ) : null}
            {props.avatar ? <img src={props.avatar} /> : null}
            {!props.avatar && !props.data.avatarHashes.tiny ? (
              <a className="uk-icon-button color-primary" uk-icon="user" />
            ) : null}
          </div>
          <div id="child-slider">
            <input className="uk-range" type="range" value="2" min="0" max="10" step="0.1" />
          </div>
          <div id="btn-wrapper" className="upload-btn-wrapper">
            <button id="btn-upload" className="btn">
              CHANGE
            </button>
            <input
              type="file"
              accept="image/*"
              className="uk-button uk-button-primary"
              onChange={event => props.onChange('avatar', event.target.files)}
            />
          </div>
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="COUNTRY" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={props.availableCountries}
            defaultVal={
              props.data.extLocation.addresses[props.data.extLocation.primary].country || 'US'
            }
            onChange={event =>
              props.onChange(
                'extLocation.addresses',
                [{ country: event.target.value }],
                'registrationForm'
              )
            }
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="PREFERRED FIAT CURRENCY" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={props.fiatCurrencies}
            defaultVal={props.data.preferences.fiat || 'USD'}
            onChange={event =>
              props.onChange('preferences.fiat', event.target.value, 'registrationForm')
            }
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="PREFERRED CRYPTOCURRENCY" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={props.cryptoCurrencies}
            defaultVal={props.data.preferences.cryptocurrency || 'BTC'}
            onChange={event =>
              props.onChange('preferences.cryptocurrency', event.target.value, 'registrationForm')
            }
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="DISPLAY CURRENCY" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={props.currencyTypes}
            defaultVal={props.data.preferences.currencyDisplay || 'FIAT'}
            onChange={event =>
              props.onChange('preferences.currencyDisplay', event.target.value, 'registrationForm')
            }
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="PREFERRED LANGUAGE" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={props.languages}
            defaultVal={props.data.preferences.language || 'EN'}
            onChange={event =>
              props.onChange('preferences.language', event.target.value, 'registrationForm')
            }
            required
          />
        </div>
      </div>
      <div className="uk-margin">
        <FormLabel label="PREFERRED UNITS" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={props.unitOfMeasurements}
            defaultVal={props.data.preferences.measurementUnit || 'ENGLISH'}
            onChange={event =>
              props.onChange('preferences.measurementUnit', event.target.value, 'registrationForm')
            }
            required
          />
        </div>
      </div>
    </fieldset>
    <div className="uk-position-relative uk-position-center uk-margin-top">
      {props.isSubmitting ? (
        <div uk-spinner="ratio: 1" />
      ) : (
        <button className="uk-button uk-button-primary" type="submit">
          Submit
        </button>
      )}
    </div>
  </form>
)

export default RegistrationForm
