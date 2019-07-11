import React, { ReactNode } from 'react'

import { Button } from '../Button'

import './RegistrationCard.css'

interface Props {
  content: ReactNode
  currentIndex: number
  numberOfPages: number
  handleNext: (event: React.FormEvent) => void
  handlePrev: (event: React.FormEvent) => void
  onAgree: () => void
}

const RegistrationCard = (props: Props) => (
  <div
    id="regcard"
    className="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-flex uk-flex-center uk-flex-column uk-flex-middle"
  >
    <img className="djali-logo-form" src="./images/Logo/Blue/SVG/Djali-Blue-Unique.svg" />
    <div className="uk-width-1-1">{props.content}</div>
    <div className="uk-flex uk-flex-center uk-width-1-1">
      <div id="footer-left">
        <a
          className="color-primary"
          onClick={props.handlePrev}
          uk-icon="icon: arrow-left"
          data-uk-slidenav-next
        />
      </div>
      <div id="footer-center" className="uk-flex-center">
        <label className="color-primary">
          {props.currentIndex} of {props.numberOfPages}
        </label>
      </div>
      <div id="footer-right">
        {props.currentIndex === 2 ? (
          <Button className="uk-button uk-button-primary uk-button-small" onClick={props.onAgree}>
            I AGREE
          </Button>
        ) : (
          <a
            className="color-primary"
            onClick={props.handleNext}
            uk-icon="icon: arrow-right"
            data-uk-slidenav-previous
          />
        )}
      </div>
    </div>
  </div>
)

export default RegistrationCard
