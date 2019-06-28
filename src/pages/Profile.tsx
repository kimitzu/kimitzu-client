import React, { Component } from 'react'

import { RouteComponentProps } from 'react-router'
import ViewProfile from '../components/Header/ViewProfile'
import Profile from '../models/Profile'
import Search from '../models/Search'

interface ProfilePageState {
  profile: Profile
  search: Search
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
    }
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    let profile: Profile = new Profile()

    if (id) {
      await Profile.addToIndex(id)
      profile = await Profile.retrieve(id)
    } else {
      profile = await Profile.retrieve()
      await Profile.addToIndex(profile.peerID)
      profile = await Profile.retrieve()
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
    })
  }

  public render() {
    return <ViewProfile data={this.state.profile} listings={this.state.search.results.data} />
  }
}

export default ProfilePage
