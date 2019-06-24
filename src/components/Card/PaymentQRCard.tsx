import QRCode from 'qrcode.react'
import React from 'react'

interface Props {
  qrValue: string
  amount: string // amount + currency
  address: string
  handlePay?: () => void
  handleCopyToClipboard: (field: string) => void
}

const PaymentQRCard = ({ address, amount, handleCopyToClipboard, handlePay, qrValue }: Props) => (
  <div className="uk-car  d uk-card-default uk-card-body uk-flex uk-flex-row">
    <QRCode value="test121314asfa asfsfaswqwr faaweweewewfgweg wefwee14124" size={180} />
    <div className="uk-padding uk-padding-remove-top uk-padding-remove-bottom">
      <div className="uk-flex uk-flex-middle">
        <h4 className="uk-text-bold">Pay: {amount}</h4>
        <a
          className="text-underline uk-text-small uk-margin-left"
          onClick={() => handleCopyToClipboard('amount')}
        >
          Copy
        </a>
      </div>
      <div className="uk-flex uk-flex-middle">
        <label>Address: {address}</label>
        <a
          className="text-underline uk-text-small uk-margin-left"
          onClick={() => handleCopyToClipboard('address')}
        >
          Copy
        </a>
      </div>
      <div className="uk-margin uk-margin-remove-horizontal">
        <button className="uk-button uk-button-primary" onClick={handlePay}>
          PAY FROM WALLET
        </button>
      </div>
      <div>
        <p className="color-secondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      </div>
    </div>
  </div>
)

export default PaymentQRCard
