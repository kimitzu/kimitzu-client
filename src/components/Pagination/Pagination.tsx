import React, { useEffect, useState } from 'react'

import './Pagination.css'

interface Props {
  totalRecord: number
  recordsPerPage: number
  pageNeigboors?: number
  handlePageChange?: (pageNumber: number) => void
  selectedPage?: number
}

const DOTTED = -1

const getRange = (start: number, end: number, step: number = 1) => {
  let i = start
  const range: number[] = []

  while (i <= end) {
    range.push(i)
    i += step
  }
  return range
}

const Pagination = ({
  totalRecord,
  recordsPerPage = 5,
  pageNeigboors = 2,
  handlePageChange,
  selectedPage,
}: Props) => {
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<number[]>([])
  const goToPage = pageNumber => {
    setCurrentPage(pageNumber)
    if (handlePageChange) {
      handlePageChange(pageNumber)
    }
  }
  useEffect(() => {
    const currentTotalPages = Math.ceil(totalRecord / recordsPerPage)
    if (selectedPage) {
      setCurrentPage(selectedPage)
    }
    setTotalPages(currentTotalPages)
    const totalNumbers = pageNeigboors * 2 + 3 // total page numbers to display
    const blockCount = totalNumbers + 2 // total page numbers plus the two '...' in both left and right
    if (currentTotalPages > blockCount) {
      const startPage = Math.max(2, currentPage - pageNeigboors)
      const endPage = Math.min(currentTotalPages - 1, currentPage + pageNeigboors)
      let pages = getRange(startPage, endPage)
      const showLeftDots = startPage > 2
      const showRightDots = currentTotalPages - endPage > 1
      const offset = totalNumbers - (pages.length + 1) // number of hidden pages
      if (showLeftDots && !showRightDots) {
        const extraPages = getRange(startPage - offset, startPage - 1)
        pages = [DOTTED, ...extraPages, ...pages]
      } else if (!showLeftDots && showRightDots) {
        const extraPages = getRange(endPage + 1, endPage + offset)
        pages = [...pages, ...extraPages, DOTTED]
      } else {
        pages = [DOTTED, ...pages, DOTTED]
      }
      setPagination([1, ...pages, currentTotalPages])
      return
    }
    setPagination(getRange(1, currentTotalPages))
  }, [selectedPage, totalRecord])
  return (
    <ul className="uk-pagination" data-uk-margin>
      <li className="uk-flex uk-flex-middle">
        <a
          id={currentPage === 1 ? 'disable-pagination-arrow' : ''}
          data-uk-icon="icon: chevron-left"
          onClick={() => goToPage(currentPage - 1)}
        />
      </li>
      {pagination.map((item, index) => {
        if (item === DOTTED) {
          return (
            <li key={`pagination-disabled-${index}`} className="uk-disabled">
              <span>...</span>
            </li>
          )
        }
        return (
          <li
            id="pagination-item"
            key={`pagination${item}-${index}`}
            className={item === currentPage ? 'uk-active' : 'uk-flex uk-flex-middle'}
          >
            <a onClick={() => goToPage(item)}>{item}</a>
          </li>
        )
      })}
      <li className="uk-flex uk-flex-middle">
        <a
          id={currentPage === totalPages ? 'disable-pagination-arrow' : ''}
          data-uk-icon="icon: chevron-right"
          onClick={() => goToPage(currentPage + 1)}
        />
      </li>
    </ul>
  )
}

export default Pagination
