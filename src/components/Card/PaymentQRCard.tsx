import QRCode from 'qrcode.react'
import React, { useState } from 'react'
import { OrdersSpend } from '../../interfaces/Order'
import Order from '../../models/Order'
import { Button } from '../Button'
import './PaymentQRCard.css'

interface Props {
  amount: string // amount + currency
  address: string
  cryptocurrency: string
  memo?: string
  handlePay?: (orderDetails: OrdersSpend) => void
  handleCopyToClipboard: (field: string) => void
}

const PaymentQRCard = ({
  address,
  amount,
  memo,
  handleCopyToClipboard,
  handlePay,
  cryptocurrency,
}: Props) => {
  const [isPaying, setIsPaying] = useState(false)

  const handlePayment = async () => {
    const details = {
      wallet: cryptocurrency,
      address,
      amount: Number(amount),
      feeLevel: 'PRIORITY',
      memo: memo || '',
    }
    if (handlePay) {
      await handlePay(details)
    }
  }

  return (
    <div className="uk-card uk-card-default uk-card-body uk-flex uk-flex-row">
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
          <label className="uk-text-break">Address: {address}</label>
          {/* <a
          className="text-underline uk-text-small uk-margin-left"
          onClick={() => handleCopyToClipboard('address')}
        >
          Copy
        </a> */}
        </div>
        <div className="uk-margin uk-margin-remove-horizontal">
          <div className="uk-inline">
            <Button className="uk-button uk-button-default" type="button">
              Pay from wallet
            </Button>
            <div id="dropID" data-uk-dropdown="mode: click">
              <div className="card-prompt">
                Are you sure?Total is{' '}
                <b>
                  {amount} {cryptocurrency}
                </b>
                <div className="btn-cont">
                  <Button
                    className="uk-button uk-button-default"
                    onClick={() => {
                      const element = document.getElementById('dropID')
                      if (element) {
                        window.UIkit.dropdown(element).hide()
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="uk-button uk-button-primary"
                    onClick={async () => {
                      setIsPaying(true)
                      try {
                        await handlePayment()
                        setIsPaying(false)
                      } catch (e) {
                        setIsPaying(false)
                      }
                    }}
                    showSpinner={isPaying}
                  >
                    Yes, Pay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="color-secondary uk-text-break">
            Once you have paid, it may take a bit for the interface to update.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentQRCard
