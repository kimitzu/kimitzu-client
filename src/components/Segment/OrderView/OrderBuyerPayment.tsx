import React from 'react'

import { PaymentQRCard } from '../../Card'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'

const OrderBuyerPayment = ({ locale, order }) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment title={locale.orderViewPage.sendPaymentHeader}>
      <PaymentQRCard
        amount={order.contract.buyerOrder.payment.amount}
        address={
          order.contract.vendorOrderConfirmation
            ? order.contract.vendorOrderConfirmation.paymentAddress
            : order.contract.buyerOrder.payment.address
        }
        cryptocurrency={order.contract.buyerOrder.payment.coin}
        handleCopyToClipboard={field => {
          console.log(field)
        }}
        handlePay={async () => {
          try {
            await order.pay({
              wallet: order.contract.buyerOrder.payment.coin,
              address:
                order.contract.buyerOrder.payment.address ||
                order.contract.vendorOrderConfirmation.paymentAddress,
              amount: order.contract.buyerOrder.payment.amount,
              feeLevel: 'NORMAL',
              memo: '',
            })
            window.UIkit.notification(locale.orderViewPage.paymentSuccessNotif, {
              status: 'success',
            })
          } catch (e) {
            window.UIkit.notification(e.message, { status: 'danger' })
          }
        }}
      />
    </OrderSummaryItemSegment>
  </div>
)

export default OrderBuyerPayment
