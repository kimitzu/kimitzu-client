import React from 'react'

import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderErrorSegment = ({ locale, order }) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment title={locale.orderViewPage.processErrorHeader}>
      <SimpleBorderedSegment>
        <p className="color-secondary">
          {locale.orderViewPage.orderProcessErrorParagraph}{' '}
          <span className="uk-text-capitalize uk-text-danger">
            {order.contract.errors!.join(',')}
          </span>
        </p>
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderErrorSegment
