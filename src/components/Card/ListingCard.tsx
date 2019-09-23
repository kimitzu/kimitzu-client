import React from 'react'
import { Link } from 'react-router-dom'
import config from '../../config'
import Listing from '../../models/Listing'

import currency from '../../models/Currency'
import './ListingCard.css'

interface ListingProps {
  listing: Listing
  targetCurrency?: string
}

const generateStars = (averageRating: number) => {
  const stars: JSX.Element[] = []
  for (let index = 0; index < averageRating; index++) {
    stars.push(<span key={index} uk-icon="icon: star; ratio: 0.5" />)
  }
  return stars
}

const ListingCard = ({ listing, targetCurrency }: ListingProps) => (
  <div className="uk-card uk-card-hover listing" id={listing.hash}>
    <Link to={`/listing/${listing.hash}`}>
      <div>
        <img
          className="img-list"
          src={
            listing.thumbnail.medium
              ? `${config.djaliHost}/djali/media?id=${listing.thumbnail.medium ||
                  listing.thumbnail.small}`
              : `${config.host}/images/picture.png`
          }
          onError={(ev: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const image = ev.target as HTMLImageElement
            image.onerror = null
            image.src = `${config.host}/images/picture.png`
          }}
          alt="Image"
        />
      </div>
      <div className="listing-small-info">
        <div className="listing-title">{listing.item.title}</div>
        <p className="price">
          {currency.convert(
            Number(listing.displayValue),
            listing.metadata.pricingCurrency,
            targetCurrency!
          )}{' '}
          {targetCurrency}
        </p>
        <div className="rating-text">
          {generateStars(listing.averageRating)} ({listing.averageRating})
        </div>
      </div>
    </Link>
  </div>
)

export default ListingCard
