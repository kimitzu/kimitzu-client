import React from 'react'

import { Button } from '../../Button'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderDisputeOpen = ({ locale, handleChangeCurrentContent }) => (
  <div className="uk-margin-bottom">
    <SimpleBorderedSegment
      title={locale.orderViewPage.disputeOrderHeader}
      sideButtons={
        <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-around">
          <Button
            className="uk-button uk-button-danger uk-margin-small-left max-content-width button-small-padding"
            onClick={() => {
              // DISPUTE_FORM
              handleChangeCurrentContent(4)
            }}
          >
            {locale.orderViewPage.disputeBtnText}
          </Button>
        </div>
      }
    >
      <p className="uk-text-danger">{locale.orderViewPage.disputeOrderParagraph1}</p>
      <p className="uk-text-muted">{locale.orderViewPage.disputeOrderParagraph2}</p>
    </SimpleBorderedSegment>
  </div>
)

export default OrderDisputeOpen
