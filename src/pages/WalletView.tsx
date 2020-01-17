import { IonContent, IonPage } from '@ionic/react'
import React from 'react'

import { CryptoSelector, TransactionsHistoryCard, WalletBalanceCard } from '../components/Card'
import { MobileHeader } from '../components/Header'
import { SendReceiveTransactionSegment } from '../components/Segment'
import CryptoCurrencies from '../constants/CryptoCurrencies'

import { localeInstance } from '../i18n'
import { Transactions } from '../interfaces/Wallet'
import currency from '../models/Currency'
import Wallet from '../models/Wallet'
import './WalletView.css'

const cryptoCurrencies = [...CryptoCurrencies()]
cryptoCurrencies.splice(0, 1)

interface WalletProps {
  view: string
}

interface State {
  selectedIndex: number
  balances: any
  addresses: any
  transactions: Transactions
  isLoading: boolean
}

class WalletView extends React.Component<WalletProps, State> {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0,
      balances: [],
      addresses: [],
      transactions: {
        count: 0,
        transactions: [],
      },
      isLoading: true,
    }
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleSend = this.handleSend.bind(this)
    this.renderPage = this.renderPage.bind(this)
  }

  public async handleSelectChange(index) {
    this.setState({ selectedIndex: index })
    const transactions = await Wallet.getTransactions(cryptoCurrencies[index].value)
    this.setState({
      transactions,
    })
  }

  public async componentDidMount() {
    const balances = await Wallet.getBalances()
    const addresses = await Wallet.getAddresses()
    const transactions = await Wallet.getTransactions(
      cryptoCurrencies[this.state.selectedIndex].value
    )
    this.setState({
      balances,
      addresses,
      transactions,
      isLoading: false,
    })
  }

  public render() {
    return (
      <IonPage>
        <MobileHeader
          title={localeInstance.get.localizations.navigationBar.walletLabel.toUpperCase()}
        />
        <IonContent>{this.renderPage()}</IonContent>
      </IonPage>
    )
  }

  private renderPage() {
    const { selectedIndex } = this.state
    const selectedCryptoCurrency = cryptoCurrencies[selectedIndex].value
    const linkTemplate = cryptoCurrencies[selectedIndex].explorer

    const balance = this.state.balances[selectedCryptoCurrency] || {
      confirmed: 0,
      height: 0,
      unconfirmed: 0,
    }

    return this.state.isLoading ? (
      <div />
    ) : (
      <div id="wallet-cont">
        <div id="left-side-wallet" className="crypto-selector-desktop">
          <CryptoSelector
            id="desktop"
            cryptos={cryptoCurrencies}
            handleSelectChange={this.handleSelectChange}
            selected={selectedIndex}
            balances={this.state.balances}
          />
        </div>
        <div id="right-side-wallet" key={selectedCryptoCurrency}>
          <div className="uk-margin-small-bottom uk-margin-small-top crypto-selector-mobile">
            <CryptoSelector
              id="mobile"
              cryptos={cryptoCurrencies}
              handleSelectChange={this.handleSelectChange}
              selected={selectedIndex}
              balances={this.state.balances}
            />
          </div>
          <WalletBalanceCard
            selectedCryptoCurrency={selectedCryptoCurrency}
            balance={balance}
            transactionCount={this.state.transactions.count}
          />
          <SendReceiveTransactionSegment
            onSend={this.handleSend}
            address={this.state.addresses[selectedCryptoCurrency]}
            selectedCryptoCurrency={selectedCryptoCurrency}
          />
          {this.state.transactions.transactions ? (
            <TransactionsHistoryCard
              transactions={this.state.transactions.transactions}
              selectedCryptoCurrency={selectedCryptoCurrency}
              linkTemplate={linkTemplate}
            />
          ) : null}
        </div>
      </div>
    )
  }

  private async handleSend(
    cryptoCurrency: string,
    recipient: string,
    amount: number,
    feeLevel: string,
    memo: string,
    spendAll?: boolean
  ) {
    const parsedAmount = currency.dehumanizeCrypto(amount)
    try {
      await Wallet.send(cryptoCurrency, recipient, parsedAmount, feeLevel, memo, spendAll)
      window.UIkit.notification({
        message: 'Transaction Sent!',
        status: 'success',
        pos: 'top-right',
        timeout: 5000,
      })
    } catch (e) {
      window.UIkit.notification({
        message: localeInstance.get.localizations.errors[e.response.data.reason],
        status: 'danger',
        pos: 'top-right',
        timeout: 5000,
      })
    }
  }
}

export default WalletView
