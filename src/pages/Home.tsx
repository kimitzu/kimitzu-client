import axios from 'axios'
import React, { Component } from 'react'

import { Location, UserProfile } from '../common/types'
import { AddressesCardGroup } from '../components/CardGroup'
import { AddressForm, RegistrationForm } from '../components/Form'
import { SettingsModal } from '../components/Modal'
import { Listing } from '../models/listing'

import actions from '../common/constants'
import PlusCode from '../common/PlusCode'
import ListingCardGroup from '../components/CardGroup/ListingCardGroup'
import NavBar from '../components/NavBar/NavBar'
import SidebarFilter from '../components/Sidebar/Filter'
import config from '../config'
import Countries from '../constants/Countries.json'
import CryptoCurrencies from '../constants/CryptoCurrencies.json'
import CurrencyTypes from '../constants/CurrencyTypes.json'
import FiatCurrencies from '../constants/FiatCurrencies.json'
import Languages from '../constants/Languages.json'
import UnitsOfMeasurement from '../constants/UnitsOfMeasurement.json'
import Profile from '../models/Profile'

import './Home.css'

interface HomeProps {
  props: any
}
interface HomeState {
  [x: string]: any
  filters: { [x: string]: any }
  profile: UserProfile
  settingsIndex: number
  currentAction: number
  addressForm: Location
  locationRadius: number
  modifiers: { [x: string]: any }
  plusCode: string
  searchQuery: string
  searchResults: Listing[]
  registrationForm: Profile
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
      currentAction: 0,
      filters: {},
      locationRadius: -1,
      modifiers: {},
      plusCode: '',
      searchQuery: '',
      searchResults: [],
      profile: {
        extendedLocation: {
          addresses: [],
          home: null,
          work: null,
          return: null,
          shipping: null,
          mailing: null,
        },
      },
      addressForm: {
        type: 'primary',
        isDefault: false,
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        latitude: 0,
        longitude: 0,
        plusCode: '',
      },
      settingsIndex: 0,
      registrationForm: {
        handle: '',
        name: '',
        about: '',
        extLocation: {
          primary: 0,
          shipping: 0,
          billing: 0,
          return: 0,
          addresses: [
            {
              latitude: '',
              longitude: '',
              plusCode: '',
              addressOne: '',
              addressTwo: '',
              city: '',
              state: '',
              country: '',
              zipCode: '',
            },
          ],
        },
        preferences: {
          cryptocurrency: '',
          currencyDisplay: '',
          fiat: '',
          language: '',
          measurementUnit: '',
        },
      },
    }
    this.handleSettings = this.handleSettings.bind(this)
    this.updateSettingsIndex = this.updateSettingsIndex.bind(this)
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
    this.refreshForms = this.refreshForms.bind(this)
    this.handleSettingsBackBtn = this.handleSettingsBackBtn.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleSettings = this.handleSettings.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this)
    this.executeSearchRequest = this.executeSearchRequest.bind(this)
  }

  public async componentDidMount() {
    try {
      const profileRequest = await axios.get(`${config.openBazaarHost}/ob/profile`)
      this.setState({
        registrationForm: profileRequest.data,
      })
    } catch (error) {
      if (error.response) {
        if (!error.response.data.success) {
          window.location.href = '/register'
        }
      }
    }
  }

  public handleSettings() {
    window.UIkit.modal('#settings-modal').show()
  }

  public refreshForms() {
    const addressForm = {
      type: 'primary',
      isDefault: false,
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      latitude: 0,
      longitude: 0,
      plusCode: '',
    }
    this.setState({ addressForm })
  }

  public handleSettingsBackBtn() {
    this.setState({ currentAction: actions.settings.NONE })
    this.refreshForms()
  }

  public updateSettingsIndex(e: React.FormEvent, index: number) {
    e.preventDefault()
    this.setState({ settingsIndex: index })
  }

  public handleSettingsAction(currentAction: number) {
    this.setState({ currentAction })
  }

  public handleSelectAddress(addressIndex: number) {
    const { profile } = this.state
    this.setState({
      currentAction: actions.settings.UPDATE_ADDRESS,
      addressForm: profile.extendedLocation.addresses[addressIndex],
    })
  }

  get getCurrentContent() {
    const { profile, currentAction, settingsIndex, addressForm } = this.state
    const { settings } = actions
    const mainContents = [
      {
        component: (
          <RegistrationForm
            key="regform"
            data={this.state.registrationForm}
            availableCountries={Countries}
            fiatCurrencies={FiatCurrencies}
            currencyTypes={CurrencyTypes}
            cryptoCurrencies={CryptoCurrencies}
            languages={Languages}
            unitOfMeasurements={UnitsOfMeasurement}
            onChange={this.handleChange}
            onSubmit={() => {
              console.log('WIP')
            }}
          />
        ),
        title: 'GENERAL',
      },
      {
        component: <div />,
        title: 'SOCIAL MEDIA',
      },
      {
        component: <div />,
        title: 'EDUCATION',
      },
      {
        component: <div />,
        title: 'WORK HISTORY',
      },
      {
        component: (
          <AddressesCardGroup
            key="addresses"
            locations={profile.extendedLocation.addresses}
            handleAddAddressBtn={() => this.handleSettingsAction(settings.ADD_ADDRESS)}
            handleSelectAddress={this.handleSelectAddress}
          />
        ),
        title: 'ADDRESSES',
      },
    ]
    const subContents = {
      [settings.ADD_EDUCATION]: {
        component: <div />,
        title: 'ADD EDUCATION',
      },
      [settings.UPDATE_EDUCATION]: {
        component: <div />,
        title: 'UPDATE EDUCATION',
      },
      [settings.ADD_WORK]: {
        component: <div />,
        title: 'ADD WORK',
      },
      [settings.UPDATE_EDUCATION]: {
        component: <div />,
        title: 'UPDATE WORK',
      },
      [settings.ADD_ADDRESS]: {
        component: (
          <AddressForm key="addressform" data={addressForm} handleSave={this.handleSaveAddress} />
        ),
        title: 'ADD ADDRESS',
      },
      [settings.UPDATE_ADDRESS]: {
        component: (
          <AddressForm key="addressform" data={addressForm} handleSave={this.handleSaveAddress} />
        ),
        title: 'UPDATE ADDRESS',
      },
    }
    return currentAction === settings.NONE
      ? mainContents[settingsIndex]
      : subContents[currentAction]
  }

  public handleSaveAddress() {
    console.log('WIP')
  }

  public render() {
    const { settingsIndex, currentAction } = this.state
    return (
      <div>
        <NavBar
          onQueryChange={this.handleChange}
          onSearchSubmit={this.handleSearchSubmit}
          handleSettings={this.handleSettings}
          isSearchBarShow={false}
        />
        <SettingsModal
          currentLinkIndex={settingsIndex}
          updateSettingsIndex={this.updateSettingsIndex}
          content={this.getCurrentContent}
          handleBackBtn={this.handleSettingsBackBtn}
          currentAction={currentAction}
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

  private handleChange(field: string, value: any): void {
    const { registrationForm } = this.state

    const path = field.split('.')
    let update = registrationForm

    for (let index = 0; index < path.length - 1; index++) {
      const element = path[index]
      update = update[element]
    }

    update[path[path.length - 1]] = value

    this.setState(
      {
        registrationForm,
      },
      () => {
        console.log(this.state.registrationForm)
      }
    )
  }

  private async handleSearchSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (Object.keys(this.state.filters).length > 0) {
      await this.handleFilterSubmit(event)
    } else {
      await this.executeSearchRequest(this.state.searchQuery)
    }
  }

  private async executeSearchRequest(searchQuery: string): Promise<void> {
    const searchObject = {
      query: searchQuery,
      limit: 25,
    }

    const result = await axios.post(`${config.djaliHost}/djali/search`, searchObject)
    console.log(result)
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
      limit: 25,
    }

    const result = await axios.post(`${config.djaliHost}/djali/search`, searchObject)

    this.setState({
      searchResults: result.data,
    })
  }
}

export default Home
