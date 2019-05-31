import Axios from 'axios'
import React, { Component } from 'react'

import ViewProfile from '../components/Header/ViewProfile'
import config from '../config'
import { Profile } from '../models/Profile'

interface ProfilePageState {
  profile: Profile
}

class ProfilePage extends Component<{}, ProfilePageState> {
  constructor(props: any) {
    super(props)
    this.state = {
      profile: {
        peerID: '',
        handle: '',
        name: '',
        location: '',
        about: '',
        shortDescription: '',
        nsfw: false,
        vendor: false,
        moderator: false,
        bitcoinPubkey: '',
        lastModified: '',
        currencies: ['BCH', 'ZEC', 'LTC', 'BTC'],
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
        profileType: 'djali',
        metaTags: {
          DjaliVersion: '0.0.1-dev',
        },
        preferences: {
          currencyDisplay: '',
          fiat: '',
          cryptocurrency: '',
          language: '',
          measurementUnit: '',
        },
      },
    }
  }

  public async componentDidMount() {
    const profileRequest = await Axios.get(`${config.openBazaarHost}/ob/profile`)
    this.setState({
      profile: profileRequest.data,
    })
    console.log(this.state.profile)
  }

  public render() {
    return <ViewProfile data={this.state.profile} />
  }
}

export default ProfilePage
