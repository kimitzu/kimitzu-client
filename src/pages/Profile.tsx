import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'

import { ProfileHeader } from '../components/Header'
import { CircleSpinner } from '../components/Spinner'
import { ProfileSwitcher } from '../components/Switcher'

import Profile from '../models/Profile'
import { Search, searchInstance } from '../models/Search'
import Settings from '../models/Settings'

import config from '../config'
import { localeInstance } from '../i18n'
import { CompletionRating } from '../interfaces/CompletionRating'
import { FulfillmentRating } from '../interfaces/FulfillmentRating'
import KimitzuCompletionRatings from '../models/KimitzuCompletionRatings'
import KimitzuFulfillmentRatings from '../models/KimitzuFulfillmentRatings'

interface ProfilePageState {
  profile: Profile
  search: Search
  isOwner: boolean
  kimitzuCompletionRatings: KimitzuCompletionRatings
  kimitzuFulfillmentRatings: KimitzuFulfillmentRatings
  isFollowing: boolean
  isBlocked: boolean
  canSendRequest: boolean // To avoid click spam of follow and block buttons
  isLoading: boolean
  loadingStatus: string
  followersList: string[]
  followingList: string[]
  isError: boolean
  currentUser: Profile
}

interface RouteProps {
  id: string
}

interface ProfilePageProps extends RouteComponentProps<RouteProps> {
  profileContext: {
    currentUser: Profile
    settings: Settings
  }
}

class ProfilePage extends Component<ProfilePageProps, ProfilePageState> {
  private profilePageLocale = localeInstance.get.localizations.profilePage
  private kimitzuRatingsSocket: WebSocket = {} as WebSocket

  constructor(props: any) {
    super(props)
    this.state = {
      profile: new Profile(),
      currentUser: new Profile(),
      search: searchInstance,
      isOwner: true,
      kimitzuCompletionRatings: new KimitzuCompletionRatings(),
      kimitzuFulfillmentRatings: new KimitzuFulfillmentRatings(),
      isFollowing: false,
      isBlocked: false,
      canSendRequest: true,
      isLoading: true,
      loadingStatus: '',
      followersList: [],
      followingList: [],
      isError: false,
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

    let profile: Profile
    const currentUser: Profile = this.props.profileContext.currentUser

    try {
      if (id) {
        profile = await Profile.retrieve(id, true)
      } else {
        profile = currentUser
      }
    } catch (e) {
      this.setState({
        isError: true,
        isLoading: false,
      })
      return
    }

    this.setState({
      loadingStatus: 'Retrieving Followers',
    })
    const isFollowing = await Profile.isFollowing(id)
    setTimeout(async () => {
      const followersList = await Profile.getFollowersList(id)
      const followingList = await Profile.getFollowingList(id)
      this.setState({
        followersList,
        followingList,
      })
    })
    this.setState({
      loadingStatus: 'Retrieving Settings',
    })
    const settings = this.props.profileContext.settings
    const isBlocked = settings.blockedNodes.includes(id)
    const isOwner = !id || id === currentUser.peerID // Check if the supplied peerID is your own peerID
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

    this.kimitzuRatingsSocket = new WebSocket(
      `${config.kimitzuSocket.replace(/%id%/g, profile.peerID)}`
    )

    this.kimitzuRatingsSocket.addEventListener('message', evt => {
      const data = JSON.parse(evt.data)
      if (data.type === 'fulfill') {
        const fullfillmentRatings = this.state.kimitzuFulfillmentRatings
        fullfillmentRatings.add(data as FulfillmentRating)
        this.setState({
          kimitzuFulfillmentRatings: fullfillmentRatings,
        })
      } else {
        const completionRatings = this.state.kimitzuCompletionRatings
        completionRatings.add(data as CompletionRating)
        this.setState({
          kimitzuCompletionRatings: completionRatings,
        })
      }
    })

    this.kimitzuRatingsSocket.addEventListener('close', () => {
      console.warn('SOCKET CLOSED')
    })

    this.setState({
      isLoading: false,
    })
  }

  public render() {
    const {
      profile,
      followersList,
      followingList,
      isOwner,
      search,
      isFollowing,
      isBlocked,
    } = this.state
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

    if (this.state.isError) {
      return (
        <div className="uk-flex uk-flex-row uk-flex-center">
          <div className="uk-margin-top uk-text-center">
            <img src={`${config.host}/images/warning.png`} height="100" width="100" alt="error" />
            <h1 className="uk-text-danger uk-margin-top">
              {this.profilePageLocale.profileNotFoundHeader}
            </h1>
            <p>{this.profilePageLocale.profileNotFoundSubText}</p>
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
          currentUser={this.state.currentUser}
          listings={search.results.data}
          followersList={followersList}
          followingList={followingList}
          kimitzuCompletionRatings={this.state.kimitzuCompletionRatings}
          kimitzuFulfillmentRatings={this.state.kimitzuFulfillmentRatings}
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
    this.setState({ canSendRequest: false, isFollowing: !isFollowing })
    try {
      if (!isFollowing) {
        await Profile.follow(peerID)
      } else {
        await Profile.unfollow(peerID)
      }
      this.setState({ canSendRequest: true })
    } catch (error) {
      window.UIkit.notification(
        `${error.message}. Please try again later or make sure that the Kimitzu server is running.`,
        {
          status: 'danger',
        }
      )
      this.setState({ canSendRequest: true, isFollowing: !isFollowing })
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
      const { settings } = this.props.profileContext
      const { blockedNodes } = settings
      if (!isBlocked) {
        await Settings.blockANode(peerID)
        blockedNodes.push(peerID)
      } else {
        await Settings.unblockANode(peerID)
        const index = blockedNodes.findIndex(nodeID => nodeID === peerID)
        if (index !== -1) {
          blockedNodes.splice(index, 1)
        }
      }
      this.setState({ isBlocked: !isBlocked, canSendRequest: true })
    } catch (error) {
      window.UIkit.notification(
        `${error.message}. Please try again later or make sure that the Kimitzu server is running.`,
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
