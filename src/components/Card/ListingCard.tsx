import React from 'react'
import { Listing } from '../../models/listing'
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
    <div className="uk-card-media-top">
      <img src={`http://localhost:8109/djali/media?id=${listing.thumbnail.tiny}`} alt="" />
    </div>
    <div className="uk-card-body">
      <div className="listing-title">{listing.title}</div>
      <p>
        {listing.price.amount} {listing.price.currencyCode}
      </p>
      <div>
        {generateStars(listing.averageRating)} ({listing.averageRating})
      </div>
    </div>
  </div>
)

export default ListingCard
