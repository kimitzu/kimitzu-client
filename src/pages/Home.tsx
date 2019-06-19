import axios from 'axios'
import React, { Component } from 'react'

import { Listing } from '../interfaces/Listing'

import ListingCardGroup from '../components/CardGroup/ListingCardGroup'
import NavBar from '../components/NavBar/NavBar'
import SidebarFilter from '../components/Sidebar/Filter'
import config from '../config'
import SortOptions from '../constants/SortOptions.json'
import ImageUploaderInstance from '../utils/ImageUploaderInstance'
import PlusCode from '../utils/Location/PlusCode'
import NestedJsonUpdater from '../utils/NestedJSONUpdater'

import { FormSelector } from '../components/Selector'
import './Home.css'

interface HomeProps {
  props: any
}

interface Transform {
  operation: string
  spec: Spec
}

interface Spec {
  hash: string
  thumbnail: string
  'item.title': string
  'item.price': string
  'metadata.pricingCurrency': string
  averageRating: string
}

interface HomeState {
  [x: string]: any
  filters: { [x: string]: any }
  locationRadius: number
  modifiers: { [x: string]: any }
  sort: string
  isSearching: boolean
  plusCode: string
  searchQuery: string
  searchResults: {
    data: Listing[]
    count: number
    limit: number
    nextStart: number
  }
  paginate: {
    limit: number
    start: number
    totalPages: number
    currentPage: number
  }
  transforms: Transform[]
}

class Home extends Component<HomeProps, HomeState> {
  constructor(props: any) {
    super(props)
    this.state = {
      filters: {
        'metadata.contractType': 'SERVICE',
      },
      locationRadius: -1,
      modifiers: {
        'metadata.contractType': '==',
      },
      plusCode: '',
      searchQuery: '',
      sort: 'x.item.title <= y.item.title',
      isSearching: false,
      searchResults: {
        data: [],
        count: 0,
        limit: 0,
        nextStart: 0,
      },
      paginate: {
        limit: 25,
        start: 0,
        totalPages: 0,
        currentPage: 0,
      },
      transforms: [
        {
          operation: 'shift',
          spec: {
            hash: 'hash',
            thumbnail: 'thumbnail',
            'item.title': 'item.title',
            'item.price': 'item.price',
            'metadata.pricingCurrency': 'metadata.pricingCurrency',
            averageRating: 'averageRating',
          },
        },
      ],
    }
    this.executeSearchRequest = this.executeSearchRequest.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleSettings = this.handleSettings.bind(this)
    this.handleSettings = this.handleSettings.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
    this.handlePaginate = this.handlePaginate.bind(this)
    this.handleNewSearch = this.handleNewSearch.bind(this)
    this.handleFilterReset = this.handleFilterReset.bind(this)
  }

  public async componentDidMount() {
    await this.handleSearchSubmit(true)
  }

