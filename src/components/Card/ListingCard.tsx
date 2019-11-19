import React from 'react'
import { Link } from 'react-router-dom'
import config from '../../config'
import { ListingResponse } from '../../models/Listing'

import currency from '../../models/Currency'
import decodeHtml from '../../utils/Unescape'
import './ListingCard.css'

interface ListingProps {
  listing: ListingResponse
  targetCurrency?: string
}

const Stars = props => {
  const s = [] as React.ReactNodeArray
  for (let i = 0; i < 5; i++) {
    if (i < props.level) {
      s.push(
        <span key={`star-${i}`} className="star-active">
          ★
        </span>
      )
    } else {
      s.push(
        <span key={`star-${i}`} className="star">
          ☆
        </span>
      )
    }
  }

  return <div className="stars-array">{s}</div>
}

const ListingCard = ({ listing: listingResponse, targetCurrency }: ListingProps) => (
  <div className="listing-container" id={listingResponse.listing.hash}>
    <Link to={`/listing/${listingResponse.listing.hash}`}>
      <img
        className="listing-header"
        src={
          listingResponse.listing.thumbnail.medium
            ? `${config.djaliHost}/djali/media?id=${listingResponse.listing.thumbnail.medium ||
                listingResponse.listing.thumbnail.small}`
            : `${config.host}/images/picture.png`
        }
        onError={(ev: React.SyntheticEvent<HTMLImageElement, Event>) => {
          const image = ev.target as HTMLImageElement
          image.onerror = null
          image.src = `${config.host}/images/picture.png`
        }}
      />
      <div className="seller-info">
        <img
          className="avatar"
          src={
            listingResponse.vendor.avatarHashes.medium
              ? `${config.djaliHost}/djali/media?id=${listingResponse.vendor.avatarHashes.medium ||
                  listingResponse.vendor.avatarHashes.small}`
              : `${config.host}/images/user.png`
          }
          onError={(ev: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const image = ev.target as HTMLImageElement
            image.onerror = null
            image.src = `${config.host}/images/user.png`
          }}
          alt="Image"
        />
        <span className="name margin-top-small">{listingResponse.vendor.name}</span>
      </div>
      <div className="listing-info">
        <div className="title">{decodeHtml(listingResponse.listing.item.title)}</div>
        <div className="bottom-row">
          <Stars level={listingResponse.listing.averageRating} />
          <div className="price-container">
            <div className="value">
              <span className="currency">{targetCurrency}</span>
              <span className="ammount">
                {currency
                  .convert(
                    Number(listingResponse.listing.displayValue),
                    listingResponse.listing.metadata.pricingCurrency,
                    targetCurrency!
                  )
                  .toFixed(2)}
              </span>
            </div>
            <span className="price-type">{listingResponse.listing.metadata.serviceRateMethod}</span>
          </div>
        </div>
      </div>
    </Link>
  </div>
)

export default ListingCard
