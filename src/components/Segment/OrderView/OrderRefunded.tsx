import React from 'react'

import { Link } from 'react-router-dom'
import config from '../../../config'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderRefunded = ({ locale, order }) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment
      title={locale.orderViewPage.refundedHeader}
      date={new Date(order.contract.refund!.timestamp)}
    >
      <SimpleBorderedSegment
        imageSrc={
          order.vendor!.avatarHashes.original
            ? `${config.djaliHost}/kimitzu/media?id=${order.vendor!.avatarHashes.original}`
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
          {locale.orderViewPage.refundedParagraph}
          <br />
          {order.contract.refund!.refundTransaction.txid}
        </p>
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderRefunded
