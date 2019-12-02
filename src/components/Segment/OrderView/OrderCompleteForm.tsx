import React from 'react'

import { useState } from 'react'
import { Button } from '../../Button'
import { StarRatingGroup } from '../../Rating'
import OrderSummaryItemSegment from '../OrderSummaryItemSegment'
import SimpleBorderedSegment from '../SimpleBorderedSegment'

const OrderCompleteForm = ({
  locale,
  order,
  disableReviewTextArea,
  review,
  orderCompleteRatings,
  handleCompleteSubmit,
}) => {
  const [reviewText, setReviewText] = useState(review)
  const [orderCompleteRatingsCriteria, setOrderCompleteRatingsCriteria] = useState(
    orderCompleteRatings
  )
  const [isLoading, setIsLoading] = useState(false)

  function handleStarRatingChange(index: number, value: number, type: string) {
    orderCompleteRatingsCriteria[index].value = value
    setOrderCompleteRatingsCriteria([...orderCompleteRatingsCriteria])
  }

  function completeSubmit(evt) {
    evt.preventDefault()
    setIsLoading(true)
    handleCompleteSubmit(orderCompleteRatingsCriteria, reviewText)
    setIsLoading(false)
  }

  return (
    <div className="uk-margin-bottom">
      <OrderSummaryItemSegment title={locale.orderViewPage.completeOrderText} date={new Date()}>
        <SimpleBorderedSegment
          title={`${
            order.buyer!.name
          }'s ${locale.orderViewPage.fulfillOrderForm.reviewLabel.toLowerCase()}`}
        >
          <div className="uk-flex-row uk-width-1-1">
            <form
              className="uk-form uk-form-stacked uk-width-1-1 uk-flex uk-flex-column"
              onSubmit={completeSubmit}
            >
              <div className="uk-flex uk-flex-row">
                <div className="uk-flex-1 uk-width-1-1 uk-padding-small uk-padding-remove-horizontal">
                  <textarea
                    className="uk-textarea uk-width-1-1 uk-height-1-1"
                    rows={5}
                    style={{
                      border: disableReviewTextArea ? 'none' : '',
                      backgroundColor: '#fff',
                    }}
                    disabled={disableReviewTextArea}
                    value={reviewText}
                    onChange={e => {
                      setReviewText(e.target.value)
                    }}
                  />
                </div>
                <StarRatingGroup
                  handleStarRatingChange={handleStarRatingChange}
                  ratingType="orderCompleteRatings"
                  ratings={orderCompleteRatingsCriteria}
                />
              </div>
              <div className="uk-flex uk-flex-row uk-flex-middle uk-padding-small uk-padding-remove-horizontal">
                <Button
                  className="uk-button uk-button-primary"
                  showSpinner={isLoading}
                  type="submit"
                >
                  {locale.orderViewPage.completeOrderText.toUpperCase()}
                </Button>
              </div>
            </form>
          </div>
        </SimpleBorderedSegment>
      </OrderSummaryItemSegment>
    </div>
  )
}

export default OrderCompleteForm
