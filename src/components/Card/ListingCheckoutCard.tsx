import React from 'react'

import config from '../../config'
import ServiceTypes from '../../constants/ServiceTypes.json'
import { localeInstance } from '../../i18n'
import Listing from '../../models/Listing'

import './ListingCheckoutCard.css'

interface Props {
  listing: Listing
  quantity: number
}

const ListingCheckoutCard = ({ listing, quantity }: Props) => {
  const {
    localizations,
    localizations: {
      checkoutPage: { listingCard },
    },
  } = localeInstance.get
  return (
    <div
      id="listing-checkout-card"
      className="uk-card uk-card-default uk-card-body uk-flex uk-flex-row"
    >
      <div id="listing-checkout-card-main">
        <label id="listing-checkout-card-column-header">{listingCard.itemLabel}</label>
        <div className="uk-flex uk-flex-row">
          <div id="listing-checkout-card-img">
            <img
              src={`${config.openBazaarHost}/ob/images/${listing.thumbnail.medium}`}
              alt={listing.item.title}
            />
          </div>
          <div id="listing-checkout-card-details" className="uk-padding-small">
            <h5>{listing.item.title}</h5>
            <p>
              {localizations.typeLabel}: <label>{listing.metadata.contractType}</label>
            </p>
            <p>
              {listing.metadata.serviceClassification ? (
                <>
                  {listingCard.classificationLabel}:{' '}
                  <label>{listing.metadata.serviceClassification}</label>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>
      <div className="uk-flex-1 uk-text-center">
        <label id="listing-checkout-card-column-header">{listingCard.priceLabel}</label>
        <div id="listing-checkout-card-side-data">
          <p className="uk-text-uppercase">{`${listing.toLocalCurrency().price.toFixed(2)} ${
            listing.toLocalCurrency().currency
          }${listing.displayServiceRateMethod}`}</p>
        </div>
      </div>
      <div className="uk-flex-1 uk-text-center">
        <label id="listing-checkout-card-column-header">{listingCard.quantityLabel}</label>
        <div id="listing-checkout-card-side-data">
          <p>{quantity}</p>
        </div>
      </div>
    </div>
  )
}

export default ListingCheckoutCard
