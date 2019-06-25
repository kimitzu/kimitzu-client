import React from 'react'

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
      <button className="uk-button uk-button-primary" onClick={props.handleGetStarted}>
        Get Started
      </button>
      <button
        className="uk-button uk-button-default uk-margin-small-right"
        type="button"
        uk-toggle="target: #modal-close-default"
      >
        Default
      </button>
      <div id="modal-close-default" data-uk-modal>
        <div id="payment-modal" className="uk-modal-dialog uk-modal-body">
          <button className="uk-modal-close-default" type="button" data-uk-close />
          <img
            width="15%"
            height="15%"
            src="https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-1/254000/52-512.png"
          />
          <h4>Payment Sucessful!</h4>
          <p>
            Thank you for your purchase! If you'd like to check the status of your order view your
            Purchases page.
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default IntroductionCard
