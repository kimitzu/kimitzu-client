import React from 'react'

import CryptoCurrencies from '../../constants/CryptoCurrencies.json'

import './ListingCryptoCurrenciesForm.css'

CryptoCurrencies.splice(0, 1)

interface Options {
  value: string
  label: string
}

interface Props {
  handleContinue: (event: React.FormEvent) => void
  handleInputChange: (field: string, value: any, parentField?: string) => void
  acceptedCurrencies: string[]
  isLoading: boolean
}

const ListingCryptoCurrenciesForm = ({
  handleContinue,
  handleInputChange,
  acceptedCurrencies,
  isLoading,
}: Props) => (
  <form className="uk-form-stacked uk-flex uk-flex-column full-width">
    <fieldset className="uk-fieldset">
      <div id="crypto-checkers" className="uk-margin uk-flex">
        {CryptoCurrencies.map((crypto: Options) => (
          <label id="checker" className="color-primary" key={crypto.value}>
            <input
              id="input-checker"
              className="uk-checkbox"
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
      {isLoading ? (
        <div uk-spinner="ratio: 2">Creating Listing... </div>
      ) : (
        <button className="uk-button uk-button-primary" onClick={handleContinue}>
          ADD LISTING
        </button>
      )}
    </div>
  </form>
)

export default ListingCryptoCurrenciesForm
