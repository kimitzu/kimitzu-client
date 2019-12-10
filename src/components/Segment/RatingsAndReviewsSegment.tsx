import React from 'react'

import RatingsSummarySegment from './RatingsSummarySegment'
import UserReviewSegment from './UserReviewSegment'

import Rating, { KimitzuRatingItem, RatingInput, RatingSummary } from '../../interfaces/Rating'

interface Props {
  ratings?: Rating[]
  kimitzuRatings?: RatingSummary['kimitzu']
  ratingInputs: RatingInput[]
  totalReviewCount?: number
  totalAverageRating?: number
  totalStarCount?: number
  inlineSummaryDisplay?: boolean
}

const renderReviews = (ratings?: Rating[], kimitzuRatings?: RatingSummary['kimitzu']) => {
  if (ratings) {
    return ratings.map((rating, index) => {
      const { ratingData, signature, avatar } = rating
      const { customerService, deliverySpeed, description, overall, quality } = ratingData
      const averageRating = (customerService + deliverySpeed + description + overall + quality) / 5
      return (
        <UserReviewSegment
          key={`${signature}${index}`}
          imgSrc={avatar}
          reviewer={ratingData.buyerName}
          review={ratingData.review}
          timeStamp={ratingData.timestamp}
          starValue={averageRating}
        />
      )
    })
  } else if (kimitzuRatings && kimitzuRatings.buyerRatings) {
    return kimitzuRatings.buyerRatings.map((buyerRating: KimitzuRatingItem, index: number) => {
      const { comment, fields, reviewer, avatar, timestamp } = buyerRating
      if (!fields) {
        return null
      }
      const averageRating =
        fields.reduce((acc, cur) => {
          return acc + (cur.score * cur.weight) / 100
        }, 0) / fields.length
      return (
        <UserReviewSegment
          key={`${timestamp}${index}`}
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
  kimitzuRatings,
  ratingInputs,
  ratings,
  inlineSummaryDisplay,
}: Props) => (
  <div>
    <RatingsSummarySegment
      ratings={ratings}
      kimitzuRatings={kimitzuRatings}
      ratingInputs={ratingInputs}
      totalAverageRating={totalAverageRating}
      totalReviewCount={totalReviewCount}
      totalStarCount={totalStarCount}
      isInlineDisplay={inlineSummaryDisplay}
    />
    {renderReviews(ratings, kimitzuRatings)}
  </div>
)

export default RatingsAndReviewSegment
