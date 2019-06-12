import axios from 'axios'
import React, { Component, ReactNode } from 'react'

import { SideMenuWithContentCard } from '../../components/Card'
import { AddressesCardGroup } from '../../components/CardGroup'
import { AddressForm, RegistrationForm } from '../../components/Form'
import Location from '../../models/Location'
import { Profile } from '../../models/Profile'

import config from '../../config'
import Countries from '../../constants/Countries.json'
import CryptoCurrencies from '../../constants/CryptoCurrencies.json'
import CurrencyTypes from '../../constants/CurrencyTypes.json'
import FiatCurrencies from '../../constants/FiatCurrencies.json'
import Languages from '../../constants/Languages.json'
import SettingsNavItems from '../../constants/SettingsNavItems.json'
import SortOptions from '../../constants/SortOptions.json'
import UnitsOfMeasurement from '../../constants/UnitsOfMeasurement.json'
import ImageUploaderInstance from '../../utils/ImageUploaderInstance'
import NestedJsonUpdater from '../../utils/NestedJSONUpdater'

const locationTypes = ['primary', 'shipping', 'billing', 'return']

const actions = {
  NONE: 0,
  ADD_EDUCATION: 1,
  UPDATE_EDUCATION: 2,
  ADD_WORK: 3,
  UPDATE_WORK: 4,
  ADD_ADDRESS: 5,
  UPDATE_ADDRESS: 6,
}

interface NavContent {
  component: ReactNode
  label: string
}

// TODO: Move these interfaces if possible(duplicate interface with ListingAddUpdateCard.tsx)
interface SubNavItem {
  label: string
  handler?: () => void
}

interface NavItem extends SubNavItem {
  subItems?: SubNavItem[]
}

interface ProfileSettings {
  props: any
}

interface GeneralProfileState {
  [x: string]: any // TODO: remove this if possible
  addressForm: Location
  registrationForm: Profile
  avatar: string
  isSubmitting: boolean
  addressFormUpdateIndex: number
  currentContentIndex: number
  currentAction: number
}

