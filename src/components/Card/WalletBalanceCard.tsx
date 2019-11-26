import React, { useEffect, useState } from 'react'

import { WalletBalance } from '../../interfaces/Wallet'
import currency from '../../models/Currency'
import Profile from '../../models/Profile'

import { localeInstance } from '../../i18n'

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
  const [currentUser, setCurrentUser] = useState(new Profile())

  const { walletView } = localeInstance.get.localizations

  useEffect(() => {
    ;(async () => {
      const currentUserReq = await Profile.retrieve()

      const conversion = await currency.convertCrypto(
        selectedCryptoCurrency,
        currentUserReq.preferences.fiat,
        currency.humanizeCrypto(balance.confirmed)
      )

      setFiatConversion(conversion)
      setCurrentUser(currentUserReq)
    })()
  }, [])

  return (
    <div id="crypto-balance-main" className="uk-card uk-card-default uk-card-body">
      <div id="left-cont-bal">
        <p className="bal-bold-text">{walletView.balanceText}</p>
        <p className="value-bal">
          {currency.humanizeCrypto(balance.confirmed)} {selectedCryptoCurrency.toUpperCase()}
        </p>
        <p className="stat-bal">
          ({currency.humanizeCrypto(balance.unconfirmed)} {selectedCryptoCurrency.toUpperCase()}{' '}
          {walletView.unconfirmedText})
        </p>
      </div>
      <div id="middle-cont-bal">
        <p className="bal-bold-text">{walletView.fiatValText}</p>
        <p className="value-bal">
          {fiatConversion} {currentUser.preferences.fiat}
        </p>
      </div>
      <div id="right-cont-bal">
        <p className="bal-bold-text">{walletView.transactionsText}</p>
        <p className="value-bal">{transactionCount}</p>
      </div>
    </div>
  )
}

export default WalletBalanceCard
