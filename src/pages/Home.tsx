import React, { Component } from 'react'

import { AddressesCardGroup } from '../components/CardGroup'
import { AddressForm, RegistrationForm } from '../components/Form'
import { SettingsModal } from '../components/Modal'
import NavBar from '../components/NavBar/NavBar'

import { SettingsActions, UserProfile } from '../common/types'

interface State {
  profile: UserProfile
  settingsIndex: number
  currentAction: number
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
      settingsIndex: 0,
    }
    this.handleSettings = this.handleSettings.bind(this)
    this.updateSettingsIndex = this.updateSettingsIndex.bind(this)
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
        type: 'Home',
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
        type: 'Work',
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

  public updateSettingsIndex(e: React.FormEvent, index: number) {
    e.preventDefault()
    this.setState({ settingsIndex: index })
  }

  get getCurrentContent() {
    const { profile } = this.state
    return [
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
          <AddressesCardGroup key="addresses" locations={profile.extendedLocation.addresses} />
        ),
        title: 'ADDRESSES',
      },
      {
        component: <AddressForm key="addressform" handleSave={this.handleSaveAddress} />,
        title: 'ADD ADDRESS',
      },
    ]
  }

  public handleSaveAddress() {
    console.log('WIP')
  }

  public render() {
    const { settingsIndex } = this.state
    return (
      <div>
        <NavBar handleSettings={this.handleSettings} />
        <SettingsModal
          currentLinkIndex={settingsIndex}
          updateSettingsIndex={this.updateSettingsIndex}
          content={this.getCurrentContent[settingsIndex]}
        />
      </div>
    )
  }
}

export default Home
