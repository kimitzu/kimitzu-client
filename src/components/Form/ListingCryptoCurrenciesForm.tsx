import React from 'react'

import CryptoCurrencies from '../../constants/CryptoCurrencies.json'

import './ListingCryptoCurrenciesForm.css'

CryptoCurrencies.splice(0, 1)

interface Options {
  value: string
  label: string
}

interface Props {
  handleSubmit: () => void
  // TODO: Add list of selected cryptos
}

const ListingCryptoCurrenciesForm = ({ handleSubmit }: Props) => (
  <form className="uk-form-stacked uk-flex uk-flex-column full-width">
    <fieldset className="uk-fieldset">
      <div id="crypto-checkers" className="uk-margin uk-flex">
        {CryptoCurrencies.map((crypto: Options) => (
          <label id="checker" className="color-primary" key={crypto.value}>
            {/* TODO: Add functionality to determine if the crypto is checked  */}
            <input id="input-checker" className="uk-checkbox" type="checkbox" checked />
            {crypto.label}
          </label>
        ))}
        <label className="form-label-desciptor">
          Accepting all coins will attract the largest audience
        </label>
      </div>
    </fieldset>
    <div className="submit-btn-div">
      <button className="uk-button uk-button-primary" onClick={handleSubmit}>
        ADD LISTING
      </button>
    </div>
  </form>
)

export default ListingCryptoCurrenciesForm
