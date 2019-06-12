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
        background: {
          educationHistory: [
            {
              title: 'Central Philippine University',
              subtitle: 'BSCS',
              date: '2013-2018',
              address: 'Jaro Iloilo City Philippines',
              desc: 'A short description about the education',
            },
            {
              title: 'Central Philippine University',
              subtitle: 'BSCS',
              date: '2013-2018',
              address: 'Jaro Iloilo City Philippines',
              desc: 'A short description about the education',
            },
          ],
          employmentHistory: [
            {
              title: 'Developer',
              subtitle: 'Kingsland University',
              date: '2013-2018',
              address: 'Jaro Iloilo City Philippines',
              desc: 'A short description about the work',
            },
            {
              title: 'Developer',
              subtitle: 'Kingsland University',
              date: '2013-2018',
              address: 'Jaro Iloilo City Philippines',
              desc: 'A short description about the work',
            },
          ],
        },
      },
    }
  }

  public async componentDidMount() {
    const profileRequest = await Axios.get(`${config.openBazaarHost}/ob/profile`)
    this.setState({
      profile: profileRequest.data,
    })
  }

  public render() {
    return <ViewProfile data={this.state.profile} />
  }
}

export default ProfilePage
