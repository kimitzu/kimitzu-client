import axios from 'axios'
import React, { Component } from 'react'

import { AddressesCardGroup } from '../components/CardGroup'
import { AddressForm, RegistrationForm } from '../components/Form'
import { SettingsModal } from '../components/Modal'
import { Listing } from '../models/Listing'
import { Profile } from '../models/Profile'

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
import SortOptions from '../constants/SortOptions.json'
import UnitsOfMeasurement from '../constants/UnitsOfMeasurement.json'
import ImageUploaderInstance from '../utils/ImageUploaderInstance'
import NestedJsonUpdater from '../utils/NestedJSONUpdater'

import { FormSelector } from '../components/Selector'
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
  avatar: string
  isSubmitting: boolean
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
      sort: 'x.title <= y.title',
      searchResults: [],
      settingsIndex: 0,
      isSubmitting: false,
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
      avatar: '',
      registrationForm: {
        handle: '',
        name: '',
        about: '',
        nsfw: false,
        vendor: true,
        moderator: false,
        avatarHashes: {
          tiny: '',
          small: '',
          medium: '',
          large: '',
          original: '',
        },
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
    this.handleSortChange = this.handleSortChange.bind(this)
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
    const { currentAction, settingsIndex, addressForm, registrationForm, avatar } = this.state
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
            avatar={avatar}
            isSubmitting={this.state.isSubmitting}
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
    NestedJsonUpdater(addressForm, field, value)
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
          isSearchBarShow
        />
        <SettingsModal
          content={this.getCurrentContent}
          currentAction={currentAction}
          currentLinkIndex={settingsIndex}
          handleBackBtn={this.handleSettingsBackBtn}
          updateSettingsIndex={this.updateSettingsIndex}
        />
        <div className="uk-flex uk-flex-row uk-flex-left">
          <div className="uk-width-1-4">
            <SidebarFilter
              locationRadius={locationRadius}
              onChange={this.handleChange}
              onFilterChange={this.handleFilterChange}
              onFilterSubmit={this.handleFilterSubmit}
              plusCode={plusCode}
            />
          </div>
          <div className="uk-flex uk-flex-column uk-width-3-4">
            <div className="uk-flex uk-flex-right">
              <div className="uk-width-1-4 uk-margin-top uk-margin-right uk-margin-bottom">
                <FormSelector
                  options={SortOptions}
                  defaultVal={this.state.sort}
                  onChange={event => this.handleSortChange(event.target.value)}
                />
              </div>
            </div>
            <ListingCardGroup data={searchResults} />
          </div>
        </div>
      </div>
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
        await this.handleSearchSubmit()
      }
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

    this.setState({
      isSubmitting: true,
    })

    if (this.state.avatar) {
      const avatarHashes = await ImageUploaderInstance.uploadImage(this.state.avatar)
      this.state.registrationForm.avatarHashes = avatarHashes
    }

    await axios.put(`${Config.openBazaarHost}/ob/profile`, this.state.registrationForm)
    alert('Profile updated')
    this.setState({
      isSubmitting: false,
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

  private async handleSearchSubmit(event?: React.FormEvent<HTMLFormElement>): Promise<void> {
    if (event) {
      event.preventDefault()
    }
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
      sort: this.state.sort,
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

  private async handleFilterSubmit(event?: React.FormEvent<HTMLElement>): Promise<void> {
    if (event) {
      event.preventDefault()
    }
    const { filters, modifiers, plusCode, locationRadius, searchQuery } = this.state

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
      limit: 25,
      sort: this.state.sort,
    }

    const result = await axios.post(`${config.djaliHost}/djali/search`, searchObject)

    this.setState({
      searchResults: result.data,
    })
  }
}

export default Home