  public render() {
    const { locationRadius, plusCode, searchResults, paginate, isSearching } = this.state

    // TODO: move to a separate function if possible
    const pages = []
    let startIndex = 0
    let paginationLimit = 9

    if (paginate.currentPage < 5) {
      startIndex = 0
      paginationLimit = 9
    } else {
      startIndex = paginate.currentPage - 4
      paginationLimit = paginate.currentPage + 5
    }

    if (paginationLimit > paginate.totalPages) {
      paginationLimit = paginate.totalPages
    }

    for (let index = startIndex; index < paginationLimit; index++) {
      let isActive = false

      if (paginate.currentPage === index) {
        isActive = true
      }

      pages.push(
        <li key={index}>
          <a
            href="#"
            className={isActive ? 'uk-badge' : ''}
            onClick={() => this.handlePaginate(index)}
          >
            {index + 1}
          </a>
        </li>
      )
    }

    return (
      <div>
        <NavBar
          handleSettings={this.handleSettings}
          onQueryChange={this.handleChange}
          onSearchSubmit={this.handleSearchSubmit}
          isSearchBarShow
        />
        <div className="main-container">
          <div className="child-main-container">
            <div className="custom-width">
              <SidebarFilter
                locationRadius={locationRadius}
                onChange={this.handleChange}
                onFilterChange={this.handleFilterChange}
                onFilterSubmit={this.handleFilterSubmit}
                plusCode={plusCode}
                onFilterReset={this.handleFilterReset}
              />
            </div>
            {searchResults.data.length > 0 ? (
              <div className="custom-width-two">
                <div className="pagination-cont">
                  <div className="left-side-container">
                    <ul className="uk-pagination">
                      <li>
                        <a href="#" onClick={() => this.handlePaginate(paginate.currentPage - 1)}>
                          <span uk-icon="icon: chevron-left" />
                        </a>
                      </li>
                      {pages.map(p => p)}
                      <li>
                        <a href="#" onClick={() => this.handlePaginate(paginate.currentPage + 1)}>
                          <span uk-icon="icon: chevron-right" />
                        </a>
                      </li>
                    </ul>
                    <div className="uk-expand uk-margin-left margin-custom">
                      <FormSelector
                        options={SortOptions}
                        defaultVal={this.state.sort}
                        onChange={event => this.handleSortChange(event.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <ListingCardGroup data={searchResults.data} />
                  </div>
                </div>
              </div>
            ) : isSearching ? (
              <div className="uk-align-center">
                <div data-uk-spinner="ratio: 3" />
              </div>
            ) : (
              <div className="uk-align-center">
                <h2>No Results ¯\_(ツ)_/¯</h2>
                <p>Try a different search keyword or filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  private handlePaginate(direction: number) {
    const { paginate, searchResults } = this.state

    if (direction === -1 && paginate.start <= 0) {
      return
    }

    paginate.start = direction * paginate.limit

    if (paginate.start >= searchResults.count) {
      return
    }

    paginate.currentPage = direction

    this.setState(
      {
        paginate,
      },
      async () => {
        await this.handleSearchSubmit(false)
      }
    )
  }

  private handleSortChange(target: string) {
    const data = target.split('_')
    const field = data[0]
    const condition = data[1]
    const sort = `x.${field} ${condition} y.${field}`
    this.setState(
      {
        sort,
      },
      async () => {
        await this.handleSearchSubmit(false)
      }
    )
  }

  private handleSettings() {
    window.location.href = '/settings/profile'
  }

  private async handleChange(field: string, value: any, parentField?: string): Promise<any> {
    if (field === 'avatar') {
      const base64ImageStr = await ImageUploaderInstance.convertToBase64(value[0])
      value = base64ImageStr
    }

    if (parentField) {
      const subFieldData = this.state[parentField]
      NestedJsonUpdater(subFieldData, field, value)
      this.setState({ subFieldData })
    } else {
      this.setState({
        [field]: value,
      })
    }
  }

  private async handleSearchSubmit(isNewSearch: boolean): Promise<void> {
    const { filters, searchQuery } = this.state

    if (isNewSearch) {
      await this.handleNewSearch()
    }

    this.setState({
      isSearching: true,
    })

    if (Object.keys(filters).length > 0) {
      await this.handleFilterSubmit()
    } else {
      await this.executeSearchRequest(searchQuery)
    }

    this.setState({
      isSearching: false,
    })
  }

  private async handleFilterReset() {
    const filters = {
      'metadata.contractType': 'SERVICE',
    }
    const modifiers = {
      'metadata.contractType': '==',
    }
    const locationRadius = -1
    const plusCode = ''

    this.setState({
      filters,
      locationRadius,
      modifiers,
      plusCode,
    })
  }

  private async handleNewSearch() {
    const searchResults = {
      data: [],
      count: 0,
      limit: 0,
      nextStart: 0,
    }
    const paginate = {
      limit: 25,
      start: 0,
      totalPages: 0,
      currentPage: 0,
    }

    return new Promise(resolve => {
      this.setState(
        {
          searchResults,
          paginate,
        },
        () => {
          resolve(this.state)
        }
      )
    })
  }

  private async executeSearchRequest(searchQuery: string, newSearch?: boolean): Promise<void> {
    const { paginate } = this.state

    if (newSearch) {
      this.handleNewSearch()
    }

    const searchObject = {
      query: searchQuery,
      limit: paginate.limit,
      start: paginate.start,
      sort: this.state.sort,
      transforms: this.state.transforms,
    }

    const result = await axios.post(`${config.djaliHost}/djali/search`, searchObject)
    paginate.totalPages = Math.ceil(result.data.count / paginate.limit)

    this.setState({
      searchResults: result.data,
      paginate,
    })
  }

  private handleFilterChange(field: string, value: string, modifier?: string) {
    const { filters, modifiers } = this.state
    filters[field] = value
    modifiers[field] = modifier ? modifier : '=='

    if (!filters[field]) {
      delete filters[field]
      delete modifiers[field]
    }

    this.setState({
      filters,
      modifiers,
    })
  }

  private async handleFilterSubmit(event?: React.FormEvent<HTMLElement>): Promise<void> {
    if (event) {
      event.preventDefault()
    }
    const { filters, modifiers, plusCode, locationRadius, searchQuery, paginate } = this.state

    const keys = Object.keys(filters)
    const values = Object.values(filters)
    let extendedFilters = keys.map((key, index) => {
      if (values[index] === '') {
        return
      }
      return 'doc.' + key + ' ' + modifiers[key] + ' "' + values[index] + '"'
    })

    if (locationRadius > -1 && filters['location.zipCode']) {
      extendedFilters = extendedFilters.map(filter => {
        if (filter && filter.includes(filters['location.zipCode'])) {
          return `zipWithin("${filters['location.zipCode']}", "${
            filters['location.country']
          }", doc.location.zipCode, doc.location.country, ${locationRadius})`
        } else {
          return filter
        }
      })
    }

    if (plusCode) {
      const locationRadiusFilter = locationRadius > -1 ? locationRadius : 0
      const { latitudeCenter, longitudeCenter } = PlusCode.decode(plusCode)
      extendedFilters[0] = `coordsWithin(${latitudeCenter}, ${longitudeCenter}, doc.location.zipCode, doc.location.country, ${locationRadiusFilter})`
    }

    const searchObject = {
      filters: extendedFilters,
      query: searchQuery,
      limit: paginate.limit,
      start: paginate.start,
      sort: this.state.sort,
      transforms: this.state.transforms,
    }

    const result = await axios.post(`${config.djaliHost}/djali/search`, searchObject)
    paginate.totalPages = Math.ceil(result.data.count / paginate.limit)

    this.setState({
      searchResults: result.data,
      paginate,
    })
  }
}

export default Home
