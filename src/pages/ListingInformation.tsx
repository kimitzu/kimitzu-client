import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import ReactMarkdown from 'react-markdown'

import { Button } from '../components/Button'
import {
  InformationCard,
  PayoutCard,
  ProfessionalBackgroundCard,
  ProgrammersCompetencyCard,
  SocialMediaCard,
  TagsCard,
  TermsOfServiceCard,
} from '../components/Card'
import { CarouselListing } from '../components/Carousel'
import { Pagination } from '../components/Pagination'
import { RatingsAndReviewsSegment } from '../components/Segment'

import config from '../config'
import ServiceRateMethods from '../constants/ServiceRateMethods.json'
import decodeHtml from '../utils/Unescape'
import './ListingInformation.css'

import { CircleSpinner } from '../components/Spinner'
import OrderRatings from '../constants/OrderRatings.json'
import Rating, { RatingSummary, UserReview } from '../interfaces/Rating'
import currency from '../models/Currency'
import Listing from '../models/Listing'
import Profile from '../models/Profile'

interface Image {
  src: string
}

interface State {
  currentIndex: number
  hasStarted: boolean
  numberOfPages: number
  imageData: Image[]
  profile: Profile
  listing: Listing
  quantity: number
  ratings: Rating[]
  ratingSummary: RatingSummary
  reviewsPerPage: number
  currentReviewPage: number
  isLoading: boolean
  loadingStatus: string
  currentUser: Profile
  hasFailed: boolean
}

interface RouteProps {
  id: string
}

interface Props extends RouteComponentProps<RouteProps> {}

