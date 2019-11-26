import React from 'react'
import ReactMarkdown from 'react-markdown'
import ReactMde from 'react-mde'

import { Button } from '../Button'
import { FormLabel } from '../Label'
import { FormSelector } from '../Selector'

import config from '../../config'
import Countries from '../../constants/Countries.json'
import { TabSelection } from '../../interfaces/Misc'
import { Profile } from '../../interfaces/Profile'
import decodeHtml from '../../utils/Unescape'

import { localeInstance } from '../../i18n'

import 'react-mde/lib/styles/css/react-mde-all.css'
import './RegistrationForm.css'

interface Props {
  avatar: string
  data: Profile
  isSubmitting: boolean
  cryptoCurrencies: Array<{ label: string; value: string }>
  currencyTypes: Array<{ label: string; value: string }>
  fiatCurrencies: Array<{ label: string; value: string }>
  languages: Array<{ label: string; value: string }>
  unitOfMeasurements: Array<{ label: string; value: string }>
  onChange: (field: string, value: any, parentField?: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  submitButtonLabel?: string
}

const RegistrationForm = (props: Props) => {
  const {
    localizations,
    localizations: { userForm, addressForm },
  } = localeInstance.get
  const [st, setSelectedTab] = React.useState('write')
  const selectedTab: TabSelection = st as TabSelection

  return (
    <form className="uk-form-stacked uk-width-1-1" onSubmit={props.onSubmit}>
      <fieldset className="uk-fieldset">
        <div className="uk-flex uk-flex-1 uk-flex-middle uk-flex-center uk-flex-column">
          <img
            className="uk-border-circle"
            id="reg-avatar"
            src={
              props.data.avatarHashes.original || props.avatar
                ? props.avatar ||
                  `${config.openBazaarHost}/ob/images/${props.data.avatarHashes.original}`
                : '/images/user.svg'
            }
          />
          <div id="btn-wrapper" className="upload-btn-wrapper">
            <Button id="reg-avatar-btn" className="uk-button uk-button-primary">
              {localizations.changePhotoBtnText}
            </Button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="uk-button uk-button-primary"
              name="avatar"
              onChange={event => props.onChange(event.target.name, event.target.files)}
            />
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label={userForm.handleLabel.toUpperCase()} required />
          <div className="uk-form-controls">
            <input
              id="username"
              className="uk-input"
              type="text"
              placeholder={userForm.handlePlaceholder}
              value={props.data.handle || ''}
              onChange={event => props.onChange('handle', event.target.value, 'profile')}
              required
            />
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label={userForm.nameLabel.toUpperCase()} />
          <div className="uk-form-controls">
            <input
              id="fullname"
              className="uk-input"
              type="text"
              placeholder={userForm.namePlaceholder}
              value={decodeHtml(props.data.name) || ''}
              onChange={event => props.onChange('name', event.target.value, 'profile')}
            />
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label={localizations.descriptionLabel.toUpperCase()} />
          <div className="uk-form-controls">
            <ReactMde
              value={decodeHtml(props.data.about) || ''}
              onChange={value => props.onChange('about', value, 'profile')}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={markdown => {
                return new Promise(resolve => {
                  resolve(<ReactMarkdown source={markdown} />)
                })
              }}
            />
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label={localizations.emailLabel.toUpperCase()} />
          <div className="uk-form-controls">
            <input
              id="email"
              className="uk-input"
              type="text"
              placeholder={localizations.emailPlaceholder}
              value={props.data.contactInfo.email || ''}
              onChange={event => props.onChange('contactInfo.email', event.target.value, 'profile')}
            />
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label={addressForm.countryLabel.toUpperCase()} required />
          <div id="form-select" className="uk-form-controls">
            <FormSelector
              id="countries"
              options={Countries}
              defaultVal={
                props.data.extLocation.primary > -1
                  ? props.data.extLocation.addresses[props.data.extLocation.primary].country || ''
                  : ''
              }
              onChange={event =>
                props.onChange(
                  'extLocation.addresses',
                  [{ country: event.target.value }],
                  'profile'
                )
              }
              required
            />
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label={userForm.fiatCurrencyLabel.toUpperCase()} required />
          <div id="form-select" className="uk-form-controls">
            <FormSelector
              options={props.fiatCurrencies}
              defaultVal={props.data.preferences.fiat || 'USD'}
              onChange={event => props.onChange('preferences.fiat', event.target.value, 'profile')}
              required
            />
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label={userForm.cryptoCurrencyLabel.toUpperCase()} required />
          <div id="form-select" className="uk-form-controls">
            <FormSelector
              options={props.cryptoCurrencies}
              defaultVal={props.data.preferences.cryptocurrency || 'BTC'}
              onChange={event =>
                props.onChange('preferences.cryptocurrency', event.target.value, 'profile')
              }
              required
            />
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label={userForm.displayCurrencyLabel.toUpperCase()} required />
          <div id="form-select" className="uk-form-controls">
            <FormSelector
              options={props.currencyTypes}
              defaultVal={props.data.preferences.currencyDisplay || 'FIAT'}
              onChange={event =>
                props.onChange('preferences.currencyDisplay', event.target.value, 'profile')
              }
              required
            />
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label={userForm.languageLabel.toUpperCase()} required />
          <div id="form-select" className="uk-form-controls">
            <FormSelector
              options={props.languages}
              defaultVal={props.data.preferences.language || 'EN'}
              onChange={event =>
                props.onChange('preferences.language', event.target.value, 'profile')
              }
              required
            />
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label={userForm.unitsLabel.toUpperCase()} required />
          <div id="form-select" className="uk-form-controls">
            <FormSelector
              id="preferred-units"
              options={props.unitOfMeasurements}
              defaultVal={props.data.preferences.measurementUnit || 'ENGLISH'}
              onChange={event =>
                props.onChange('preferences.measurementUnit', event.target.value, 'profile')
              }
              required
            />
          </div>
        </div>
      </fieldset>
      <Button
        type="submit"
        className="uk-button uk-button-primary uk-align-center"
        showSpinner={props.isSubmitting}
      >
        {props.submitButtonLabel || localizations.nextBtnText.toUpperCase()}
      </Button>
    </form>
  )
}

export default RegistrationForm
