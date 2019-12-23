import React, { useState } from 'react'

import { Button } from '../Button'
import { InputSelector } from '../Input'
import { FormLabel } from '../Label'

import CryptoCurrencies from '../../constants/CryptoCurrencies'

import { localeInstance } from '../../i18n'
import currency from '../../models/Currency'
import Wallet from '../../models/Wallet'

interface SendCryptoFormProps {
  onSend: (
    cryptoCurrency: string,
    recipient: string,
    amount: number,
    feeLevel: string,
    memo: string,
    spendAll: boolean
  ) => void
  selectedCryptoCurrency: string
}

const SendCryptoForm = ({ onSend, selectedCryptoCurrency }: SendCryptoFormProps) => {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState(0)
  const [cryptoCurrency] = useState(selectedCryptoCurrency)
  const [memo, setMemo] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [spendAll, setSpendAll] = useState(false)

  const { transactionForm } = localeInstance.get.localizations.walletView

  const handleSend = async () => {
    setIsSending(true)
    await onSend(cryptoCurrency, recipient, amount, 'NORMAL', memo, spendAll)
    setIsSending(false)
  }

  return (
    <div className="uk-width-1-1 uk-flex uk-flex-column">
      <form
        className="uk-form-stacked uk-flex uk-flex-column uk-width-1-1"
        onSubmit={async evt => {
          evt.preventDefault()
          try {
            await handleSend()
            setAmount(0)
            setRecipient('')
          } catch (e) {
            // Do nothing, errors are handled by parent component
          }
        }}
      >
        <fieldset className="uk-fieldset">
          <div className="uk-margin">
            <FormLabel label={transactionForm.addressLabel} required />
            <input
              required
              className="uk-input"
              type="text"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
            />
          </div>
          <div className="uk-margin">
            <label>
              <input
                className="uk-checkbox"
                type="checkbox"
                onChange={async evt => {
                  setSpendAll(evt.target.checked)
                  if (evt.target.checked) {
                    const balances = await Wallet.getBalances()
                    setAmount(currency.humanizeCrypto(balances[cryptoCurrency].confirmed))
                  } else {
                    setAmount(0)
                  }
                }}
              />{' '}
              Spend All
            </label>
          </div>
          <div className="uk-margin">
            <FormLabel label={transactionForm.amountLabel} required />
            <InputSelector
              options={CryptoCurrencies()}
              defaultSelectorVal={cryptoCurrency}
              inputProps={{
                disabled: spendAll,
                type: 'number',
                value: amount,
                onChange: e => {
                  if (Number(e.target.value) >= 0) {
                    setAmount(e.target.value)
                  }
                },
                required: true,
              }}
              selectProps={{ disabled: true }}
            />
          </div>
          <div className="uk-margin">
            <FormLabel label={transactionForm.noteLabel} />
            <input
              className="uk-input"
              type="text"
              value={memo}
              onChange={e => setMemo(e.target.value)}
            />
          </div>
        </fieldset>
        <div className="uk-flex uk-flex-center">
          <Button showSpinner={isSending} className="uk-button uk-button-primary" type="submit">
            {transactionForm.submitBtnText.toUpperCase()}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SendCryptoForm
