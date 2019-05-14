import React from 'react'

import './IntroductionCard.css'

const IntroductionCard = () => (
  <div id="main-card" className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
    <p id="connection-text">
      CONNECTION: Built in server <span className="uk-margin-small-right" uk-icon="cog" />
    </p>
    <h1 id="djali-text">
      {' '}
      <b> D J A L I </b>{' '}
    </h1>
    <p id="description-text"> A FREE MARKETPLACE. NO FEES. NO RETRICTIONS. EARN CRYPTOCURRENCY. </p>
    <h3 id="buy-sell-text">
      {' '}
      <b> Buy and Sell Freely </b>{' '}
    </h3>
    <div id="get-started-btn">
      <button className="uk-button uk-button-primary">Get Started</button>
    </div>
  </div>
)

export default IntroductionCard
