import React from 'react'

import RatingsSummarySegment from './RatingsSummarySegment'
import UserReviewSegment from './UserReviewSegment'

import Rating, { KimitzuRatingItem, RatingSummary } from '../../interfaces/Rating'
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
    return ratingInformation.ratings.map((rating, index) => {
      const ratingElement = rating.ratings[0].ratingData
      // const { ratingData, signature, avatar } = rating
      // const { customerService, deliverySpeed, description, overall, quality } = ratingData
      // const averageRating = (customerService + deliverySpeed + description + overall + quality) / 5
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
      // Old calculation for reference
      // return acc + (cur.score * cur.weight) / 100
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
