import React from 'react'

import config from '../../config'
import OrderHistory from '../../models/OrderHistory'

import { localeInstance } from '../../i18n'

import './OrderItemCard.css'

interface OrderItemCardProps {
  data: OrderHistory
  source: string
}

const OrderItemCard = ({ data, source }: OrderItemCardProps) => {
  const { orderViewPage } = localeInstance.get.localizations

  return (
    <div className="ov-container uk-width-expand@s">
      <div className="header-img uk-visible@m">
        <img
          src={data.thumbnail ? `${config.djaliHost}/djali/media?id=${data.thumbnail}` : ''}
          alt="thumbnail"
          onError={(ev: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const image = ev.target as HTMLImageElement
            image.onerror = null
            image.src = `${config.host}/images/picture.png`
          }}
        />
      </div>
      <div className={'ov-details uk-text-truncate'}>
        <div className={'left-details'}>
          <div className="uk-hidden@m uk-flex uk-flex-row">
            <div className={'state-tag-' + data.state}>{data.state}</div>
            <div className={'cost-mobile'}>
              <span className={'total'}>{data.displayValue}</span>
              <span className={'coin'}>{data.paymentCoin}</span>
            </div>
          </div>
          <span className={'order-item-title'}>{data.title}</span>
          <span className={'mono-id order-id'}>{data.orderId}</span>
          <span className={'label'}>{new Date(data.timestamp).toLocaleString()}</span>
          <div className={'spacer'} />
          <div className="uk-grid" uk-grid>
            {source === 'sales' || source === 'cases' ? (
              <div>
                <div className={'label'}>{orderViewPage.buyertext}</div>
                <div>{data.buyerHandle}</div>
              </div>
            ) : null}
            {source === 'purchases' || source === 'cases' ? (
              <div>
                <div className={'label'}>{orderViewPage.vendorText}</div>
                <div>{data.vendorHandle}</div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="right-details uk-visible@m">
          <div className={'cost-desktop'}>
            <span className={'total'}>{data.displayValue}</span>
            <span className={'coin'}>{data.paymentCoin}</span>
          </div>
          <div className={'state-tag-' + data.state}>{data.state}</div>
        </div>
      </div>
    </div>
  )
}

export default OrderItemCard
