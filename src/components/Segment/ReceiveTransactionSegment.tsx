import QRCode from 'qrcode.react'
import React from 'react'

import { localeInstance } from '../../i18n'

interface ReceiveTransactionSegmentProps {
  address: string
}

const ReceiveTransactionSegment = ({ address }: ReceiveTransactionSegmentProps) => {
  const { walletView } = localeInstance.get.localizations

  return (
    <div className="uk-flex uk-flex-column uk-width-1-1">
      <div className="uk-flex uk-flex-middle uk-flex-center">
        <h4 className="uk-text-center">{walletView.receiveTransactionHeader}</h4>
      </div>
      <div className="uk-flex uk-flex-center uk-flex-middle uk-padding-small uk-flex-column">
        <QRCode value={address} size={180} />
        <p className="uk-text-bold uk-margin-top">{address}</p>
      </div>
    </div>
  )
}

export default ReceiveTransactionSegment
