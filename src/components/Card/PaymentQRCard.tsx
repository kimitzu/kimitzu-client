import QRCode from 'qrcode.react'
import React, { useState } from 'react'

import { Button } from '../Button'

import { OrdersSpend } from '../../interfaces/Order'
import currency from '../../models/Currency'
import Order from '../../models/Order'

import { localeInstance } from '../../i18n'

import './PaymentQRCard.css'

interface Props {
  amount: number
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
  const {
    localizations,
    localizations: { paymentQRCard },
  } = localeInstance.get
  const [isPaying, setIsPaying] = useState(false)

  const handlePayment = async () => {
    const details = {
      wallet: cryptocurrency,
      address,
      amount,
      feeLevel: 'PRIORITY',
      memo: memo || '',
    }
    if (handlePay) {
      await handlePay(details)
    }
  }

  return (
    <div className="uk-card uk-card-default uk-card-body uk-flex uk-flex-row">
      <QRCode
        value={Order.getQRCodeValue(
          cryptocurrency,
          address,
          currency.humanizeCrypto(amount).toString()
        )}
        size={180}
      />
      <div className="uk-padding uk-padding-remove-top uk-padding-remove-bottom">
        <div className="uk-flex uk-flex-middle">
          <h4 className="uk-text-bold">
            {paymentQRCard.header}: {currency.humanizeCrypto(amount)} {cryptocurrency}
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
            <Button className="uk-button uk-button-primary" type="button">
              {paymentQRCard.walletBtnText}
            </Button>
            <div id="dropID" data-uk-dropdown="mode: click">
              <div className="card-prompt">
                {paymentQRCard.paymentConfirmationText}
                <b>
                  {currency.humanizeCrypto(amount)} {cryptocurrency}
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
                    {localizations.cancelBtnText}
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
                    {paymentQRCard.confirmBtnText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="color-secondary uk-text-break">{paymentQRCard.paymentHelper}</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentQRCard
