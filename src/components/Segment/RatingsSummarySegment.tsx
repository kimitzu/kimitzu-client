import React from 'react'
import StarRatingComponent from 'react-star-rating-component'

import Rating, { RatingInput, RatingSummary } from '../../interfaces/Rating'

interface Props {
  ratingInputs: RatingInput[]
  ratings?: Rating[]
  djaliRatings?: RatingSummary['djali']
  totalAverageRating?: number
  totalReviewCount?: number
  totalStarCount?: number
  isInlineDisplay?: boolean
}

const displayRatingValue = (originalVal: number) => {
  let rating = originalVal.toFixed(2)
  if (rating.endsWith('0')) {
    rating = rating.slice(0, rating.length - 1)
  }
  return rating
}

const RatingsSummarySegment = ({
  ratingInputs,
  ratings,
  djaliRatings,
  totalAverageRating = 0,
  isInlineDisplay,
  // totalReviewCount = 0, this might need in the future
  totalStarCount = 5,
}: Props) => {
  let averageRatings = ratingInputs.reduce((acc, cur) => {
    return Object.assign(acc, { [cur.fieldName]: 0 })
  }, {})
  const keys = Object.keys(averageRatings)
  if (ratings) {
    // Get total ratings for each fieldname
    averageRatings = ratings.reduce((acc, cur) => {
      keys.forEach(key => {
        if (cur.ratingData[key]) {
          acc[key] += cur.ratingData[key]
        }
      })
      return acc
    }, averageRatings)
    const entries = ratings.length
    // Get the average for each fieldname
    keys.forEach(key => (averageRatings[key] = averageRatings[key] / entries))
  } else if (djaliRatings && djaliRatings.buyerRatings) {
    const { average, buyerRatings, count } = djaliRatings
    totalAverageRating = (average / 100) * totalStarCount
    // totalReviewCount = count || buyerRatings!.length
    averageRatings = buyerRatings.reduce((acc, cur) => {
      ratingInputs.forEach(ratingInput => {
        const index = cur.fields.findIndex(field => {
          if (!field.type) {
            field.type = 0
          }
          return field.type === ratingInput.index
        })
        if (index !== -1 && index < ratingInputs.length) {
          const { score, weight } = cur.fields[index]
          acc[ratingInput.fieldName] += (score * weight) / 100
        }
      })
      return acc
    }, averageRatings)
    const entries = djaliRatings.buyerRatings.length
    keys.forEach(key => (averageRatings[key] = averageRatings[key] / entries))
  }
  return (
    <div className={`uk-flex uk-flex-${isInlineDisplay ? 'row' : 'column'}`}>
      <div
        className={`uk-flex uk-flex-1 uk-flex-middle uk-flex-center uk-flex-column ${
          isInlineDisplay ? 'divider border-remove-vertical border-remove-left' : ''
        }`}
      >
        <h4>
          {displayRatingValue(totalAverageRating)}/{totalStarCount}
        </h4>
        <StarRatingComponent
          value={totalAverageRating}
          name="average-ratings"
          starCount={totalStarCount}
        />
      </div>
      <div className="uk-grid-divider uk-grid-small uk-flex-3 uk-flex-center" data-uk-grid>
        {ratingInputs.map(ratingInput => (
          <div key={ratingInput.fieldName}>
            <div style={{ minWidth: '135px' }} className="uk-text-center">
              <label>
                {ratingInput.title} ({displayRatingValue(averageRatings[ratingInput.fieldName])})
              </label>
            </div>
            <div className="uk-flex-center uk-flex">
              <StarRatingComponent
                value={averageRatings[ratingInput.fieldName]}
                name={ratingInput.fieldName}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RatingsSummarySegment
