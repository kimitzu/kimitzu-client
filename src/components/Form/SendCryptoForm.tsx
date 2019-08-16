import React, { useState } from 'react'

import { Button } from '../Button'
import { InputSelector } from '../Input'
import { FormLabel } from '../Label'

import CryptoCurrencies from '../../constants/CryptoCurrencies'

interface SendCryptoFormProps {
  onSend: (
    cryptoCurrency: string,
    recipient: string,
    amount: number,
    feeLevel: string,
    memo: string
  ) => void
  selectedCryptoCurrency: string
}

const SendCryptoForm = ({ onSend, selectedCryptoCurrency }: SendCryptoFormProps) => {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState(0)
  const [cryptoCurrency] = useState(selectedCryptoCurrency)
  const [memo, setMemo] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    setIsSending(true)
    await onSend(cryptoCurrency, recipient, amount, 'NORMAL', memo)
    setIsSending(false)
  }

  return (
    <div className="uk-width-1-1 uk-flex uk-flex-column">
      <form
        className="uk-form-stacked uk-flex uk-flex-column uk-width-1-1"
        onSubmit={evt => {
          evt.preventDefault()
          handleSend()
        }}
      >
        <fieldset className="uk-fieldset">
          <div className="uk-margin">
            <FormLabel label="Address" required />
            <input
              required
              className="uk-input"
              type="text"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
            />
          </div>
          <div className="uk-margin">
            <FormLabel label="Amount" required />
            <InputSelector
              options={CryptoCurrencies()}
              defaultSelectorVal={cryptoCurrency}
              inputProps={{
                type: 'number',
                value: amount,
                onChange: e => setAmount(e.target.value),
                required: true,
              }}
              selectProps={{ disabled: true }}
            />
          </div>
          <div className="uk-margin">
            <FormLabel label="Note" />
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
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SendCryptoForm
