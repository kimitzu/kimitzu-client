import React from 'react'

import { Link } from 'react-router-dom'
import config from '../../../config'
import decodeHtml from '../../../utils/Unescape'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderFulfill = ({ locale, order }) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment
      title={locale.orderViewPage.fulfilledHeader}
      date={new Date(order.contract.vendorOrderFulfillment[0].timestamp)}
    >
      <SimpleBorderedSegment
        imageSrc={
          order.vendor!.avatarHashes.medium
            ? `${config.kimitzuHost}/kimitzu/media?id=${order.vendor!.avatarHashes.medium}`
            : `${process.env.PUBLIC_URL}/images/user.svg`
        }
      >
        <div className="uk-flex">
          <h5 className="uk-text-bold">
            <Link to={`/profile/${order.contract.vendorListings[0].vendorID.peerID}`}>
              {order.vendor ? order.vendor!.name : ''}
            </Link>
          </h5>
        </div>
        <p className="color-secondary">
          {decodeHtml(order.contract.vendorOrderFulfillment[0].note)}
        </p>
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderFulfill
