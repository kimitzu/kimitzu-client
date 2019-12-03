import React from 'react'

import { Button } from '../Button'

import { localeInstance } from '../../i18n'

import './IntroductionCard.css'

interface Props {
  handleGetStarted: () => void
}

const IntroductionCard = (props: Props) => {
  const { intro } = localeInstance.get.localizations

  return (
    <div className="uk-width-1-2@m uk-width-3-4">
      <div className="uk-flex uk-flex-center uk-margin-small-top">
        <img id="introduction-logo" src="./images/Logo/full-blue.png" />
      </div>
      <div id="body-item">
        <p id="description-text" className="color-primary">
          {intro.appDescription}
        </p>
      </div>
      <div id="introduction-footer">
        <a id="new-to-kimitzu-text" className="color-primary">
          {intro.helper}
        </a>
        <Button className="uk-button uk-button-primary" onClick={props.handleGetStarted}>
          {intro.nextBtnText}
        </Button>
      </div>
    </div>
  )
}

export default IntroductionCard
