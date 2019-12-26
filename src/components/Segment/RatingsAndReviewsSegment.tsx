import React from 'react'

import RatingsSummarySegment from './RatingsSummarySegment'
import UserReviewSegment from './UserReviewSegment'

import KimitzuCompletionRatings from '../../models/KimitzuCompletionRatings'
import KimitzuFulfillmentRatings from '../../models/KimitzuFulfillmentRatings'
import KimitzuRatings from '../../models/KimitzuRatings'

interface Props {
  ratings: KimitzuRatings
  inlineSummaryDisplay?: boolean
}

const renderReviews = (ratings: KimitzuRatings) => {
  if (ratings.type === 'complete') {
    const ratingInformation = ratings as KimitzuCompletionRatings
    return ratingInformation.ratings.map(rating => {
      const ratingElement = rating.ratings[0].ratingData
      return (
        <UserReviewSegment
          key={`${rating.orderId}`}
          imgSrc={''}
          reviewer={ratingElement.buyerName}
          review={ratingElement.review}
          timeStamp={ratingElement.timestamp}
          starValue={rating.average}
        />
      )
    })
  } else {
    const ratingInformation = ratings as KimitzuFulfillmentRatings
    return ratingInformation.ratings.map(rating => {
      return (
        <UserReviewSegment
          key={`${rating.orderId}`}
          imgSrc={''}
          reviewer={rating.buyerRating.vendorID}
          review={rating.buyerRating.comment}
          timeStamp={rating.timestamp}
          starValue={rating.average}
        />
      )
    })
  }
}

const RatingsAndReviewSegment = ({ ratings, inlineSummaryDisplay }: Props) => {
  return (
    <div>
      <RatingsSummarySegment ratings={ratings} isInlineDisplay={inlineSummaryDisplay} />
      {renderReviews(ratings)}
    </div>
  )
}

export default RatingsAndReviewSegment
