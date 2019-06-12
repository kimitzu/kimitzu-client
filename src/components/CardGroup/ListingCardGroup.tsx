import React from 'react'
import { DjaliListing } from '../../models/Listing'
import ListingCard from '../Card/ListingCard'

import './ListingCardGroup.css'

interface ListingCardGroupProps {
  data: DjaliListing[]
}

const ListingCardGroup = ({ data }: ListingCardGroupProps) => (
  <div>
    <div className="uk-text-center uk-grid-medium uk-grid-match" uk-grid="masonry: true">
      {data.map((listing: DjaliListing, index) => (
        <div className="listing-wrapper" key={listing.hash}>
          <ListingCard listing={listing} />
        </div>
      ))}
    </div>
  </div>
)

export default ListingCardGroup
