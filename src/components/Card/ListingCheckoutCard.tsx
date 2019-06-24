import React from 'react'

import config from '../../config'
import Listing from '../../models/Listing'

import './ListingCheckoutCard.css'

interface Props {
  listing: Listing
  quantity: number
}

const ListingCheckoutCard = ({ listing, quantity }: Props) => (
  <div
    id="listing-checkout-card"
    className="uk-card uk-card-default uk-card-body uk-flex uk-flex-row"
  >
    <div id="listing-checkout-card-main">
      <label id="listing-checkout-card-column-header">Item</label>
      <div className="uk-flex uk-flex-row">
        <div id="listing-checkout-card-img">
          <img src={`${config.openBazaarHost}/ob/images/${listing.thumbnail.medium}`} />
        </div>
        <div id="listing-checkout-card-details" className="uk-padding-small">
          <h5>{listing.item.title}</h5>
          <p>
            Type: <label>{listing.metadata.contractType}</label>
          </p>
          <p>
            {/* TODO: Update classification */}
            Classification: <label>Software and application developers and analyst</label>
          </p>
        </div>
      </div>
    </div>
    <div className="uk-flex-1">
      <label id="listing-checkout-card-column-header">Price</label>
      <div id="listing-checkout-card-side-data">
        <p>{`${listing.displayValue} ${listing.metadata.pricingCurrency.toUpperCase()}${
          listing.item.serviceRateMethod ? `/${listing.item.serviceRateMethod}` : ''
        }`}</p>
      </div>
    </div>
    <div className="uk-flex-1">
      <label id="listing-checkout-card-column-header">Quantity</label>
      <div id="listing-checkout-card-side-data">
        <p>{quantity}</p>
      </div>
    </div>
  </div>
)

export default ListingCheckoutCard
