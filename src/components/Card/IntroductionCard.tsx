import React from 'react'

import './IntroductionCard.css'

interface Props {
  handleGetStarted: () => void
}

const IntroductionCard = (props: Props) => (
  <div id="main-card" className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
    <div>
      <p className="color-primary" id="connection-text">
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
          A free market for services
        </p>
      </div>
      <div id="body-item">
        <a id="buy-sell-text" className="color-primary">
          New to Djali?
        </a>
      </div>
      <div id="body-item">
        <button className="uk-button uk-button-primary" onClick={props.handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  </div>
)

export default IntroductionCard
