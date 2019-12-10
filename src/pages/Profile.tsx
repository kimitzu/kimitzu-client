import { IonContent, IonPage } from '@ionic/react'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'

import { ProfileHeader } from '../components/Header'
import { ProfileSwitcher } from '../components/Switcher'

import Profile from '../models/Profile'
import { Search, searchInstance } from '../models/Search'
import Settings from '../models/Settings'

import { CircleSpinner } from '../components/Spinner'
import config from '../config'
import Rating, { RatingSummary } from '../interfaces/Rating'

import { localeInstance } from '../i18n'
import PeerRating from '../models/PeerRating'

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

  constructor(props: any) {
    super(props)
    this.state = {
      profile: new Profile(),
      currentUser: new Profile(),
      search: searchInstance,
      isOwner: true,
      ratingsSummary: {} as RatingSummary,
      ratings: [],
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
    this.renderPage = this.renderPage.bind(this)
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

    /**
     * Adding timeout to quickly load the profile page.
     * Since this is only requesting the avatars of users
     * in the rating section, not much is affected.
     */
    setTimeout(async () => {
      const { ratings, ratingsSummary } = await Profile.getRatings(profile.peerID)
      this.setState({ ratings, ratingsSummary })
      const updatedRatings = await Promise.all(
        ratings.map(async (rating: RatingItem) => {
          let userData
          try {
            userData = await Profile.retrieve(rating.ratingData.buyerID.peerID)
          } catch (e) {
            userData = new Profile()
          }
          rating.avatar = userData.getAvatarSrc('small')
          return rating
        })
      )
      this.setState({ ratings: updatedRatings, loadingStatus: 'Retrieving Rating Profiles' })

      const { kimitzu } = ratingsSummary
      if (kimitzu && kimitzu.buyerRatings) {
        kimitzu.buyerRatings = await Promise.all(
          kimitzu.buyerRatings.map(async buyerRating => {
            let userData
            try {
              userData = await Profile.retrieve(buyerRating.sourceId)
            } catch (e) {
              userData = new Profile()
            }
            if (userData) {
              buyerRating.avatar = userData.getAvatarSrc('small')
              buyerRating.reviewer = userData.name
            }
            return buyerRating
          })
        )
        this.setState({ ratingsSummary })
      }

      console.log({ updatedRatings, summary: this.state.ratingsSummary })
      const peerRatings = await PeerRating.seek(profile.peerID)
      console.log(peerRatings)
    })

    this.setState({
      isLoading: false,
    })
  }

  public render() {
    return (
      <IonPage>
        <IonContent>{this.renderPage()}</IonContent>
      </IonPage>
    )
  }

  private renderPage() {
    const {
      profile,
      followersList,
      followingList,
      isOwner,
      search,
      ratings,
      ratingsSummary,
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
            <img src={`${config.host}/images/warning.png`} height="100" width="100" />
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
          ratingSummary={ratingsSummary}
          ratings={ratings}
          followersList={followersList}
          followingList={followingList}
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
