import React from 'react'
import StarRatingComponent from 'react-star-rating-component'

import KimitzuRatings from '../../models/KimitzuRatings'

interface Props {
  ratings: KimitzuRatings
  isInlineDisplay?: boolean
}

const displayRatingValue = (originalVal: number) => {
  if (!originalVal) {
    return '0'
  }
  let rating = originalVal.toFixed(2)
  if (rating.endsWith('0')) {
    rating = rating.slice(0, rating.length - 1)
  }
  return rating
}

const RatingsSummarySegment = ({ ratings, isInlineDisplay }: Props) => {
  return (
    <div className={`uk-flex uk-flex-${isInlineDisplay ? 'row' : 'column'}`}>
      <div
        className={`uk-flex uk-flex-1 uk-flex-middle uk-flex-center uk-flex-column ${
          isInlineDisplay ? 'divider border-remove-vertical border-remove-left' : ''
        }`}
      >
        <h4>
          {displayRatingValue(ratings.averageRating)}/{ratings.maxRating}
        </h4>
        <StarRatingComponent
          value={ratings.ratingSum}
          name="average-ratings"
          starCount={ratings.maxRating}
        />
      </div>
      <div className="uk-grid-divider uk-grid-small uk-flex-3 uk-flex-center" data-uk-grid>
        {Object.keys(ratings.averageRatingBreakdown).map(rating => {
          const ratingElement = ratings.averageRatingBreakdown[rating]

          return (
            <div key={ratingElement.title}>
              <div style={{ minWidth: '135px' }} className="uk-text-center">
                <label>
                  {ratingElement.title} ({displayRatingValue(ratingElement.rating)})
                </label>
              </div>
              <div className="uk-flex-center uk-flex">
                <StarRatingComponent value={ratingElement.rating} name={ratingElement.title} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RatingsSummarySegment
