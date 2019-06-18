import React from 'react'

import './IntroductionCard.css'

interface Props {
  handleGetStarted: () => void
}

const IntroductionCard = (props: Props) => (
  <div id="main-card" className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
    <div id="card-title">
      <img id="introduction-logo" src="./images/Logo/Blue/SVG/Djali-Blue-Unique.svg" />
    </div>
    <div id="body-item">
      <p id="description-text" className="color-primary">
        A free market for services
      </p>
    </div>
    <div id="introduction-footer">
      <a id="new-to-djali-text" className="color-primary">
        New to Djali?
      </a>
      <button className="uk-button uk-button-primary" onClick={props.handleGetStarted}>
        Get Started
      </button>
    </div>
    {/* <div>
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
    </div> */}
  </div>
)

export default IntroductionCard
