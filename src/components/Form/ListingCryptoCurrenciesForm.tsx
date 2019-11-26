import React from 'react'

import { Button } from '../Button'

import CryptoCurrencies from '../../constants/CryptoCurrencies'

import { localeInstance } from '../../i18n'

import './ListingCryptoCurrenciesForm.css'

const cryptoCurrencies = [...CryptoCurrencies()]
cryptoCurrencies.splice(0, 1)

interface Options {
  value: string
  label: string
}

interface Props {
  handleContinue: (event: React.FormEvent) => void
  handleInputChange: (field: string, value: any, parentField?: string) => void
  acceptedCurrencies: string[]
  isLoading: boolean
  isNew: boolean
}

const ListingCryptoCurrenciesForm = ({
  handleContinue,
  handleInputChange,
  acceptedCurrencies,
  isLoading,
  isNew,
}: Props) => {
  const { listingForm } = localeInstance.get.localizations

  return (
    <form className="uk-form-stacked uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        <div id="crypto-checkers" className="uk-margin uk-flex">
          {cryptoCurrencies.map((crypto: Options, index: number) => (
            <label id="checker" className="color-primary" key={crypto.value}>
              <input
                id={`crypto-${index}`}
                className="uk-checkbox input-checker"
                type="checkbox"
                checked={acceptedCurrencies.includes(crypto.value)}
                onChange={event => {
                  if (event.target.checked) {
                    acceptedCurrencies.push(crypto.value)
                    handleInputChange('metadata.acceptedCurrencies', acceptedCurrencies, 'listing')
                  } else {
                    const filteredEntries = acceptedCurrencies.filter(x => x !== crypto.value)
                    handleInputChange('metadata.acceptedCurrencies', filteredEntries, 'listing')
                  }
                }}
              />
              {crypto.label}
            </label>
          ))}
          <label className="form-label-desciptor">{listingForm.currenciesDescriptor}</label>
        </div>
      </fieldset>
      <div className="submit-btn-div">
        <Button
          className="uk-button uk-button-primary"
          id="listing-full-submit"
          showSpinner={isLoading}
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isNew ? listingForm.addBtnText.toUpperCase() : listingForm.updateBtnText.toUpperCase()}
        </Button>
      </div>
    </form>
  )
}

export default ListingCryptoCurrenciesForm
