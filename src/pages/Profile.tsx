import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'

import { ProfileHeader } from '../components/Header'
import { ProfileSwitcher } from '../components/Switcher'

import Profile from '../models/Profile'
import { Search, searchInstance } from '../models/Search'

import Rating, { RatingSummary } from '../interfaces/Rating'

interface RatingItem extends Rating {
  avatar?: string
}

interface ProfilePageState {
  profile: Profile
  search: Search
  isOwner: boolean
  ratings: Rating[]
  ratingsSummary: RatingSummary
}

interface RouteProps {
  id: string
}

interface CheckoutProps extends RouteComponentProps<RouteProps> {}

class ProfilePage extends Component<CheckoutProps, ProfilePageState> {
  constructor(props: any) {
    super(props)
    const profile = new Profile()

    this.state = {
      profile,
      search: searchInstance,
      isOwner: false,
      ratingsSummary: {} as RatingSummary,
      ratings: [],
    }
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    const profile: Profile = await Profile.retrieve(id, true)
    const isOwner = id === undefined
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
    const { ratings, ratingsSummary } = await Profile.getRatings(profile.peerID)
    this.setState({ ratings, ratingsSummary })

    const updatedRatings = await Promise.all(
      ratings.map(async (rating: RatingItem) => {
        const userData = await Profile.retrieve(rating.ratingData.buyerID.peerID)
        rating.avatar = userData.getAvatarSrc('small')
        return rating
      })
    )
    this.setState({ ratings: updatedRatings })

    const { djali } = ratingsSummary
    if (djali && djali.buyerRatings) {
      djali.buyerRatings = await Promise.all(
        djali.buyerRatings.map(async buyerRating => {
          const userData = await Profile.retrieve(buyerRating.sourceId)
          if (userData) {
            buyerRating.avatar = userData.getAvatarSrc('small')
            buyerRating.reviewer = userData.name
          }
          return buyerRating
        })
      )
      this.setState({ ratingsSummary })
    }
  }

  public render() {
    const { profile, isOwner, search, ratings, ratingsSummary } = this.state
    return (
      <div>
        <ProfileHeader profile={profile} isOwner={isOwner} />
        <ProfileSwitcher
          profile={profile}
          listings={search.results.data}
          ratingSummary={ratingsSummary}
          ratings={ratings}
        />
      </div>
    )
  }
}

export default ProfilePage
