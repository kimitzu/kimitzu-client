import React from 'react'

import { localeInstance } from '../../i18n'

interface Props {
  listingName: string
  listingThumbnailSrc: string
  listingType: string
  quantity: string // number plus rate of method
  total: string // in fiat plus in crypto
  memo?: string
}

const OrderDetailsSegment = ({
  listingName,
  listingType,
  listingThumbnailSrc,
  memo,
  quantity,
  total,
}: Props) => {
  const { orderDetails } = localeInstance.get.localizations.orderViewPage

  return (
    <div className="uk-flex uk-flex-row uk-width-1-1">
      <div className="uk-margin-small-right">
        <img src={listingThumbnailSrc} width="120" alt="Avatar" />
      </div>
      <div className="uk-flex uk-flex-column uk-width-1-1">
        <div className="uk-flex-1 uk-margin-small-bottom">
          <h5 className="uk-text-bold">{listingName}</h5>
          <label className="color-secondary">
            {orderDetails.typeLabel}: {listingType}
          </label>
        </div>
        <div className="uk-flex-1 uk-flex uk-flex-row uk-margin-small-bottom">
          <div className="uk-flex-1">
            <h5 className="uk-text-bold">{orderDetails.quantityHeader}</h5>
            <label className="color-secondary">{quantity}</label>
          </div>
          <div className="uk-flex-1">
            <h5 className="uk-text-bold">{orderDetails.totalHeader}</h5>
            <label className="color-secondary">{total}</label>
          </div>
        </div>
        <div className="uk-flex-1 uk-margin-small-bottom">
          <h5 className="uk-text-bold">{orderDetails.memoHeader}</h5>
          <label className="color-secondary">{memo || 'N/A'}</label>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsSegment
