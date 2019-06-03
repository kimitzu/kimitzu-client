import React from 'react'
import { Listing } from '../../models/Listing'
import ListingCard from '../Card/ListingCard'

import './ListingCardGroup.css'

interface ListingCardGroupProps {
  data: Listing[]
}

const ListingCardGroup = ({ data }: ListingCardGroupProps) => (
  <div className="uk-text-center uk-grid-medium uk-grid-match" uk-grid="masonry: true">
    {data.map((listing: Listing, index) => (
      <div className="listing-wrapper" key={index}>
        <ListingCard listing={listing} />
      </div>
    ))}
  </div>
)

export default ListingCardGroup
