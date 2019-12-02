import React from 'react'

import { Link } from 'react-router-dom'
import config from '../../../config'
import { Localizations } from '../../../i18n/LocalizationsInterface'
import Order from '../../../models/Order'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

interface OrderRefundedInterface {
  locale: Localizations
  order: Order
}

const OrderCancelled = ({ locale, order }: OrderRefundedInterface) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment
      title={locale.orderViewPage.canceledOrderHeader}
      date={new Date(order.refundAddressTransaction.timestamp)}
    >
      <SimpleBorderedSegment
        imageSrc={
          order.buyer!.avatarHashes.original
            ? `${config.djaliHost}/djali/media?id=${order.buyer!.avatarHashes.original}`
            : `${process.env.PUBLIC_URL}/images/user.svg`
        }
      >
        <p className="color-secondary">{locale.orderViewPage.cancelOrderText}</p>
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderCancelled
