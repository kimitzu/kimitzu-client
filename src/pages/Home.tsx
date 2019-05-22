import axios from 'axios'
import React, { Component } from 'react'
import PlusCode from '../common/PlusCode'
import ListingCardGroup from '../components/CardGroup/ListingCardGroup'
import { SettingsModal } from '../components/Modal'
import NavBar from '../components/NavBar/NavBar'
import SidebarFilter from '../components/Sidebar/Filter'
import config from '../config/config.json'
import { Listing } from '../models/listing'

import './Home.css'

interface HomeProps {
  props: any
}
interface HomeState {
  [x: string]: any
  filters: { [x: string]: any }
  locationRadius: number
  modifiers: { [x: string]: any }
  plusCode: string
  searchQuery: string
  searchResults: Listing[]
}
interface CodesFrom {
  location: Location
  distance: number
}
export interface Location {
  cou: string
  zip: string
  add: string
  x: string
  y: string
}

class Home extends Component<HomeProps, HomeState> {
  constructor(props: any) {
    super(props)
    this.state = {
      filters: {},
      locationRadius: -1,
      modifiers: {},
      plusCode: '',
      searchQuery: '',
      searchResults: [],
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleSettings = this.handleSettings.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this)
    this.executeSearchRequest = this.executeSearchRequest.bind(this)
  }

  public handleSettings() {
    window.UIkit.modal('#settings').show()
  }

  public render() {
    return (
      <div>
        <SettingsModal />
        <NavBar
          onQueryChange={this.handleChange}
          onSearchSubmit={this.handleSearchSubmit}
          handleSettings={this.handleSettings}
        />
        <div className="uk-flex uk-flex-row uk-flex-left">
          <div className="sidebar">
            <SidebarFilter
              onFilterChange={this.handleFilterChange}
              onFilterSubmit={this.handleFilterSubmit}
              onChange={this.handleChange}
              locationRadius={this.state.locationRadius}
              plusCode={this.state.plusCode}
            />
          </div>
          <div className="content">
            <ListingCardGroup data={this.state.searchResults} />
          </div>
        </div>
      </div>
    )
  }

  private handleChange(fieldName: string, value: string): void {
    this.setState({
      [fieldName]: value,
    })
  }

  private async handleSearchSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (Object.keys(this.state.filters).length > 0) {
      await this.handleFilterSubmit(event)
    } else {
      await this.executeSearchRequest(this.state.searchQuery)
    }
  }

  private async executeSearchRequest(searchQuery: string, extendedQuery?: string): Promise<void> {
    console.log(
      'Sending...',
      `${config.bakedFloodHost}${config.bakedFloodEndpoints.search}?query=${searchQuery}${
        extendedQuery ? extendedQuery : ''
      }`
    )
    const result = await axios.get(
      `${config.bakedFloodHost}${config.bakedFloodEndpoints.search}?query=${searchQuery}${
        extendedQuery ? extendedQuery : ''
      }`
    )
    this.setState({
      searchResults: result.data,
    })
  }

  private handleFilterChange(field: string, value: string, modifier?: string) {
    const filters = this.state.filters
    const modifiers = this.state.modifiers
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

  private async handleFilterSubmit(event: React.FormEvent<HTMLElement>): Promise<void> {
    event.preventDefault()

    const keys = Object.keys(this.state.filters)
    const values = Object.values(this.state.filters)
    const extendedFilters = keys.map((key, index) => {
      if (values[index] === '') {
        return
      }
      return 'doc.' + key + ' ' + this.state.modifiers[key] + ' "' + values[index] + '"'
    })

    if (this.state.locationRadius > -1 && this.state.filters['location.zipCode']) {
      extendedFilters[0] = `zipWithin("${this.state.filters['location.zipCode']}", "${
        this.state.filters['location.country']
      }", doc.location.zipCode, doc.location.country, ${this.state.locationRadius})`
    }

    if (this.state.plusCode) {
      const locationRadius = this.state.locationRadius > -1 ? this.state.locationRadius : 0
      const { latitudeCenter, longitudeCenter } = PlusCode.decode(this.state.plusCode)
      extendedFilters[0] = `coordsWithin(${latitudeCenter}, ${longitudeCenter}, doc.location.zipCode, doc.location.country, ${locationRadius})`
    }

    const searchObject = {
      filters: extendedFilters,
      query: this.state.searchQuery,
    }

    const result = await axios.post('http://localhost:8108/advquery', searchObject)

    this.setState({
      searchResults: result.data,
    })
  }
}

export default Home
