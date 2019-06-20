import React, { Component } from 'react'

import ViewProfile from '../components/Header/ViewProfile'
import Profile from '../models/Profile'

interface ProfilePageState {
  profile: Profile
}

class ProfilePage extends Component<{}, ProfilePageState> {
  constructor(props: any) {
    super(props)
    const profile = new Profile()
    this.state = {
      profile,
    }
  }

  public async componentDidMount() {
    const profile = await Profile.retrieve()
    this.setState({
      profile,
    })
  }

  public render() {
    return <ViewProfile data={this.state.profile} />
  }
}

export default ProfilePage
