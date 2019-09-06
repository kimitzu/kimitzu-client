import React, { useEffect, useState } from 'react'

import { WalletBalance } from '../../interfaces/Wallet'
import currency from '../../models/Currency'
import './WalletBalanceCard.css'

interface WalletBalanceCardProps {
  balance: WalletBalance
  selectedCryptoCurrency: string
  transactionCount: number
}

const WalletBalanceCard = ({
  balance,
  selectedCryptoCurrency,
  transactionCount,
}: WalletBalanceCardProps) => {
  const [fiatConversion, setFiatConversion] = useState(0)

  useEffect(() => {
    ;(async () => {
      const conversion = await currency.convert(
        selectedCryptoCurrency,
        'usd',
        balance.confirmed / 100000000
      )
      setFiatConversion(conversion)
    })()
  }, [])

  return (
    <div id="crypto-balance-main" className="uk-card uk-card-default uk-card-body">
      <div id="left-cont-bal">
        <p className="bal-bold-text">Balance</p>
        <p className="value-bal">
          {balance.confirmed / 100000000} {selectedCryptoCurrency.toUpperCase()}
        </p>
        <p className="stat-bal">
          ({balance.unconfirmed / 100000000} {selectedCryptoCurrency.toUpperCase()} Unconfirmed)
        </p>
      </div>
      <div id="middle-cont-bal">
        <p className="bal-bold-text">Value in USD</p>
        <p className="value-bal">${fiatConversion}</p>
      </div>
      <div id="right-cont-bal">
        <p className="bal-bold-text">Transactions</p>
        <p className="value-bal">{transactionCount}</p>
      </div>
    </div>
  )
}

export default WalletBalanceCard
