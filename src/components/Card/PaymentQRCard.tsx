import QRCode from 'qrcode.react'
import React from 'react'

import Order from '../../models/Order'
import { Button } from '../Button'

interface Props {
  amount: string // amount + currency
  address: string
  cryptocurrency: string
  handlePay?: () => void
  handleCopyToClipboard: (field: string) => void
}

const PaymentQRCard = ({
  address,
  amount,
  handleCopyToClipboard,
  handlePay,
  cryptocurrency,
}: Props) => (
  <div className="uk-car  d uk-card-default uk-card-body uk-flex uk-flex-row">
    <QRCode value={Order.getQRCodeValue(cryptocurrency, address, amount)} size={180} />
    <div className="uk-padding uk-padding-remove-top uk-padding-remove-bottom">
      <div className="uk-flex uk-flex-middle">
        <h4 className="uk-text-bold">
          Pay: {amount} {cryptocurrency}
        </h4>
        {/* <a
          className="text-underline uk-text-small uk-margin-left"
          onClick={() => handleCopyToClipboard('amount')}
        >
          Copy
        </a> */}
      </div>
      <div className="uk-flex uk-flex-middle">
        <label>Address: {address}</label>
        {/* <a
          className="text-underline uk-text-small uk-margin-left"
          onClick={() => handleCopyToClipboard('address')}
        >
          Copy
        </a> */}
      </div>
      <div className="uk-margin uk-margin-remove-horizontal">
        <Button className="uk-button uk-button-primary" onClick={handlePay}>
          PAY FROM WALLET
        </Button>
      </div>
      <div>
        <p className="color-secondary">
          Once you have paid, it may take a bit for the interface to update.
        </p>
      </div>
    </div>
  </div>
)

export default PaymentQRCard
