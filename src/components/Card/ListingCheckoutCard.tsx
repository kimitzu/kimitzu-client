import React from 'react'

import './ListingCheckoutCard.css'

const ListingCheckoutCard = () => (
  <div
    id="listing-checkout-card"
    className="uk-card uk-card-default uk-card-body uk-flex uk-flex-row"
  >
    <div id="listing-checkout-card-main">
      <label id="listing-checkout-card-column-header">Item</label>
      <div className="uk-flex uk-flex-row">
        <div className="uk-flex-1">
          <img src="https://dotesports-media.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2019/06/18213940/krugs.png" />
        </div>
        <div className="uk-flex-1 uk-padding-small">
          <h5>LISTING NAME</h5>
          <p>
            Type: <label>Service</label>
          </p>
          <p>
            Classification: <label>Software and application developers and analyst</label>
          </p>
        </div>
      </div>
    </div>
    <div className="uk-flex-1">
      <label id="listing-checkout-card-column-header">Price</label>
      <div id="listing-checkout-card-side-data">
        <p>$100.00/hr</p>
      </div>
    </div>
    <div className="uk-flex-1">
      <label id="listing-checkout-card-column-header">Quantity</label>
      <div id="listing-checkout-card-side-data">
        <p>5</p>
      </div>
    </div>
  </div>
)

export default ListingCheckoutCard
