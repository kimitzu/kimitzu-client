import React from 'react'

import { Link } from 'react-router-dom'
import config from '../../../config'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderDisputeClosed = ({ locale, order }) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment
      title={locale.orderViewPage.disputeClosedHeader}
      date={new Date(order.contract.disputeAcceptance!.timestamp)}
    >
      <SimpleBorderedSegment
        imageSrc={
          order.contract.disputeAcceptance!.closedByProfile.avatarHashes.medium
            ? `${config.djaliHost}/djali/media?id=${
                order.contract.disputeAcceptance!.closedByProfile.avatarHashes.medium
              }`
            : `${process.env.PUBLIC_URL}/images/user.svg`
        }
      >
        <h5 className="uk-text-bold">
          <Link to={`/profile/${order.contract.vendorListings[0].vendorID.peerID}`}>
            {`${order.contract.disputeAcceptance!.closedByProfile.name} `}
          </Link>
          {locale.orderViewPage.payoutAcceptedHeader}
        </h5>
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderDisputeClosed
