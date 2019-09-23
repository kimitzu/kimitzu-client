import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'

import { ProfileHeader } from '../components/Header'
import { ProfileSwitcher } from '../components/Switcher'

import Profile from '../models/Profile'
import { Search, searchInstance } from '../models/Search'
import Settings from '../models/Settings'

import { CircleSpinner } from '../components/Spinner'
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
  isFollowing: boolean
  isBlocked: boolean
  canSendRequest: boolean // To avoid click spam of follow and block buttons
  isLoading: boolean
  loadingStatus: string
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
      isOwner: true,
      ratingsSummary: {} as RatingSummary,
      ratings: [],
      isFollowing: false,
      isBlocked: false,
      canSendRequest: true,
      isLoading: true,
      loadingStatus: '',
    }
    this.handleFollowChange = this.handleFollowChange.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleBlockPeerChange = this.handleBlockPeerChange.bind(this)
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    this.setState({
      loadingStatus: 'Retrieving Profile',
    })
    const profile: Profile = await Profile.retrieve(id, true)
    const ownProfile: Profile = await Profile.retrieve()
    this.setState({
      loadingStatus: 'Retrieving Followers',
    })
    const isFollowing = await Profile.isFollowing(id)
    this.setState({
      loadingStatus: 'Retrieving Settings',
    })
    const settings = await Settings.retrieve()
    const isBlocked = settings.blockedNodes.includes(id)
    const isOwner = !id || id === ownProfile.peerID // Check if the supplied peerID is your own peerID
    const search = this.state.search
    search.reset()
    search.filters['vendorID.peerID'] = profile.peerID
    search.modifiers['vendorID.peerID'] = '=='
    search.paginate.limit = 0
    search.saveAsOriginal()
    this.setState({
      loadingStatus: 'Retrieving Listings',
    })
    await search.execute()

    this.setState({
      profile,
      search,
      isFollowing,
      isBlocked,
      isOwner,
      loadingStatus: 'Retrieving Ratings',
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
    this.setState({ ratings: updatedRatings, loadingStatus: 'Retrieving Rating Profiles' })

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

    this.setState({
      isLoading: false,
    })
  }

  public render() {
    const { profile, isOwner, search, ratings, ratingsSummary, isFollowing, isBlocked } = this.state
    const { handleBlockPeerChange, handleFollowChange, handleSendMessage } = this

    if (this.state.isLoading) {
      return (
        <div className="uk-flex uk-flex-row uk-flex-center">
          <div className="uk-margin-top">
            <CircleSpinner message={`${this.state.loadingStatus}...`} />
          </div>
        </div>
      )
    }

    return (
      <div>
        <ProfileHeader
          profile={profile}
          isOwner={isOwner}
          isBlocked={isBlocked}
          isFollowing={isFollowing}
          handleBlockBtn={handleBlockPeerChange}
          handleFollowBtn={handleFollowChange}
          handleMessageBtn={handleSendMessage}
        />
        <ProfileSwitcher
          profile={profile}
          listings={search.results.data}
          ratingSummary={ratingsSummary}
          ratings={ratings}
        />
      </div>
    )
  }

  private async handleFollowChange() {
    const { isFollowing, isOwner, profile, canSendRequest } = this.state
    const { peerID } = profile
    if (!canSendRequest || isOwner) {
      return
    }
    this.setState({ canSendRequest: false })
    try {
      if (!isFollowing) {
        await Profile.follow(peerID)
      } else {
        await Profile.unfollow(peerID)
      }
      this.setState({ isFollowing: !isFollowing, canSendRequest: true })
    } catch (error) {
      window.UIkit.notification(
        `${error.message}. Please try again later or make sure that the Djali server is running.`,
        {
          status: 'danger',
        }
      )
      this.setState({ canSendRequest: true })
    }
  }

  private async handleBlockPeerChange() {
    const { isBlocked, isOwner, profile, canSendRequest } = this.state
    const { peerID } = profile
    if (!canSendRequest || isOwner) {
      return
    }
    this.setState({ canSendRequest: false })
    try {
      if (!isBlocked) {
        await Settings.blockANode(peerID)
      } else {
        await Settings.unblockANode(peerID)
      }
      this.setState({ isBlocked: !isBlocked, canSendRequest: true })
    } catch (error) {
      window.UIkit.notification(
        `${error.message}. Please try again later or make sure that the Djali server is running.`,
        {
          status: 'danger',
        }
      )
      this.setState({ canSendRequest: true })
    }
  }

  private handleSendMessage() {
    const dmEvent = new CustomEvent('dm', { detail: this.state.profile })
    window.dispatchEvent(dmEvent)
  }
}

export default ProfilePage
