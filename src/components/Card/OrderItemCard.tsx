import React from 'react'

import config from '../../config'
import OrderHistory from '../../models/OrderHistory'
import './OrderItemCard.css'

interface OrderItemCardProps {
  data: OrderHistory
}

const OrderItemCard = ({ data }: OrderItemCardProps) => (
  <div className="emphasize-on-hover">
    <div className="uk-card uk-card-default uk-grid-collapse uk-margin" data-uk-grid>
      <div className="uk-card-media-left uk-cover-container uk-margin-left">
        <img
          id="purchase-listing-image"
          src={data.thumbnail ? `${config.djaliHost}/djali/media?id=${data.thumbnail}` : ''}
          alt=""
          data-uk-cover
        />
        <canvas width="200" height="150" />
      </div>
      <div className="uk-margin-left">
        <p id="purchase-listing-title"> {data.title} </p>
        <div id="purchase-listing-text">
          <p>
            Total:{' '}
            <b>
              {' '}
              {data.displayValue} {data.paymentCoin}{' '}
            </b>
          </p>
          <p>
            Order#: <b> {data.orderId || data.caseId} </b>
          </p>
          <p>
            {data.source === 'sales' ? 'Buyer' : 'Vendor'}:{' '}
            <b> {(data.source === 'sales' ? data.buyerHandle : data.vendorHandle) || 'Unknown'} </b>
          </p>
          <p>
            Date: <b> {new Date(data.timestamp).toLocaleString()} </b>
          </p>
          <p>
            Status: <b> {data.state} </b>
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default OrderItemCard
