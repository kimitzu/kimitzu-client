import React from 'react'
import StarRatingComponent from 'react-star-rating-component'

interface Props {
  review: string
  overallRating: number
  qualityRating: number
  advertiseRating: number
  deliveryRating?: number
  serviceRating?: number
  handleChange: (field: string, value: string) => void
  disableTextArea?: boolean
}

const ReviewListingForm = ({
  advertiseRating,
  deliveryRating,
  disableTextArea,
  handleChange,
  overallRating,
  qualityRating,
  review,
  serviceRating,
}: Props) => (
  <form className="uk-form uk-width-1-1 uk-flex uk-flex-row">
    <div className="uk-flex-1 uk-width-1-1 uk-padding-small uk-padding-remove-horizontal">
      <textarea
        className="uk-textarea uk-width-1-1 uk-height-1-1"
        rows={5}
        style={{ border: disableTextArea ? 'none' : '', backgroundColor: '#fff' }}
        disabled={disableTextArea}
        value={review}
        onChange={e => handleChange('review', e.target.value)}
      />
    </div>
    <div className="uk-flex uk-flex-column uk-padding-small uk-padding-remove-vertical">
      <div>
        <h5>Overall</h5>
        <StarRatingComponent name="overall" starCount={5} value={overallRating} />
      </div>
      <div>
        <h5>Quality</h5>
        <StarRatingComponent name="quality" starCount={5} value={qualityRating} />
      </div>
      <div>
        <h5>As Advertised</h5>
        <StarRatingComponent name="asAdvertised" starCount={5} value={advertiseRating} />
      </div>
      {deliveryRating ? (
        <div>
          <h5>Delivery</h5>
          <StarRatingComponent name="delivery" starCount={5} value={deliveryRating} />
        </div>
      ) : null}
      {serviceRating ? (
        <div>
          <h5>Service</h5>
          <StarRatingComponent name="service" starCount={5} value={serviceRating} />
        </div>
      ) : null}
    </div>
  </form>
)

export default ReviewListingForm
