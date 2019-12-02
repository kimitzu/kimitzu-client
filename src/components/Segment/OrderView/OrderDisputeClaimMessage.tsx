import React from 'react'

import decodeHtml from '../../../utils/Unescape'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderDisputeClaimMessage = ({ locale, order }) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment
      title={locale.orderViewPage.disputeStartedHeader}
      date={new Date(order.contract.dispute!.timestamp)}
    >
      <SimpleBorderedSegment title={'The order is being disputed:'}>
        <p className="color-secondary">{decodeHtml(order.contract.dispute!.claim)}</p>
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderDisputeClaimMessage
