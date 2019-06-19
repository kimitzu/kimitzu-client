import React from 'react'
import { Link } from 'react-router-dom'
import config from '../../config'
import { Listing } from '../../interfaces/Listing'

import './ListingCard.css'

interface ListingProps {
  listing: Listing
}

const generateStars = (averageRating: number) => {
  const stars: JSX.Element[] = []
  for (let index = 0; index < averageRating; index++) {
    stars.push(<span key={index} uk-icon="icon: star; ratio: 0.5" />)
  }
  return stars
}

const ListingCard = ({ listing }: ListingProps) => (
  <div className="uk-card uk-card-hover listing">
    <Link to={`/listing/${listing.hash}`}>
      <div>
        <img
          className="img-list"
          src={`${config.djaliHost}/djali/media?id=${listing.thumbnail.tiny ||
            listing.thumbnail.small}`}
          alt=""
        />
      </div>
      <div className="listing-small-info">
        <div className="listing-title">{listing.item.title}</div>
        <p className="price">
          {listing.item.price} {listing.metadata.pricingCurrency}
        </p>
        <div className="rating-text">
          {generateStars(listing.averageRating)} ({listing.averageRating})
        </div>
      </div>
    </Link>
  </div>
)

export default ListingCard
