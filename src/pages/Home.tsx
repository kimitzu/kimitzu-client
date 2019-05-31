import axios from 'axios'
import React, { Component } from 'react'

import { AddressesCardGroup } from '../components/CardGroup'
import { AddressForm, RegistrationForm } from '../components/Form'
import { SettingsModal } from '../components/Modal'
import { Listing } from '../models/Listing'

import actions from '../common/constants'
import PlusCode from '../common/PlusCode'
import ListingCardGroup from '../components/CardGroup/ListingCardGroup'
import NavBar from '../components/NavBar/NavBar'
import SidebarFilter from '../components/Sidebar/Filter'
import Config from '../config'
import config from '../config'
import Countries from '../constants/Countries.json'
import CryptoCurrencies from '../constants/CryptoCurrencies.json'
import CurrencyTypes from '../constants/CurrencyTypes.json'
import FiatCurrencies from '../constants/FiatCurrencies.json'
import Languages from '../constants/Languages.json'
import UnitsOfMeasurement from '../constants/UnitsOfMeasurement.json'
import Profile from '../models/Profile'
import nestedJson from '../utils/nested-json'

import './Home.css'

interface HomeProps {
  props: any
}

interface HomeState {
  [x: string]: any
  filters: { [x: string]: any }
  settingsIndex: number
  currentAction: number
  locationRadius: number
  modifiers: { [x: string]: any }
  plusCode: string
  searchQuery: string
  searchResults: Listing[]
  registrationForm: Profile
  addressFormUpdateIndex: number
}

const locationTypes = ['primary', 'shipping', 'billing', 'return']

class Home extends Component<HomeProps, HomeState> {
  constructor(props: any) {
    super(props)
    this.state = {
      addressFormUpdateIndex: -1,
      currentAction: 0,
      filters: {},
      locationRadius: -1,
      modifiers: {},
      plusCode: '',
      searchQuery: '',
      searchResults: [],
      settingsIndex: 0,
      addressForm: {
        type: [''],
        addressOne: '',
        addressTwo: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        latitude: '',
        longitude: '',
        plusCode: '',
      },
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
              type: [''],
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
    this.executeSearchRequest = this.executeSearchRequest.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleSaveAddress = this.handleSaveAddress.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
    this.handleSettings = this.handleSettings.bind(this)
    this.handleSettings = this.handleSettings.bind(this)
    this.handleSettingsBackBtn = this.handleSettingsBackBtn.bind(this)
    this.refreshForms = this.refreshForms.bind(this)
    this.updateSettingsIndex = this.updateSettingsIndex.bind(this)
    this.handleDeleteAddress = this.handleDeleteAddress.bind(this)
  }

  public async componentDidMount() {
    try {
      const profileRequest = await axios.get(`${config.openBazaarHost}/ob/profile`)
      const profileData = this.processAddresses(profileRequest.data)
      this.setState({
        registrationForm: profileData,
      })
    } catch (error) {
      if (error.response) {
        if (!error.response.data.success) {
          window.location.href = '/register'
        }
      }
    }
  }

  get getCurrentContent() {
    const { currentAction, settingsIndex, addressForm, registrationForm } = this.state
    const { settings } = actions
    const mainContents = [
      {
        component: (
          <RegistrationForm
            availableCountries={Countries}
            cryptoCurrencies={CryptoCurrencies}
            currencyTypes={CurrencyTypes}
            data={registrationForm}
            fiatCurrencies={FiatCurrencies}
            key="regform"
            languages={Languages}
            onChange={this.handleChange}
            onSubmit={this.handleFormSubmit}
            unitOfMeasurements={UnitsOfMeasurement}
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
            handleAddAddressBtn={() => this.handleSettingsAction(settings.ADD_ADDRESS)}
            handleSelectAddress={this.handleSelectAddress}
            key="addresses"
            locations={registrationForm.extLocation.addresses}
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
          <AddressForm
            data={addressForm}
            key="addressform"
            onAddressChange={this.handleAddressChange}
            onSaveAddress={this.handleSaveAddress}
            isEdit={false}
          />
        ),
        title: 'ADD ADDRESS',
      },
      [settings.UPDATE_ADDRESS]: {
        component: (
          <AddressForm
            data={addressForm}
            key="addressform"
            onAddressChange={this.handleAddressChange}
            onSaveAddress={this.handleSaveAddress}
            isEdit
            onDeleteAddress={this.handleDeleteAddress}
            updateIndex={this.state.addressFormUpdateIndex}
          />
        ),
        title: 'UPDATE ADDRESS',
      },
    }
    return currentAction === settings.NONE
      ? mainContents[settingsIndex]
      : subContents[currentAction]
  }

  public handleAddressChange(field: string, value: string | string[]) {
    const { addressForm } = this.state
    nestedJson(addressForm, field, value)
    this.setState({
      addressForm,
    })
  }

  public render() {
    const { settingsIndex, currentAction, locationRadius, plusCode, searchResults } = this.state
    return (
      <div>
        <NavBar
          handleSettings={this.handleSettings}
          onQueryChange={this.handleChange}
          onSearchSubmit={this.handleSearchSubmit}
          isSearchBarShow={false}
        />
        <SettingsModal
          content={this.getCurrentContent}
          currentAction={currentAction}
          currentLinkIndex={settingsIndex}
          handleBackBtn={this.handleSettingsBackBtn}
          updateSettingsIndex={this.updateSettingsIndex}
        />
        <div className="uk-flex uk-flex-row uk-flex-left">
          <div className="sidebar">
            <SidebarFilter
              locationRadius={locationRadius}
              onChange={this.handleChange}
              onFilterChange={this.handleFilterChange}
              onFilterSubmit={this.handleFilterSubmit}
              plusCode={plusCode}
            />
          </div>
          <div className="content">
            <ListingCardGroup data={searchResults} />
          </div>
        </div>
      </div>
    )
  }

  private async handleDeleteAddress(index: number) {
    const { registrationForm } = this.state
    const { extLocation } = registrationForm

    const address = extLocation.addresses[index]

    address.type.forEach(t => {
      extLocation[t] = -1
    })

    extLocation.addresses.splice(index, 1)

    locationTypes.forEach(type => {
      const tempIndex = extLocation[type]
      if (tempIndex > index) {
        extLocation[type] = extLocation[type] - 1
      }
    })

    this.setState({
      registrationForm,
    })
    await axios.put(`${Config.openBazaarHost}/ob/profile`, this.state.registrationForm)
    alert('Profile updated')
    const profileData = this.processAddresses(registrationForm)
    this.setState({
      registrationForm: profileData,
    })
    this.handleSettingsBackBtn()
  }

  private processAddresses(profile: Profile): Profile {
    const { extLocation } = profile

    extLocation.addresses.forEach(a => {
      a.type = []
    })

    locationTypes.forEach(type => {
      const index = extLocation[type] as number
      if (index === -1) {
        return
      }
      profile.extLocation.addresses[index].type.push(type)
    })

    console.log(profile)

    return profile
  }

  private handleSettings() {
    window.UIkit.modal('#settings-modal').show()
  }

  private refreshForms() {
    const addressForm = {
      type: [''],
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      latitude: '',
      longitude: '',
      plusCode: '',
    }
    this.setState({ addressForm, addressFormUpdateIndex: -1 })
  }

  private handleSettingsBackBtn() {
    this.setState({ currentAction: actions.settings.NONE })
    this.refreshForms()
  }

  private updateSettingsIndex(e: React.FormEvent, index: number) {
    e.preventDefault()
    this.setState({ settingsIndex: index })
  }

  private handleSettingsAction(currentAction: number) {
    this.setState({ currentAction })
  }

  private handleSelectAddress(addressIndex: number) {
    const { profile, registrationForm } = this.state
    this.setState({
      currentAction: actions.settings.UPDATE_ADDRESS,
      addressForm: registrationForm.extLocation.addresses[addressIndex],
      addressFormUpdateIndex: addressIndex,
    })
  }

  private async handleSaveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { registrationForm, addressForm, addressFormUpdateIndex } = this.state
    const { extLocation } = registrationForm

    const {
      type,
      addressOne,
      addressTwo,
      city,
      state,
      zipCode,
      country,
      latitude,
      longitude,
      plusCode,
    } = addressForm

    const address = {
      type,
      addressOne,
      addressTwo,
      city,
      state,
      zipCode,
      country,
      latitude,
      longitude,
      plusCode,
    }

    if (addressFormUpdateIndex === -1) {
      extLocation.addresses.push(address) // Create new entry
    }

    type.forEach((t: string) => {
      extLocation[t] =
        addressFormUpdateIndex > -1 ? addressFormUpdateIndex : extLocation.addresses.length - 1
    })

    await axios.put(`${Config.openBazaarHost}/ob/profile`, registrationForm)
    alert('Addresses updated')

    const profileData = this.processAddresses(registrationForm)
    this.setState({
      registrationForm: profileData,
    })
    this.handleSettingsBackBtn()
  }

