import React from 'react'
import StarRatingComponent from 'react-star-rating-component'

import { RatingHandler, RatingInput } from '../../interfaces/Rating'

interface Props {
  ratings: RatingInput[]
  ratingType: string
  handleStarRatingChange: RatingHandler
}

const StarRatingGroup = ({ handleStarRatingChange, ratingType, ratings }: Props) => (
  <div className="uk-flex uk-flex-column uk-padding-small uk-padding-remove-vertical">
    {ratings.map((rating, index) => {
      const { fieldName, starCount, title, value } = rating
      return (
        <div key={`${rating.title}${index}`}>
          <h5 className="uk-text-capitalize">{title}</h5>
          <StarRatingComponent
            name={fieldName}
            starCount={starCount || 5}
            value={value}
            onStarClick={nextValue => {
              handleStarRatingChange(rating.index, nextValue, ratingType)
            }}
          />
        </div>
      )
    })}
  </div>
)

export default StarRatingGroup
