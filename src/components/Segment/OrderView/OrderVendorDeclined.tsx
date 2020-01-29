import React from 'react'

import { Localizations } from '../../../i18n/LocalizationsInterface'
import Order from '../../../models/Order'
import { Button } from '../../Button'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

interface OrderVendorDeclinedInterface {
  locale: Localizations
  order: Order
}

const OrderVendorDeclined = ({ order, locale }: OrderVendorDeclinedInterface) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment title={`DECLINED`}>
      <SimpleBorderedSegment>
        <div className="uk-text-center">
          <p className="uk-text-danger">
            {order.role === 'vendor'
              ? locale.orderConfirmOffline.vendorDeclineMessage
              : locale.orderConfirmOffline.buyerDeclinedMessage}
          </p>
        </div>
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderVendorDeclined
