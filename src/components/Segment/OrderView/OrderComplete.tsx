import React from 'react'

import { Link } from 'react-router-dom'
import StarRatingComponent from 'react-star-rating-component'
import config from '../../../config'
import decodeHtml from '../../../utils/Unescape'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderComplete = ({ locale, order }) => (
  <div className="uk-margin-bottom">
    <OrderSummaryItemSegment
      title={locale.orderViewPage.completedHeader}
      date={new Date(order.contract.buyerOrderCompletion.timestamp)}
    >
      <SimpleBorderedSegment
        imageSrc={
          order.buyer!.avatarHashes.original
            ? `${config.djaliHost}/kimitzu/media?id=${order.buyer!.avatarHashes.original}`
            : `${process.env.PUBLIC_URL}/images/user.svg`
        }
      >
        <div className="uk flex">
          <div className="uk-flex uk-flex-row">
            <h5 className="uk-text-bold uk-flex-2">
              <Link to={`/profile/${order.contract.buyerOrder.buyerID.peerID}`}>
                {order.buyer ? order.buyer!.name : ''}
              </Link>
            </h5>
            <div id="small-star-rating-wrapper" className="uk-flex-1 uk-text-right">
              <StarRatingComponent
                starCount={5}
                value={order.contract.buyerOrderCompletion.ratings[0].ratingData.overall}
                name="orderRatings"
              />
            </div>
          </div>
          <div>
            <p className="color-secondary">
              {decodeHtml(order.contract.buyerOrderCompletion.ratings[0].ratingData.review)}
            </p>
          </div>
        </div>
      </SimpleBorderedSegment>
    </OrderSummaryItemSegment>
  </div>
)

export default OrderComplete
