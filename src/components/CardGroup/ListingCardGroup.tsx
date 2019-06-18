import React from 'react'
import { Listing } from '../../interfaces/Listing'
import ListingCard from '../Card/ListingCard'

import './ListingCardGroup.css'

interface ListingCardGroupProps {
  data: Listing[]
}

const ListingCardGroup = ({ data }: ListingCardGroupProps) => (
  <div>
    <div
      className="uk-grid-small uk-child-width-1-3@s uk-child-width-1-4@m listing-container"
      data-uk-grid
    >
      {data.map((listing: Listing) => (
        <div key={listing.hash}>
          <ListingCard listing={listing} />
        </div>
      ))}
    </div>
  </div>
)

export default ListingCardGroup
