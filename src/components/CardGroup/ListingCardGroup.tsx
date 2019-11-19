import React, { useEffect, useState } from 'react'

import ListingCard from '../Card/ListingCard'
import { DottedSpinner } from '../Spinner'

import { ListingResponse } from '../../models/Listing'
import { useInfiniteScroll } from '../../utils/react-hooks'
import './ListingCardGroup.css'

interface ListingCardGroupProps {
  data: ListingResponse[]
  targetCurrency?: string
  listingLimit?: number
}

const ListingCardGroup = ({ data, targetCurrency, listingLimit = 8 }: ListingCardGroupProps) => {
  const [listings, setListings] = useState<ListingResponse[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const loadMoreListings = () => {
    if (listings.length >= data.length) {
      setIsFetching(false)
      return
    }
    const additionalListings = data.slice(
      currentPage * listingLimit,
      (currentPage + 1) * listingLimit
    )
    setListings([...listings, ...additionalListings])
    setCurrentPage(currentPage + 1)
    setIsFetching(false)
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(loadMoreListings)
  useEffect(() => {
    const updatedListings = data.slice((currentPage - 1) * listingLimit, currentPage * listingLimit)
    setListings(updatedListings)
  }, [data])
  return (
    <div>
      <div className="uk-flex uk-flex-center uk-grid-small" data-uk-grid>
        {listings.map((listing: ListingResponse) => {
          if (listing) {
            return (
              <div key={listing.listing.hash}>
                <ListingCard listing={listing} targetCurrency={targetCurrency} />
              </div>
            )
          }
        })}
      </div>
      {isFetching ? <DottedSpinner /> : null}
    </div>
  )
}

export default ListingCardGroup
