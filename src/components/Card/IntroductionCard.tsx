import React from 'react'

import './IntroductionCard.css'

interface Props {
  handleGetStarted: () => void
}

const IntroductionCard = (props: Props) => (
  <div id="main-card" className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
    <div>
      <p className="color-primary" id="connection-text">
        CONNECTION: Built in server{' '}
        <a className="uk-margin-small-right color-primary" uk-icon="cog" />
      </p>
    </div>
    <div id="card-title">
      <h1 className="color-primary" id="djali-text">
        D J A L I
      </h1>
    </div>
    <div className="uk-flex uk-flex-column">
      <div id="body-item">
        <p id="description-text" className="color-primary">
          A FREE MARKETPLACE. NO FEES. NO RETRICTIONS. EARN CRYPTOCURRENCY.
        </p>
      </div>
      <div id="body-item">
        <h3 id="buy-sell-text" className="color-primary">
          Buy and Sell Freely
        </h3>
      </div>
      <div id="body-item">
        <button className="uk-button uk-button-primary" onClick={props.handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
    {/* <div id="get-started-btn">
    </div> */}
  </div>
)

export default IntroductionCard
