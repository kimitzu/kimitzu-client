import React from 'react'
import { Button } from '../Button'

import { localeInstance } from '../../i18n'

const { localizations } = localeInstance.get

interface Props {
  onSuccessHome: () => void
  name: string
}

const SuccessCard = (props: Props) => (
  <div id="success-card" className="uk-flex-center">
    <div id="card-title">
      <h1 className="color-primary" id="kimitzu-text">
        {localizations.registrationPage.welcomeHeader} KIMITZU, {props.name ? props.name : 'guest'}!
      </h1>
    </div>
    <div className="uk-flex uk-flex-column">
      <div id="body-item">
        <p id="description-text" className="color-primary">
          A free market for services
        </p>
      </div>
      <div id="body-item">
        <Button id="home" className="uk-button uk-button-primary" onClick={props.onSuccessHome}>
          {localizations.homeBtnText}
        </Button>
      </div>
    </div>
  </div>
)

export default SuccessCard
