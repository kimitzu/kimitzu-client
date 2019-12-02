import React from 'react'

import { Link } from 'react-router-dom'
import currency from '../../../models/Currency'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderPayments = ({ locale, order }) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment
      title={locale.orderViewPage.paymentHeader}
      date={new Date(order.contract.buyerOrder.timestamp)}
    >
      <SimpleBorderedSegment icon="check">
        <div>
          <div className="uk-flex">
            <h5 className="uk-text-bold">
              {`${order.cryptoValue} to `}
              <Link to={`/profile/${order.contract.vendorListings[0].vendorID.peerID}`}>
                {order.vendor
                  ? order.vendor!.name || order.contract.vendorListings[0].vendorID.peerID
                  : order.contract.vendorOrderConfirmation.paymentAddress}
              </Link>
            </h5>
          </div>
          {order.paymentAddressTransactions.map(paymentTx => {
            return (
              <p key={paymentTx.txid} className="color-secondary">
                {currency.humanizeCrypto(paymentTx.value)} {order.contract.buyerOrder.payment.coin}{' '}
                - {paymentTx.confirmations} confirmations. {paymentTx.txid.substr(0, 10)}...{' '}
                {order.paymentAddressTransactions.length > 1
                  ? locale.orderViewPage.partialPaymentText
                  : locale.orderViewPage.fullPaymentText}
              </p>
            )
          })}
        </div>
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderPayments
