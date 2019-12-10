import isElectron from 'is-electron'
import React from 'react'

import { Transaction } from '../../interfaces/Wallet'
import currency from '../../models/Currency'

import { localeInstance } from '../../i18n'

import './TransactionsHistoryCard.css'

interface TransactionsHistoryCardProps {
  transactions: Transaction[]
  selectedCryptoCurrency: string
  linkTemplate: string
}

const TransactionsHistoryCard = ({
  transactions,
  selectedCryptoCurrency,
  linkTemplate,
}: TransactionsHistoryCardProps) => {
  const { walletView } = localeInstance.get.localizations

  return (
    <div
      id="wallet-tx-history"
      className="uk-margin-small-top uk-card uk-card-default uk-card-body"
    >
      <h5 className="color-primary uk-text-bold">{walletView.transactionsText}</h5>
      <ul id="tx-list-cont">
        {transactions.map(transaction => (
          <li key={transaction.txid}>
            <div className="tx-list">
              <div className="tx-list-header">
                <span className="check-icon" data-uk-icon="icon: check; ratio: 1" />
                <p className="tx-value">
                  {currency.humanizeCrypto(transaction.value)}{' '}
                  {selectedCryptoCurrency.toUpperCase()}
                </p>
                <p className="tx-status">
                  {transaction.address
                    ? walletView.sentText.toUpperCase()
                    : walletView.receivedText.toUpperCase()}
                </p>
              </div>
              <div className="tx-list-sub">
                <p className="tx-stat-sub">
                  {new Date(transaction.timestamp).toLocaleDateString('default', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                  })}{' '}
                  ({transaction.confirmations} {walletView.confirmationsText})
                </p>
                {isElectron() ? (
                  <a
                    href="/#"
                    className="tx-adrs"
                    onClick={evt => {
                      evt.preventDefault()
                      window.openExternal(linkTemplate.replace('%tx%', transaction.txid))
                    }}
                  >
                    {transaction.txid}
                  </a>
                ) : (
                  <a
                    href={linkTemplate.replace('%tx%', transaction.txid)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-adrs"
                  >
                    {transaction.txid}
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TransactionsHistoryCard