class GeneralProfile extends Component<ProfileSettings, GeneralProfileState> {
  constructor(props: ProfileSettings) {
    super(props)
    this.state = {
      addressFormUpdateIndex: -1,
      currentAction: actions.NONE,
      currentContentIndex: 0,
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
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleSaveAddress = this.handleSaveAddress.bind(this)
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
    this.handleBackBtn = this.handleBackBtn.bind(this)
    this.refreshForms = this.refreshForms.bind(this)
    this.handleChangeAction = this.handleChangeAction.bind(this)
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

  get profileMainContents() {
    const { avatar, isSubmitting, registrationForm } = this.state
    const { handleChange, handleFormSubmit, handleSelectAddress, handleChangeAction } = this
    return [
      {
        component: (
          <RegistrationForm
            availableCountries={Countries}
            cryptoCurrencies={CryptoCurrencies}
            currencyTypes={CurrencyTypes}
            fiatCurrencies={FiatCurrencies}
            languages={Languages}
            unitOfMeasurements={UnitsOfMeasurement}
            data={registrationForm}
            onChange={handleChange}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            avatar={avatar}
          />
        ),
        label: 'General',
      },
      {
        component: <div />,
        label: 'Social Media',
      },
      {
        component: <div />,
        label: 'Education',
      },
      {
        component: <div />,
        label: 'Work History',
      },
      {
        component: (
          <AddressesCardGroup
            handleAddAddressBtn={() => handleChangeAction(actions.ADD_ADDRESS)}
            handleSelectAddress={handleSelectAddress}
            locations={registrationForm.extLocation.addresses}
          />
        ),
        label: 'Addresses',
      },
    ]
  }

  get profileSubContents() {
    const { addressForm, addressFormUpdateIndex } = this.state
    const { handleAddressChange, handleSaveAddress, handleDeleteAddress } = this
    return {
      [actions.ADD_EDUCATION]: {
        component: <div />,
        label: 'ADD EDUCATION',
      },
      [actions.UPDATE_EDUCATION]: {
        component: <div />,
        label: 'UPDATE EDUCATION',
      },
      [actions.ADD_WORK]: {
        component: <div />,
        label: 'ADD WORK',
      },
      [actions.UPDATE_EDUCATION]: {
        component: <div />,
        label: 'UPDATE WORK',
      },
      [actions.ADD_ADDRESS]: {
        component: (
          <AddressForm
            data={addressForm}
            key="addressform"
            onAddressChange={handleAddressChange}
            onSaveAddress={handleSaveAddress}
            isEdit={false}
          />
        ),
        label: 'ADD ADDRESS',
      },
      [actions.UPDATE_ADDRESS]: {
        component: (
          <AddressForm
            data={addressForm}
            key="addressform"
            onAddressChange={handleAddressChange}
            onSaveAddress={handleSaveAddress}
            isEdit
            onDeleteAddress={handleDeleteAddress}
            updateIndex={addressFormUpdateIndex}
          />
        ),
        label: 'UPDATE ADDRESS',
      },
    }
  }

  get profileMenuSubItems() {
    const navItems: NavItem[] = [...SettingsNavItems]
    navItems[0].subItems = this.profileMainContents.map((subItem: NavContent, index: number) => {
      return {
        label: subItem.label,
        handler: () => {
          this.setState({ currentContentIndex: index, currentAction: actions.NONE })
        },
      }
    })
    return navItems
  }

  get currentCardContent() {
    const { currentAction, currentContentIndex } = this.state
    return currentAction === actions.NONE
      ? this.profileMainContents[currentContentIndex]
      : this.profileSubContents[currentAction]
  }

  public render() {
    const { currentCardContent, handleBackBtn, profileMenuSubItems } = this
    const { currentAction } = this.state
    return (
      <div className="background-body full-vh uk-padding-small">
        <SideMenuWithContentCard
          mainContentTitle={currentCardContent.label}
          menuContent={{
            title: 'SETTINGS',
            navItems: profileMenuSubItems,
          }}
          mainContent={currentCardContent.component}
          handleBackBtn={handleBackBtn}
          showBackBtn={currentAction !== actions.NONE}
        />
      </div>
    )
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
      profile.extLocation.addresses[index].type!.push(type)
    })

    return profile
  }

  private refreshForms() {
    const addressForm = {
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
    }
    this.setState({ addressForm, addressFormUpdateIndex: -1 })
  }

  private handleChangeAction(action: number) {
    this.setState({ currentAction: action })
  }

  private handleBackBtn() {
    this.setState({ currentAction: actions.NONE })
    this.refreshForms()
  }

  private handleSelectAddress(addressIndex: number) {
    const { registrationForm } = this.state
    this.setState({
      currentAction: actions.UPDATE_ADDRESS,
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

    type!.forEach((t: string) => {
      extLocation[t] =
        addressFormUpdateIndex > -1 ? addressFormUpdateIndex : extLocation.addresses.length - 1
    })

    await axios.put(`${config.openBazaarHost}/ob/profile`, registrationForm)
    alert('Addresses updated')

    const profileData = this.processAddresses(registrationForm)
    this.setState({
      registrationForm: profileData,
    })
    this.handleBackBtn()
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

    await axios.put(`${config.openBazaarHost}/ob/profile`, this.state.registrationForm)
    alert('Profile updated')
    this.setState({
      isSubmitting: false,
    })
  }

  private async handleChange(field: string, value: any, parentField?: string): Promise<any> {
    // TODO: use string literal for parentField if possible
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

  private handleAddressChange(field: string, value: string | string[]) {
    const { addressForm } = this.state
    NestedJsonUpdater(addressForm, field, value)
    this.setState({
      addressForm,
    })
  }

  private async handleDeleteAddress(index: number) {
    const { registrationForm } = this.state
    const { extLocation } = registrationForm

    const address = extLocation.addresses[index]

    address.type!.forEach(t => {
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
    await axios.put(`${config.openBazaarHost}/ob/profile`, this.state.registrationForm)
    alert('Profile updated')
    const profileData = this.processAddresses(registrationForm)
    this.setState({
      registrationForm: profileData,
    })
    this.handleBackBtn()
  }
}

export default GeneralProfile
