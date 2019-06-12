import React from 'react'

import './PayoutCard.css'

const PayoutCard = () => (
  <div id="profile-payout">
    <div className="uk-card uk-card-default uk-card-body">
      <h3 id="title-social-media" className="uk-card-title">
        Payout Method
      </h3>
      <div id="social-media">
        <div id="account-icon">
          <span uk-icon="icon: check" className="blueIcon" />
        </div>
        <div id="account-name">
          <p> Bitcoin </p>
        </div>
      </div>
      <div id="social-media">
        <div id="account-icon">
          <span uk-icon="icon: check" className="blueIcon" />
        </div>
        <div id="account-name">
          <p> Bitcoin Cash </p>
        </div>
      </div>
      <div id="social-media">
        <div id="account-icon">
          <span uk-icon="icon: check" className="blueIcon" />
        </div>
        <div id="account-name">
          <p> Zcash </p>
        </div>
      </div>
    </div>
  </div>
)

export default PayoutCard
