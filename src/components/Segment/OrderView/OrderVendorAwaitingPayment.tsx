import React from 'react'

import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderVendorAwaitingPayment = ({ locale }) => (
  <div className="uk-margin-bottom">
    <SimpleBorderedSegment title={locale.orderViewPage.awaitingPaymentHeader} icon="info">
      <p className="color-secondary">{locale.orderViewPage.awaitingPaymentParagraph}</p>
    </SimpleBorderedSegment>
  </div>
)

export default OrderVendorAwaitingPayment
