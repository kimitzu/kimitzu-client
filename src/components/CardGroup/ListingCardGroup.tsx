import React, { useEffect, useState } from 'react'

import ListingCard from '../Card/ListingCard'
import { DottedSpinner } from '../Spinner'

import Listing from '../../models/Listing'
import { useInfiniteScroll } from '../../utils/react-hooks'
import './ListingCardGroup.css'

interface ListingCardGroupProps {
  data: Listing[]
  targetCurrency?: string
}

const LISTING_LIMIT = 8

const ListingCardGroup = ({ data }: ListingCardGroupProps) => {
  const [listings, setListings] = useState<Listing[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const loadMoreListings = () => {
    if (listings.length >= data.length) {
      setIsFetching(false)
      return
    }
    const additionalListings = data.slice(
      currentPage * LISTING_LIMIT,
      (currentPage + 1) * LISTING_LIMIT
    )
    setListings([...listings, ...additionalListings])
    setCurrentPage(currentPage + 1)
    setIsFetching(false)
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(loadMoreListings)
  useEffect(() => {
    const updatedListings = data.slice(
      (currentPage - 1) * LISTING_LIMIT,
      currentPage * LISTING_LIMIT
    )
    setListings(updatedListings)
  }, [data])
  return (
    <div>
      <div
        className="uk-grid-small uk-child-width-1-3@s uk-child-width-1-4@m listing-container"
        data-uk-grid
      >
        {listings.map((listing: Listing) => (
          <div key={listing.hash}>
            <ListingCard listing={listing} targetCurrency={targetCurrency} />
          </div>
        ))}
      </div>
      {isFetching ? <DottedSpinner /> : null}
    </div>
  )
}

export default ListingCardGroup
