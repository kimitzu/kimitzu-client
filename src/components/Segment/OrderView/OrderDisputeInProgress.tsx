import React from 'react'

import { Button } from '../../Button'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderDisputeInProgress = ({ locale, handleChangeCurrentContent }) => (
  <div className="uk-margin-bottom">
    <SimpleBorderedSegment
      title={locale.orderViewPage.disputingHeader}
      sideButtons={
        <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-around">
          <Button
            className="uk-button uk-button-default uk-margin-small-left max-content-width button-small-padding"
            onClick={() => {
              const CONTENT_CONSTANTS_DISCUSSION = 2
              handleChangeCurrentContent(CONTENT_CONSTANTS_DISCUSSION)
            }}
          >
            {locale.orderViewPage.discussBtnText}
          </Button>
        </div>
      }
    >
      <p className="color-secondary">{locale.orderViewPage.disputingParagraph}</p>
    </SimpleBorderedSegment>
  </div>
)

export default OrderDisputeInProgress
