import React from 'react'

import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderDisputeExpired = ({ locale }) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment title="Dispute Expired">
      <SimpleBorderedSegment>
        <p className="color-secondary">{locale.orderViewPage.disputeExpiredParagraph}</p>
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderDisputeExpired
