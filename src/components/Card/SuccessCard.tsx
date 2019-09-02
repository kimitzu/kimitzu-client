import React from 'react'

interface Props {
  onSuccessHome: () => void
  name: string
}

const SuccessCard = (props: Props) => (
  <div id="success-card" className="uk-flex-center">
    <div id="card-title">
      <h1 className="color-primary" id="djali-text">
        Welcome to DJALI, {props.name ? props.name : 'guest'}!
      </h1>
    </div>
    <div className="uk-flex uk-flex-column">
      <div id="body-item">
        <p id="description-text" className="color-primary">
          A free market for services
        </p>
      </div>
      <div id="body-item">
        <button id="home" className="uk-button uk-button-primary" onClick={props.onSuccessHome}>
          Home
        </button>
      </div>
    </div>
  </div>
)

export default SuccessCard
