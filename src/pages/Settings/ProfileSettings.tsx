import React, { Component, ReactNode } from 'react'

import { SideMenuWithContentCard } from '../../components/Card'
import { AddressesCardGroup } from '../../components/CardGroup'
import { AddressForm, RegistrationForm } from '../../components/Form'
import Location from '../../interfaces/Location'

import Countries from '../../constants/Countries.json'
import CryptoCurrencies from '../../constants/CryptoCurrencies'
import CurrencyTypes from '../../constants/CurrencyTypes.json'
import FiatCurrencies from '../../constants/FiatCurrencies.json'
import Languages from '../../constants/Languages.json'
import SettingsNavItems from '../../constants/SettingsNavItems.json'
import UnitsOfMeasurement from '../../constants/UnitsOfMeasurement.json'
import Profile from '../../models/Profile'
import ImageUploaderInstance from '../../utils/ImageUploaderInstance'
import NestedJsonUpdater from '../../utils/NestedJSONUpdater'

const cryptoCurrencies = CryptoCurrencies()

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
    const profile = new Profile()
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
      registrationForm: profile,
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
      const profileData = await Profile.retrieve()
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
          <div>
            <RegistrationForm
              availableCountries={Countries}
              cryptoCurrencies={cryptoCurrencies}
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
            {!isSubmitting ? (
              <button
                className="uk-button uk-button-primary uk-align-center"
                onClick={handleFormSubmit}
              >
                Save
              </button>
            ) : null}
          </div>
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

    registrationForm.addAddress(address, addressFormUpdateIndex)

    const updatedProfile = await registrationForm.update()
    alert('Addresses updated')

    this.setState({
      registrationForm: updatedProfile,
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

    await this.state.registrationForm.update()
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
    registrationForm.deleteAddress(index)

    this.setState({
      registrationForm,
    })

    const profileData = await registrationForm.update()
    alert('Profile updated')

    this.setState({
      registrationForm: profileData,
    })
    this.handleBackBtn()
  }
}

export default GeneralProfile
