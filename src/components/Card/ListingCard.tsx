import React from 'react'
import { Link } from 'react-router-dom'
import config from '../../config'
import { Listing } from '../../interfaces/Listing'

import './ListingCard.css'

interface ListingProps {
  listing: Listing
}

const generateStars = (averageRating: number) => {
  const stars = []
  for (let index = 0; index < averageRating; index++) {
    stars.push(<span key={index} uk-icon="icon: star; ratio: 0.5" />)
  }
  return stars
}

const ListingCard = ({ listing }: ListingProps) => (
  <div className="uk-card uk-card-default uk-card-hover listing">
    <Link to={`/listing/${listing.hash}`}>
      <div className="uk-card-media-top">
        <img
          className="uk-margin-top"
          src={`${config.djaliHost}/djali/media?id=${listing.thumbnail.tiny ||
            listing.thumbnail.small}`}
          alt=""
        />
      </div>
      <div className="uk-card-body">
        <div className="listing-title">{listing.item.title}</div>
        <p>
          {listing.item.price} {listing.metadata.pricingCurrency}
        </p>
        <div>
          {generateStars(listing.averageRating)} ({listing.averageRating})
        </div>
      </div>
    </Link>
  </div>
)

export default ListingCard