  private async handleFormSubmit(event: React.FormEvent) {
    event.preventDefault()
    await axios.put(`${Config.openBazaarHost}/ob/profile`, this.state.registrationForm)
    alert('Profile updated')
  }

  private handleChange(field: string, value: any, subField?: string): void {
    if (subField) {
      const subFieldData = this.state[subField]
      nestedJson(subFieldData, field, value)
      this.setState({ subFieldData })
    } else {
      this.setState({
        [field]: value,
      })
    }
  }

  private async handleSearchSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const { filters, searchQuery } = this.state

    if (Object.keys(filters).length > 0) {
      await this.handleFilterSubmit(event)
    } else {
      await this.executeSearchRequest(searchQuery)
    }
  }

  private async executeSearchRequest(searchQuery: string): Promise<void> {
    const searchObject = {
      query: searchQuery,
      limit: 25,
    }

    const result = await axios.post(`${config.djaliHost}/djali/search`, searchObject)
    this.setState({
      searchResults: result.data,
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

  private async handleFilterSubmit(event: React.FormEvent<HTMLElement>): Promise<void> {
    event.preventDefault()
    const { filters, modifiers, plusCode, locationRadius, searchQuery } = this.state

    const keys = Object.keys(filters)
    const values = Object.values(filters)
    const extendedFilters = keys.map((key, index) => {
      if (values[index] === '') {
        return
      }
      return 'doc.' + key + ' ' + modifiers[key] + ' "' + values[index] + '"'
    })

    if (locationRadius > -1 && filters['location.zipCode']) {
      extendedFilters[0] = `zipWithin("${filters['location.zipCode']}", "${
        filters['location.country']
      }", doc.location.zipCode, doc.location.country, ${locationRadius})`
    }

    if (plusCode) {
      const locationRadiusFilter = locationRadius > -1 ? locationRadius : 0
      const { latitudeCenter, longitudeCenter } = PlusCode.decode(plusCode)
      extendedFilters[0] = `coordsWithin(${latitudeCenter}, ${longitudeCenter}, doc.location.zipCode, doc.location.country, ${locationRadiusFilter})`
    }

    const searchObject = {
      filters: extendedFilters,
      query: searchQuery,
      limit: 25,
    }

    const result = await axios.post(`${config.djaliHost}/djali/search`, searchObject)

    this.setState({
      searchResults: result.data,
    })
  }
}

export default Home
