import React from 'react'

import './PurchaseCard.css'

const PurchaseCard = () => (
  <div>
    <div className="uk-card uk-card-default uk-grid-collapse uk-margin" data-uk-grid>
      <div className="uk-card-media-left uk-cover-container">
        <img
          id="purchase-listing-image"
          src="https://cdn.shopify.com/s/files/1/0882/3478/articles/Book_Log_1400x.progressive.jpg?v=1549548939"
          alt=""
          data-uk-cover
        />
        <canvas width="200" height="150" />
      </div>
      <div>
        <p id="purchase-listing-title"> Listing Name </p>
        <div id="purchase-listing-text">
          <p>
            Total: <b> $20/hr </b>
          </p>
          <p>
            Order#: <b> QWGMKOILHYGTBDESWAZXDCFGTYHB </b>
          </p>
          <p>
            Vendor: <b> Vendor Name </b>
          </p>
          <p>
            Date: <b> June 24, 2020 4:40 PM </b>
          </p>
          <p>
            Status: <b> Awaiting Payment </b>
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default PurchaseCard
