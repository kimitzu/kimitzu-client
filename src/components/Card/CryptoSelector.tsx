import React from 'react'

import { CryptoCurrencyConstant } from '../../interfaces/Constants'
import { WalletBalances } from '../../interfaces/Wallet'
import currency from '../../models/Currency'
import './CryptoSelector.css'

interface Props {
  id: string
  cryptos: CryptoCurrencyConstant[]
  selected: number
  handleSelectChange: (cryptoIndex: number) => void
  balances: WalletBalances
}

const CryptoSelector = ({ cryptos, selected, handleSelectChange, balances, id }: Props) => (
  <div id="crypto-selector-main" className="uk-card uk-card-default uk-card-body">
    <ul id="crypto-select-ul">
      {cryptos.map((c, i) => (
        <li
          key={`${i}cryptos`}
          className={i === selected ? 'selected' : ''}
          onClick={async () => await handleSelectChange(i)}
        >
          <div className="crypto-content">
            <img src={c.icon} width="25" height="25" alt={c.label} />
            <p className="crypto-label" id={`${c.value}-${id}`}>
              {c.label}
            </p>
            <p className="crypto-balance">
              {currency.humanizeCrypto(balances[c.value].confirmed).toFixed(4)}{' '}
              {c.value.toLowerCase()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </div>
)

export default CryptoSelector