class ListingProfile extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    const listing = new Listing()
    const profile = new Profile()

    this.state = {
      currentIndex: 1,
      hasStarted: false,
      numberOfPages: 2,
      imageData: [],
      listing,
      profile,
      currentUser: profile,
      quantity: 1,
      ratings: [],
      ratingSummary: { average: 0, count: 0, ratings: [], slug: '' },
      reviewsPerPage: 2,
      currentReviewPage: 1,
      isLoading: true,
      loadingStatus: '',
      hasFailed: false,
    }
    this.handleBuy = this.handleBuy.bind(this)
    this.handleReviewPageChange = this.handleReviewPageChange.bind(this)
  }

  public async componentDidMount() {
    this.setState({
      loadingStatus: 'Retrieving Listing',
    })
    const id = this.props.match.params.id
    try {
      const listingData = await Listing.retrieve(id)
      const currentUser = await Profile.retrieve()
      const { listing, imageData, vendor } = listingData
      this.setState({
        listing,
        imageData,
        profile: vendor,
        loadingStatus: 'Retrieving Ratings',
        currentUser,
      })
      const { ratingSummary, ratings } = await listing.getRatings()
      this.setState({ ratings, ratingSummary })
      const updatedRatings = await Promise.all(
        ratings.map(async (rating: Rating) => {
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
      this.setState({
        ratings: updatedRatings,
        isLoading: false,
      })
    } catch (error) {
      this.setState({
        isLoading: false,
        hasFailed: true,
      })
    }
  }

  get serviceRateMethod() {
    const { serviceRateMethod } = this.state.listing.metadata
    if (serviceRateMethod && serviceRateMethod !== 'FIXED') {
      const index = ServiceRateMethods.findIndex(method => method.value === serviceRateMethod)
      return ServiceRateMethods[index].label
    }
    return ''
  }

  public render() {
    const { listing, profile, imageData, quantity } = this.state
    const { background, spokenLanguages, programmingLanguages } = profile

    const rating = Math.floor(listing.averageRating)
    const ratingStars: JSX.Element[] = []
    const skills = JSON.parse(decodeHtml(profile.customProps.skills)) as string[]

    for (let index = 0; index < 5; index++) {
      if (index < rating) {
        ratingStars.push(
          <span className="blue-fill" key={index}>
            <a data-uk-icon="icon: star;" className="text-blue" />
          </span>
        )
      } else {
        ratingStars.push(
          <a key={index} data-uk-icon="icon: star;" className="empty-fill text-blue" />
        )
      }
    }

    if (this.state.isLoading) {
      return (
        <div className="uk-flex uk-flex-row uk-flex-center">
          <div className="uk-margin-top">
            <CircleSpinner message={`${this.state.loadingStatus}...`} />
          </div>
        </div>
      )
    }

    if (this.state.hasFailed) {
      return (
        <div className="uk-flex uk-flex-row uk-flex-center">
          <div className="uk-margin-top uk-text-center">
            <img src={`${config.host}/images/warning.png`} height="100" width="100" />
            <h1 className="uk-text-danger uk-margin-top">Unable to Retrieve Listing.</h1>
            <p>
              The listing you requested has either expired on the Djali network or does not exist.
            </p>

            <div className="uk-margin-top uk-text-left">
              <p>Suggestions:</p>
              <ul className="uk-margin-left">
                <li>Browse other listings.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div id="container">
        <div className="uk-card uk-card-default uk-card-body card-head">
          {listing.isOwner ? (
            <div className="uk-margin-bottom uk-align-right">
              <Button
                type="button"
                className="uk-button uk-button-default"
                onClick={() => {
                  window.location.hash = `/listing/edit/${listing.hash}`
                }}
              >
                <span uk-icon="pencil" /> Edit
              </Button>
              <Button
                type="button"
                className="uk-button uk-button-danger uk-margin-left"
                onClick={() => {
                  window.UIkit.modal
                    .confirm(
                      'Are you sure you want to delete this listing? This action cannot be undone.'
                    )
                    .then(
                      async () => {
                        await listing.delete()
                        window.UIkit.modal.alert('Listing deleted.').then(() => {
                          window.location.hash = '/'
                        })
                      },
                      () => {
                        // Do nothing when cancel is pressed
                      }
                    )
                }}
              >
                <span uk-icon="trash" /> Delete
              </Button>
            </div>
          ) : null}
          <div id="listing-header">
            <div id="left-content">
              <CarouselListing data={imageData} />
            </div>
            <div id="right-content">
              <div id="head-content">
                <p className="uk-text-large uk-text-bold text-blue">
                  {decodeHtml(listing.item.title)}
                </p>
                <div className="uk-text-small">
                  Type:{' '}
                  <p className="uk-display-inline uk-text-bold">{listing.metadata.contractType}</p>
                  {listing.metadata.serviceClassification ? (
                    <div>
                      {'  '} Classification:{' '}
                      <p className="uk-display-inline uk-text-bold uk-text-capitalize">
                        {listing.metadata.serviceClassification}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div
                  id="starsContainer"
                  className="uk-margin-small-top uk-flex uk-flex-row uk-flex-middle"
                >
                  {ratingStars} <p className="uk-margin-small-left">({rating.toFixed(1)})</p>
                </div>
                <br />
                <hr />
                <p className="priceSize uk-margin-small-top uk-text-uppercase">
                  {currency.convert(
                    Number(listing.displayValue),
                    listing.metadata.pricingCurrency.toUpperCase(),
                    this.state.currentUser.preferences.fiat
                  )}{' '}
                  {this.state.currentUser.preferences.fiat}
                  {listing.displayServiceRateMethod || ''}
                </p>
                <div id="footerContent" className="uk-margin-medium-top">
                  <div id="footerContentLeft">
                    <div>
                      <span>Buy:</span>
                      <a
                        id="hourSelector"
                        data-uk-icon="icon: minus;"
                        className="text-blue uk-margin-left"
                        onClick={e => {
                          e.preventDefault()
                          this.handleQuantityChange(quantity - 1)
                        }}
                      />
                      <input
                        type="text"
                        className="uk-margin-left uk-input uk-width-1-6 uk-text-center"
                        value={quantity}
                        onChange={e => {
                          this.handleQuantityChange(Number(e.target.value))
                        }}
                      />
                      <a
                        id="hourSelector"
                        data-uk-icon="icon: plus;"
                        className="text-blue uk-margin-left"
                        onClick={e => {
                          e.preventDefault()
                          this.handleQuantityChange(quantity + 1)
                        }}
                      />
                    </div>
                    <Button
                      className="uk-button uk-button-primary uk-button-large uk-margin-medium-top uk-text-bold"
                      onClick={this.handleBuy}
                    >
                      <span uk-icon="icon: cart" /> CHECKOUT
                    </Button>
                  </div>
                  <div id="footerContentRight">
                    <span id="soldbytext">Sold by:</span>
                    <div id="soldByCont">
                      <div id="soldByContLeft">
                        <img
                          className="uk-border-circle imageAvatar"
                          src={
                            profile.avatarHashes.small
                              ? `${config.openBazaarHost}/ob/images/${profile.avatarHashes.small}`
                              : `${config.host}/images/user.svg`
                          }
                          alt="Border circle"
                        />
                      </div>
                      <div id="soldByContRight">
                        <p className="uk-text-medium uk-text-bold text-blue">{profile.name}</p>
                        <div
                          onClick={() => {
                            const dmEvent = new CustomEvent('dm', { detail: profile })
                            window.dispatchEvent(dmEvent)
                          }}
                        >
                          <a data-uk-icon="icon: mail; ratio: 1.5;" className="text-blue" />
                          <span className="uk-text-small uk-margin-small-left">Message</span>
                        </div>
                      </div>
                    </div>
                    <a
                      className="uk-text-medium uk-text-bold text-blue uk-margin-small-top underlinedText"
                      onClick={() => {
                        window.location.hash = `/profile/${listing.vendorID.peerID}`
                      }}
                    >
                      GO TO STORE
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {listing.item.description ? (
          <div className="uk-card uk-card-default uk-card-medium uk-card-body card-head">
            <h3 className="uk-card-title text-blue uk-text-bold">Description</h3>
            <div className="inside-content markdown-container">
              <ReactMarkdown source={listing.item.description} />
            </div>
          </div>
        ) : null}
        <PayoutCard acceptedPayments={listing.metadata.acceptedCurrencies} />
        <SocialMediaCard contact={profile.contactInfo} title="Contact Information" />
        {background && background.educationHistory.length > 0 ? (
          <ProfessionalBackgroundCard data={background} name="Education" />
        ) : null}
        {background && background.employmentHistory.length > 0 ? (
          <ProfessionalBackgroundCard data={background} name="Work History" />
        ) : null}
        {this.renderReviews()}

        {/* Return card if implementation is done */}
        {/* <TagsCard data={spokenLanguages || []} name="Spoken Languages" /> */}

        {skills.length > 0 ? <TagsCard name="Skills" data={skills} /> : null}
        {profile.customProps.programmerCompetency !== '{}' &&
        listing.isRelatedCompetency(['251', '252']) ? (
          <div className="uk-margin-bottom">
            <ProgrammersCompetencyCard data={profile} />
          </div>
        ) : null}
        <TermsOfServiceCard data={listing.termsAndConditions || 'Nothing specified.'} />
      </div>
    )
  }

  private renderReviews() {
    const { ratings, ratingSummary, currentReviewPage, reviewsPerPage } = this.state
    const { average, count } = ratingSummary
    if (count === 0) {
      return null
    }
    const ratingsCount = ratings.length
    const ratingsToDisplay = ratings.slice(
      (currentReviewPage - 1) * reviewsPerPage,
      currentReviewPage * reviewsPerPage
    )
    return (
      <div className="uk-margin-top">
        <InformationCard title={`${count} Review${count > 1 ? 's' : ''}`}>
          <RatingsAndReviewsSegment
            totalAverageRating={average}
            totalReviewCount={count}
            ratingInputs={OrderRatings}
            ratings={ratingsToDisplay}
            inlineSummaryDisplay
          />
          <div className="uk-flex uk-flex-center">
            <Pagination
              totalRecord={ratingsCount}
              recordsPerPage={reviewsPerPage}
              handlePageChange={this.handleReviewPageChange}
              selectedPage={currentReviewPage}
            />
          </div>
        </InformationCard>
      </div>
    )
  }

  private handleReviewPageChange(index: number) {
    this.setState({ currentReviewPage: index })
  }

  private handleBuy() {
    window.location.hash = `/listing/checkout/${this.state.listing.hash}/${this.state.quantity}`
  }

  private handleQuantityChange(quantity: number) {
    if (quantity < 1) {
      return 1
    }
    if (quantity) {
      this.setState({
        quantity,
      })
    }
  }
}

export default ListingProfile
