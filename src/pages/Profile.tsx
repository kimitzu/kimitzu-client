import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'

import { ProfileHeader } from '../components/Header'
import { ProfileSwitcher } from '../components/Switcher'

import Profile from '../models/Profile'
import Search from '../models/Search'

interface ProfilePageState {
  profile: Profile
  search: Search
  isOwner: boolean
}

interface RouteProps {
  id: string
}

interface CheckoutProps extends RouteComponentProps<RouteProps> {}

class ProfilePage extends Component<CheckoutProps, ProfilePageState> {
  constructor(props: any) {
    super(props)
    const profile = new Profile()
    const search = new Search()
    this.state = {
      profile,
      search,
      isOwner: false,
    }
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    let profile: Profile = new Profile()
    let isOwner

    if (id) {
      profile = await Profile.retrieve(id, true)
      isOwner = false
    } else {
      profile = await Profile.retrieve()
      isOwner = true
    }

    const search = this.state.search
    search.filters['vendorID.peerID'] = profile.peerID
    search.modifiers['vendorID.peerID'] = '=='
    search.paginate.limit = 0
    search.saveAsOriginal()
    await search.execute()

    this.setState({
      profile,
      search,
      isOwner,
    })
  }

  public render() {
    const { profile, isOwner, search } = this.state
    return (
      <div>
        <ProfileHeader profile={profile} isOwner={isOwner} />
        <ProfileSwitcher profile={profile} listings={search.results.data} />
      </div>
    )
  }
}

export default ProfilePage
