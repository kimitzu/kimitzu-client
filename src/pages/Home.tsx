import axios from 'axios'
import React, { Component } from 'react'

import ListingCardGroup from '../components/CardGroup/ListingCardGroup'
import { InlineMultiDropdowns } from '../components/Dropdown'
import { Pagination } from '../components/Pagination'
import { FormSelector } from '../components/Selector'
import SidebarFilter from '../components/Sidebar/Filter'
import ServiceCategories from '../constants/ServiceCategories.json'
import SortOptions from '../constants/SortOptions.json'
import Profile from '../models/Profile'
import { Search, searchInstance } from '../models/Search'
import ImageUploaderInstance from '../utils/ImageUploaderInstance'
import NestedJsonUpdater from '../utils/NestedJSONUpdater'

import './Home.css'

interface HomeProps {
  props: any
}

interface HomeState {
  [x: string]: any
  search: Search
  rating: number
  profile: Profile
}

class Home extends Component<HomeProps, HomeState> {
  constructor(props: any) {
    super(props)
    const profile = new Profile()

    this.state = {
      search: searchInstance,
      rating: 0,
      profile,
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
    this.handlePaginate = this.handlePaginate.bind(this)
    this.handleFilterReset = this.handleFilterReset.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.ratingChanged = this.ratingChanged.bind(this)
  }

  public async componentDidMount() {
    this.state.search.reset()
    await this.handleSearchSubmit()
    const profile = await Profile.retrieve()
    this.setState({ profile })

    const searchEvent = (event: CustomEvent) => {
      window.location.hash = '/'
      this.handleChange('query', event.detail, 'search')
      this.handleSearchSubmit()
    }
    window.addEventListener('srchEvent', searchEvent as EventListener)
  }

  public render() {
    const { profile, rating, search } = this.state
    return (
      <div>
        <div className="main-container">
          <div className="child-main-container">
            <div className="custom-width">
              <InlineMultiDropdowns
                title="Browse Classifications"
                handleItemSelect={this.handleDropdownSelect}
                items={ServiceCategories}
              />
              <SidebarFilter
                key={this.state.search.searchID}
                profile={profile}
                locationRadius={search.locationRadius}
                onChange={this.handleChange}
                onFilterChange={this.handleFilterChange}
                onFilterSubmit={this.handleSearchSubmit}
                onRatingChanged={this.ratingChanged}
                plusCode={search.plusCode}
                onFilterReset={this.handleFilterReset}
                rating={rating}
                searchInstance={this.state.search}
              />
            </div>
            {search.results.data && search.results.count > 0 ? (
              <div className="custom-width-two">
                <div className="pagination-cont">
                  <div className="left-side-container">
                    <Pagination
                      totalRecord={search.results.count}
                      recordsPerPage={search.paginate.limit}
                      handlePageChange={this.handlePaginate}
                      selectedPage={search.paginate.currentPage + 1}
                    />
                    <div className="uk-expand uk-margin-left margin-custom">
                      <FormSelector
                        options={SortOptions}
                        defaultVal={search.sortIndicator}
                        onChange={event => this.handleSortChange(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="uk-flex-1">
                    <ListingCardGroup
                      key={search.paginate.currentPage}
                      data={search.results.data}
                      targetCurrency={profile.preferences.fiat}
                      listingLimit={search.paginate.limit}
                    />
                  </div>
                  <div className="uk-flex uk-flex-center uk-flex-middle uk-margin">
                    <Pagination
                      totalRecord={search.results.count}
                      recordsPerPage={search.paginate.limit}
                      handlePageChange={this.handlePaginate}
                      selectedPage={search.paginate.currentPage + 1}
                    />
                  </div>
                </div>
              </div>
            ) : search.isSearching ? (
              <div className="uk-align-center">
                <div data-uk-spinner="ratio: 3" />
              </div>
            ) : !search.results.data ? (
              <div
                className="uk-align-center full-vh uk-flex uk-flex-column uk-flex-center uk-flex-middle"
                id="empty-results"
              >
                <h1>Crawling...</h1>
                <p>Great! It seems like you just installed Djali.</p>

                <p className="uk-margin-top">
                  Please come back later as Djali crawls the listings on the network.
                </p>
              </div>
            ) : (
              <div
                className="uk-align-center full-vh uk-flex uk-flex-column uk-flex-center uk-flex-middle"
                id="empty-results"
              >
                <h1>No Results</h1>
                <p>Your search did not match any listings.</p>

                <div className="uk-align-center uk-margin-top">
                  <p className="color-secondary">Suggestions:</p>

                  <ul className="uk-margin-left">
                    <li>Try a different search keyword or filter.</li>
                    <li>Make sure that all words are spelled correctly.</li>
                    <li>Try more general keywords.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  private async handleSearchSubmit() {
    const { search } = this.state
    if (!search.query.includes(' ') && search.query.length === 46) {
      window.location.hash = `/profile/${search.query}`
      return
    }

    search.isSearching = true
    this.setState({
      search,
    })

    const newSearch = await search.execute()
    search.isSearching = false
    this.setState({
      search: newSearch,
    })
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

  private ratingChanged(nextValue: number, prevValue: number, name: string) {
    let rating = 0

    if (nextValue === prevValue) {
      rating = 0
    } else {
      rating = nextValue
    }

    this.setState({ rating })

    switch (rating) {
      case 0:
        const { filters, modifiers } = this.state.search
        delete filters.averageRating
        delete modifiers.averageRating
        this.setState({
          search: this.state.search,
        })
        break
      case 1:
        this.handleFilterChange('averageRating', '1', '>=')
        break
      case 2:
        this.handleFilterChange('averageRating', '2', '>=')
        break
      case 3:
        this.handleFilterChange('averageRating', '3', '>=')
        break
      case 4:
        this.handleFilterChange('averageRating', '4', '>=')
        break
      case 5:
        this.handleFilterChange('averageRating', '5', '>=')
        break
    }
  }

  private handleFilterChange(field: string, value: string, modifier?: string) {
    const { filters, modifiers } = this.state.search
    filters[field] = value
    modifiers[field] = modifier ? modifier : '=='

    if (!filters[field]) {
      delete filters[field]
      delete modifiers[field]
    }

    this.setState({
      search: this.state.search,
    })
  }

  private async handlePaginate(index: number) {
    window.scrollTo(0, 0)
    const search = await this.state.search.executePaginate(index - 1)
    if (search) {
      this.setState({
        search,
      })
    }
  }

  private async handleFilterReset() {
    this.state.search.reset()
    const search = await this.state.search.execute()
    this.setState({
      search,
      rating: 0,
    })
  }

  private async handleSortChange(sortParams: string) {
    const search = await this.state.search.executeSort(sortParams)
    this.setState({
      search,
    })
  }

  private async handleDropdownSelect(itemValue, itemId) {
    // TODO: Update filter and use item id
    this.handleFilterChange('item.categories', itemValue)
    await this.handleSearchSubmit()
  }
}

export default Home
