import React from 'react'
import StarRatingComponent from 'react-star-rating-component'
import { RatingInput } from '../../interfaces/Rating'

interface Props {
  review: string
  ratings: RatingInput[]
  ratingType: string
  handleChange: (field: any, value: any) => void
  handleStarRatingChange: (index: number, value: number, ratingType: string) => void
  disableTextArea?: boolean
  inlineDisplay?: boolean
  children?: JSX.Element | JSX.Element[]
}

const renderRatings = (
  ratings: RatingInput[],
  handleStarRatingChange: (index: number, value: number, ratingType: string) => void,
  ratingType: string
) => {
  return ratings && ratings.length > 0 ? (
    <div className="uk-flex uk-flex-column uk-padding-small uk-padding-remove-vertical">
      {ratings.map((rating, index) => {
        const { starCount, title, fieldName, value } = rating
        return (
          <div key={`${rating.title}${index}`}>
            <h5 className="uk-text-capitalize">{title}</h5>
            <StarRatingComponent
              name={fieldName}
              starCount={starCount || 5}
              value={value}
              onStarClick={(nextValue, prevValue, name) => {
                if (nextValue === prevValue) {
                  handleStarRatingChange(rating.index, 0, ratingType)
                } else {
                  handleStarRatingChange(rating.index, Number(nextValue.toString()), ratingType)
                }
              }}
            />
          </div>
        )
      })}
    </div>
  ) : null
}

const ReviewForm = ({
  disableTextArea,
  handleChange,
  ratings,
  review,
  inlineDisplay,
  children,
  handleStarRatingChange,
  ratingType,
}: Props) => (
  <div className="uk-flex-row uk-width-1-1">
    <form className={`uk-form uk-width-1-1 uk-flex uk-flex-${inlineDisplay ? 'row' : 'column'}`}>
      {!inlineDisplay ? renderRatings(ratings, handleStarRatingChange, ratingType) : null}
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
      {inlineDisplay ? renderRatings(ratings, handleStarRatingChange, ratingType) : null}
    </form>
    {children}
  </div>
)

export default ReviewForm
