import moment from 'moment'
import React from 'react'
import StarRatingComponent from 'react-star-rating-component'
import decodeHtml from '../../utils/Unescape'

interface Props {
  imgSrc?: string
  review: string
  timeStamp?: string
  reviewer: string
  starValue: number
  starCount?: number
}

const UserReviewSegment = ({
  imgSrc,
  review,
  reviewer,
  timeStamp,
  starValue,
  starCount,
}: Props) => {
  let rating = starValue.toFixed(2)
  if (rating.endsWith('0')) {
    rating = rating.slice(0, rating.length - 1)
  }
  return (
    <div className="uk-flex uk-flex-row uk-flex-top uk-width-1-1 uk-padding-small uk-padding-remove-horizontal">
      <img
        className="uk-border-circle user-avatar-tiny"
        src={imgSrc || `${process.env.PUBLIC_URL}/images/user.svg`}
        alt="Avatar"
      />
      <div className="uk-flex uk-flex-column uk-width-1-1 uk-margin-small-left">
        <div className="uk-flex uk-flex-row">
          <div className="uk-flex-1 uk-flex-column">
            <h5 className="uk-text-bold">{reviewer}</h5>
            <div className="uk-flex uk-flex-middle">
              <StarRatingComponent name="ratings" value={starValue} starCount={starCount} />
              <label>({rating})</label>
            </div>
          </div>
          <div className="uk-flex-1 uk-text-right">
            <label className="uk-text-small color-secondary">
              <p className="uk-text-success">✓ Kimitzu Verified</p>
              {timeStamp ? <p className="uk-text-muted">{moment(timeStamp).fromNow()}</p> : null}
            </label>
          </div>
        </div>
        <p>{decodeHtml(review)}</p>
      </div>
    </div>
  )
}

export default UserReviewSegment
