import React from 'react'
import { Listing } from '../../interfaces/Listing'
import ListingCard from '../Card/ListingCard'

import './ListingCardGroup.css'

interface ListingCardGroupProps {
  data: Listing[]
}

const ListingCardGroup = ({ data }: ListingCardGroupProps) => (
  <div>
    <div className="uk-text-center uk-grid-medium uk-grid-match" uk-grid="masonry: true">
      {data.map((listing: Listing) => (
        <div className="listing-wrapper" key={listing.hash}>
          <ListingCard listing={listing} />
        </div>
      ))}
    </div>
  </div>
)

export default ListingCardGroup
