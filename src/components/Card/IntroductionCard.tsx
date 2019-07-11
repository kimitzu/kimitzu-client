import React from 'react'

import { Button } from '../Button'

import './IntroductionCard.css'

interface Props {
  handleGetStarted: () => void
}

const IntroductionCard = (props: Props) => (
  <div id="main-card" className="uk-card uk-card-default uk-card-body uk-width-1-2@m">
    <div className="uk-flex uk-flex-center uk-margin-small-top">
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
      <Button className="uk-button uk-button-primary" onClick={props.handleGetStarted}>
        GET STARTED
      </Button>
    </div>
  </div>
)

export default IntroductionCard
