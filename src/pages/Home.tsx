import React, { Component } from 'react'

import ListingCardGroup from '../components/CardGroup/ListingCardGroup'
import NavBar from '../components/NavBar/NavBar'
import { FormSelector } from '../components/Selector'
import SidebarFilter from '../components/Sidebar/Filter'
import SortOptions from '../constants/SortOptions.json'
import Search from '../models/Search'
import ImageUploaderInstance from '../utils/ImageUploaderInstance'
import NestedJsonUpdater from '../utils/NestedJSONUpdater'

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
  search: Search
}

class Home extends Component<HomeProps, HomeState> {
  constructor(props: any) {
    super(props)
    const search = new Search()

    this.state = {
      search,
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
    this.handlePaginate = this.handlePaginate.bind(this)
    this.handleFilterReset = this.handleFilterReset.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSettings = this.handleSettings.bind(this)
    this.handleSettings = this.handleSettings.bind(this)
  }

  public async componentDidMount() {
    await this.handleSearchSubmit()
  }

  public renderPages(): JSX.Element[] {
    const pages: JSX.Element[] = []
    let startIndex = 0
    let paginationLimit = 9

    if (this.state.search.paginate.currentPage < 5) {
      startIndex = 0
      paginationLimit = 9
    } else {
      startIndex = this.state.search.paginate.currentPage - 4
      paginationLimit = this.state.search.paginate.currentPage + 5
    }

    if (paginationLimit > this.state.search.paginate.totalPages) {
      paginationLimit = this.state.search.paginate.totalPages
    }

    for (let index = startIndex; index < paginationLimit; index++) {
      let isActive = false

      if (this.state.search.paginate.currentPage === index) {
        isActive = true
      }

      pages.push(
        <li key={index}>
          <a
            href="#"
            className={isActive ? 'uk-badge' : ''}
            onClick={async () => await this.handlePaginate(index)}
          >
            {index + 1}
          </a>
        </li>
      )
    }

    return pages
  }

  public render() {
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
                locationRadius={this.state.search.locationRadius}
                onChange={this.handleChange}
                onFilterChange={this.handleFilterChange}
                onFilterSubmit={this.handleSearchSubmit}
                plusCode={this.state.search.plusCode}
                onFilterReset={this.handleFilterReset}
              />
            </div>
            {this.state.search.results.count > 0 ? (
              <div className="custom-width-two">
                <div className="pagination-cont">
                  <div className="left-side-container">
                    {this.state.search.results.count > 25 ? (
                      <ul className="uk-pagination">
                        <li>
                          <a
                            href="#"
                            onClick={() =>
                              this.handlePaginate(this.state.search.paginate.currentPage - 1)
                            }
                          >
                            <span uk-icon="icon: chevron-left" />
                          </a>
                        </li>
                        {this.renderPages()}
                        <li>
                          <a
                            href="#"
                            onClick={() =>
                              this.handlePaginate(this.state.search.paginate.currentPage + 1)
                            }
                          >
                            <span uk-icon="icon: chevron-right" />
                          </a>
                        </li>
                      </ul>
                    ) : null}
                    <div className="uk-expand uk-margin-left margin-custom">
                      <FormSelector
                        options={SortOptions}
                        defaultVal={this.state.search.sort}
                        onChange={event => this.handleSortChange(event.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <ListingCardGroup data={this.state.search.results.data} />
                  </div>
                </div>
              </div>
            ) : this.state.search.isSearching ? (
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

  private async handleSearchSubmit() {
    const search = await this.state.search.execute()
    this.setState({
      search,
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
    const search = await this.state.search.executePaginate(index)
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
    })
  }

  private async handleSortChange(sortParams: string) {
    const search = await this.state.search.executeSort(sortParams)
    this.setState({
      search,
    })
  }

  private handleSettings() {
    window.location.href = '/settings/profile'
  }
}

export default Home
