import React from 'react'
import { Listing } from '../../models/Listing'
import ListingCard from '../Card/ListingCard'

import './ListingCardGroup.css'

interface ListingCardGroupProps {
  data: Listing[]
}

const ListingCardGroup = ({ data }: ListingCardGroupProps) => (
  <div>
    {data.length > 0 ? (
      <div className="uk-text-center uk-grid-medium uk-grid-match" uk-grid="masonry: true">
        {data.map((listing: Listing, index) => (
          <div className="listing-wrapper" key={index}>
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    ) : (
      <div>
        <h2>No Results ¯\_(ツ)_/¯</h2>
        <p>Try a different search keyword or filter</p>
      </div>
    )}
  </div>
)

export default ListingCardGroup
