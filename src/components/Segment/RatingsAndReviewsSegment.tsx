import React from 'react'

import RatingsSummarySegment from './RatingsSummarySegment'
import UserReviewSegment from './UserReviewSegment'

import Rating, { DjaliRatingItem, RatingInput, RatingSummary } from '../../interfaces/Rating'

interface Props {
  ratings?: Rating[]
  djaliRatings?: RatingSummary['djali']
  ratingInputs: RatingInput[]
  totalReviewCount?: number
  totalAverageRating?: number
  totalStarCount?: number
  inlineSummaryDisplay?: boolean
}

const renderReviews = (ratings?: Rating[], djaliRatings?: RatingSummary['djali']) => {
  if (ratings) {
    return ratings.map(rating => {
      const { ratingData, signature, avatar } = rating
      const { customerService, deliverySpeed, description, overall, quality } = ratingData
      const averageRating = (customerService + deliverySpeed + description + overall + quality) / 5
      return (
        <UserReviewSegment
          key={signature}
          imgSrc={avatar}
          reviewer={ratingData.buyerName}
          review={ratingData.review}
          timeStamp={ratingData.timestamp}
          starValue={averageRating}
        />
      )
    })
  } else if (djaliRatings && djaliRatings.buyerRatings) {
    return djaliRatings.buyerRatings.map((buyerRating: DjaliRatingItem) => {
      const { comment, fields, sourceId, reviewer, avatar, timestamp } = buyerRating
      const averageRating =
        fields.reduce((acc, cur) => {
          return acc + (cur.score * cur.weight) / 100
        }, 0) / fields.length
      return (
        <UserReviewSegment
          key={sourceId}
          imgSrc={avatar}
          reviewer={reviewer || 'User'}
          review={comment}
          timeStamp={timestamp}
          starValue={averageRating}
        />
      )
    })
  }
  return null
}

const RatingsAndReviewSegment = ({
  totalAverageRating,
  totalReviewCount,
  totalStarCount,
  djaliRatings,
  ratingInputs,
  ratings,
  inlineSummaryDisplay,
}: Props) => (
  <div>
    <RatingsSummarySegment
      ratings={ratings}
      djaliRatings={djaliRatings}
      ratingInputs={ratingInputs}
      totalAverageRating={totalAverageRating}
      totalReviewCount={totalReviewCount}
      totalStarCount={totalStarCount}
      isInlineDisplay={inlineSummaryDisplay}
    />
    {renderReviews(ratings, djaliRatings)}
  </div>
)

export default RatingsAndReviewSegment
