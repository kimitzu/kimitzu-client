import React, { MouseEvent, ReactNode } from 'react'

import './RegistrationCard.css'

interface Props {
  content: ReactNode
  currentIndex: number
  numberOfPages: number
  handleNext: (event: React.FormEvent) => void
  handlePrev: (event: React.FormEvent) => void
}

const RegistrationCard = (props: Props) => (
  <div id="regcard" className="uk-card-default uk-card-large uk-card-body uk-flex-center">
    <h3 id="regcard-title" className="color-primary uk-card-title">
      DJALI
    </h3>
    {props.content}
    <div className="uk-flex uk-flex-center">
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
          <button className="uk-button uk-button-primary uk-button-small">I AGREE</button>
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
