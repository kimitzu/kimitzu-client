import React, { useState } from 'react'

import { SendCryptoForm } from '../Form'
import ReceiveTransactionSegment from './ReceiveTransactionSegment'

interface SendReceiveTransactionSegmentProps {
  address: string
  selectedCryptoCurrency: string
  onSend: (
    cryptoCurrency: string,
    recipient: string,
    amount: number,
    feeLevel: string,
    memo: string
  ) => void
}

const actions = {
  SEND: 0,
  RECEIVE: 1,
}

const renderContent = (action: number, address, onSend, selectedCryptoCurrency) => {
  switch (action) {
    case actions.SEND:
      return <SendCryptoForm onSend={onSend} selectedCryptoCurrency={selectedCryptoCurrency} />
    case actions.RECEIVE:
      return <ReceiveTransactionSegment address={address} />
    default:
      return <div />
  }
}

const SendReceiveTransactionSegment = ({
  address,
  onSend,
  selectedCryptoCurrency,
}: SendReceiveTransactionSegmentProps) => {
  const [currentAction, setCurrentAction] = useState(actions.SEND)
  return (
    <div className="uk-margin-small-top uk-padding-small uk-card uk-card-default">
      <div>
        <ul className="uk-flex-center" data-uk-tab>
          <li
            className={currentAction === actions.SEND ? 'uk-active' : ''}
            onClick={() => setCurrentAction(actions.SEND)}
          >
            <a>Send</a>
          </li>
          <li
            className={currentAction === actions.RECEIVE ? 'uk-active' : ''}
            onClick={() => setCurrentAction(actions.RECEIVE)}
          >
            <a>Receive</a>
          </li>
        </ul>
      </div>
      <div className="uk-width-1-1 uk-padding-small uk-padding-remove-horizontal">
        {renderContent(currentAction, address, onSend, selectedCryptoCurrency)}
      </div>
    </div>
  )
}

export default SendReceiveTransactionSegment
