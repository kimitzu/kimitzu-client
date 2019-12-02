import React from 'react'

import config from '../../../config'
import decodeHtml from '../../../utils/Unescape'
import OrderDetailsSegment from '../OrderDetailsSegment'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderSummary = ({ locale, order }) => (
  <div className="uk-margin-bottom uk-width-1-1">
    <OrderSummaryItemSegment title={locale.orderViewPage.orderDetailsHeader}>
      <SimpleBorderedSegment>
        <OrderDetailsSegment
          listingName={decodeHtml(order.contract.vendorListings[0].item.title)}
          listingThumbnailSrc={`${config.djaliHost}/djali/media?id=${order.contract.vendorListings[0].item.images[0].medium}`}
          listingType="SERVICE"
          quantity={`${order.contract.buyerOrder.items[0].quantity ||
            order.contract.buyerOrder.items[0].quantity64}`}
          total={`${(
            order.value *
            (order.contract.buyerOrder.items[0].quantity ||
              order.contract.buyerOrder.items[0].quantity64)
          ).toFixed(2)} ${order[order.role!].preferences.fiat} (${order.cryptoValue})`}
          memo={decodeHtml(order.contract.buyerOrder.items[0].memo)}
        />
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderSummary
