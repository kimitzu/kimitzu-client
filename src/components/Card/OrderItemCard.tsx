import React from 'react'

import config from '../../config'
import OrderHistory from '../../models/OrderHistory'
import './OrderItemCard.css'

interface OrderItemCardProps {
  data: OrderHistory
}

const OrderItemCard = ({ data }: OrderItemCardProps) => (
  <div className="uk-flex uk-flex-row uk-card uk-card-default uk-flex-middle uk-card-body emphasize-on-hover uk-margin-bottom">
    <div className="">
      <img
        src={data.thumbnail ? `${config.djaliHost}/djali/media?id=${data.thumbnail}` : ''}
        alt=""
        width="150"
        onError={(ev: React.SyntheticEvent<HTMLImageElement, Event>) => {
          const image = ev.target as HTMLImageElement
          image.onerror = null
          image.src = `${config.host}/images/picture.png`
        }}
      />
    </div>
    <div className="uk-margin-left">
      <p className="uk-text-bold uk-margin-bottom"> {data.title} </p>
      <div>
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
)

export default OrderItemCard
