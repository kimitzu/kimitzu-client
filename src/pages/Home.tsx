import React, { Component } from 'react'

import { AddressesCardGroup } from '../components/CardGroup'
import { AddressForm, RegistrationForm } from '../components/Form'
import { SettingsModal } from '../components/Modal'
import NavBar from '../components/NavBar/NavBar'

import actions from '../common/constants'
import { Location, UserProfile } from '../common/types'

interface State {
  profile: UserProfile
  settingsIndex: number
  currentAction: number
  addressForm: Location
}

class Home extends Component<{}, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentAction: 0,
      profile: {
        extendedLocation: {
          addresses: [],
          billing: null,
          primary: null,
          return: null,
          shipping: null,
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
    }
    this.handleSettings = this.handleSettings.bind(this)
    this.updateSettingsIndex = this.updateSettingsIndex.bind(this)
    this.handleSelectAddress = this.handleSelectAddress.bind(this)
    this.refreshForms = this.refreshForms.bind(this)
    this.handleSettingsBackBtn = this.handleSettingsBackBtn.bind(this)
  }

  public componentDidMount() {
    const addresses = [
      {
        address1: 'Awesome house',
        address2: 'Brgy. Labuglabug',
        city: 'Avipa',
        country: 'Felipens',
        isDefault: true,
        latitude: 1.292826,
        longitude: 276.1344,
        plusCode: '424E+',
        state: 'Ioliol',
        type: 'Primary',
        zipCode: '1005',
      },
      {
        address1: 'Awesome Building',
        address2: 'Kasilyas Street',
        city: 'Roja',
        country: 'Felipens',
        isDefault: false,
        latitude: 1.495826,
        longitude: 226.1614,
        plusCode: '444A+',
        state: 'Ioliol',
        type: 'Billing',
        zipCode: '1009',
      },
    ]
    const profile = {
      extendedLocation: {
        addresses,
        billing: null,
        primary: 1,
        return: null,
        shipping: 0,
      },
    }
    this.setState({ profile })
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
    console.log(addressIndex)
    const { profile } = this.state
    console.log(profile)
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
          <RegistrationForm key="regform" availableCountries={[]} availableCurrencies={[]} />
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
        <NavBar handleSettings={this.handleSettings} />
        <SettingsModal
          currentLinkIndex={settingsIndex}
          updateSettingsIndex={this.updateSettingsIndex}
          content={this.getCurrentContent}
          handleBackBtn={this.handleSettingsBackBtn}
          currentAction={currentAction}
        />
      </div>
    )
  }
}

export default Home
