import React from 'react'

import isElectron from 'is-electron'
import { Transaction } from '../../interfaces/Wallet'
import currency from '../../models/Currency'
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
}: TransactionsHistoryCardProps) => (
  <div id="wallet-tx-history" className="uk-margin-small-top uk-card uk-card-default uk-card-body">
    <p id="title-tx">Transactions</p>
    <ul id="tx-list-cont">
      {transactions.map(transaction => (
        <li key={transaction.txid}>
          <div className="tx-list">
            <div className="tx-list-header">
              <span className="check-icon" data-uk-icon="icon: check; ratio: 1" />
              <p className="tx-value">
                {currency.humanizeCrypto(transaction.value)} {selectedCryptoCurrency.toUpperCase()}
              </p>
              <p className="tx-status">{transaction.address ? 'SENT' : 'RECEIVED'}</p>
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
                ({transaction.confirmations} confirmations)
              </p>
              {isElectron() ? (
                <a
                  href="#"
                  className="tx-adrs"
                  onClick={() =>
                    window.openExternal(linkTemplate.replace('${tx}', transaction.txid))
                  }
                >
                  {transaction.txid}
                </a>
              ) : (
                <a
                  href={linkTemplate.replace('${tx}', transaction.txid)}
                  target="_blank"
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

export default TransactionsHistoryCard
