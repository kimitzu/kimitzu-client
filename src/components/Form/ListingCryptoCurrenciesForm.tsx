import React from 'react'

import { Button } from '../Button'

import CryptoCurrencies from '../../constants/CryptoCurrencies'

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
}: Props) => (
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
        <label className="form-label-desciptor">
          Accepting all coins will attract the largest audience
        </label>
      </div>
    </fieldset>
    <div className="submit-btn-div">
      <Button
        className="uk-button uk-button-primary"
        showSpinner={isLoading}
        disabled={isLoading}
        onClick={handleContinue}
      >
        {isNew ? 'ADD LISTING' : 'UPDATE LISTING'}
      </Button>
    </div>
  </form>
)

export default ListingCryptoCurrenciesForm
