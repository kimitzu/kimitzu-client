import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import ReactMarkdown from 'react-markdown'

import { Button } from '../components/Button'
import {
  CompetencyCard,
  InformationCard,
  PayoutCard,
  ProfessionalBackgroundCard,
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

import ListingExpiredOrNotFound from '../components/Errors/ListingExpiredOrNotFound'
import { CircleSpinner } from '../components/Spinner'
import CryptoCurrencies from '../constants/CryptoCurrencies'
import OrderRatings from '../constants/OrderRatings.json'
import Rating, { RatingSummary, UserReview } from '../interfaces/Rating'
import { AssessmentSummary, competencySelectorInstance } from '../models/CompetencySelector'
import currency from '../models/Currency'
import Listing from '../models/Listing'
import Profile from '../models/Profile'

import { localeInstance } from '../i18n'

const cryptoCurrencies = CryptoCurrencies()

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

interface Props extends RouteComponentProps<RouteProps> {
  currentUser: Profile
}

class ListingProfile extends Component<Props, State> {
  private locale = localeInstance.get.localizations

  constructor(props: any) {
    super(props)
    const listing = new Listing()
    const profile = this.props.currentUser

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
    this.handleRenew = this.handleRenew.bind(this)
  }

  public async componentDidMount() {
    this.setState({
      loadingStatus: this.locale.listingPage.retrieveListingSpinnerText,
    })
    const id = this.props.match.params.id
    try {
      const listingData = await Listing.retrieve(id)
      const currentUser = this.props.currentUser
      const { listing, imageData, vendor } = listingData
      this.setState({
        listing,
        imageData,
        profile: vendor,
        loadingStatus: this.locale.listingPage.retrieveRatingsSpinnerText,
        currentUser,
      })
      setTimeout(async () => {
        const { ratingSummary, ratings } = await listing.getRatings()
        this.setState({ ratings, ratingSummary })
        const updatedRatings = await Promise.all(
          ratings.map(async (rating: Rating) => {
            let userData
            if (rating.ratingData.buyerID) {
              return rating
            }
            try {
              userData = await Profile.retrieve(rating.ratingData.buyerID!.peerID)
            } catch (e) {
              userData = new Profile()
            }
            rating.avatar = userData.getAvatarSrc('small')
            return rating
          })
        )
        this.setState({
          ratings: updatedRatings,
        })
      })
      this.setState({
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

  public async handleRenew() {
    window.UIkit.modal
      .confirm(
        localeInstance.format(
          this.locale.listingPage.listingRenewPrompt,
          this.state.listing.item.title
        )
      )
      .then(
        async () => {
          await this.state.listing.renew()
          this.setState({
            listing: this.state.listing,
          })
          window.UIkit.modal.alert(this.locale.listingPage.listingRenewedNotif).then(() => {
            window.location.hash = '/'
          })
        },
        () => {
          // Cancelled, do nothing.
        }
      )
  }

  public render() {
    const { locale } = this
    const { listing, profile, imageData, quantity, ratingSummary } = this.state
    const { background } = profile

    const rating = Math.floor(ratingSummary.average)
    const ratingStars: JSX.Element[] = this.renderStars(rating)
    const skills = JSON.parse(decodeHtml(profile.customProps.skills)) as string[]

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
      return <ListingExpiredOrNotFound />
    }

    return (
      <div id="container">
        <div className="uk-card uk-card-default uk-card-body card-head">
          {listing.hasExpired && !listing.isOwner ? (
            <div
              className="uk-alert-danger uk-padding-small uk-text-center uk-margin-bottom"
              uk-alert
            >
              {locale.listingPage.expiredListingHelper1}
            </div>
          ) : null}
          {listing.hasExpired && listing.isOwner ? (
            <div
              className="uk-alert-danger uk-padding-small uk-text-center uk-margin-bottom"
              uk-alert
            >
              {locale.listingPage.expiredListingHelper2}{' '}
              <a
                href="#"
                onClick={async evt => {
                  evt.preventDefault()
                  this.handleRenew()
                }}
              >
                {locale.listingPage.renewLink}
              </a>
            </div>
          ) : null}

          {listing.isOwner ? (
            <div className="uk-width-1-1 uk-margin-bottom">
              <Button
                type="button"
                className="uk-button uk-button-default"
                onClick={() => {
                  window.location.hash = `/listing/edit/${listing.hash}`
                }}
              >
                <span uk-icon="pencil" /> {locale.listingPage.editBtnText}
              </Button>
              <Button
                type="button"
                className="uk-button uk-button-danger uk-margin-left"
                onClick={() => {
                  window.UIkit.modal.confirm(locale.listingPage.deleteListingPromptText).then(
                    async () => {
                      await listing.delete()
                      window.UIkit.modal
                        .alert(locale.listingPage.deleteListingSuccessNotif)
                        .then(() => {
                          window.location.hash = '/'
                        })
                    },
                    () => {
                      // Do nothing when cancel is pressed
                    }
                  )
                }}
              >
                <span uk-icon="trash" /> {locale.deleteBtnText}
              </Button>
            </div>
          ) : null}
          <div className="uk-grid uk-text-center" uk-grid>
            <div className="uk-width-1-3@m">
              <CarouselListing data={imageData} />
            </div>
            <div className="uk-width-expand@m">
              <div className="uk-flex uk-flex-column">
                <div className="uk-flex uk-flex-column">
                  <div className="uk-flex uk-flex-row uk-flex-between">
                    <div className="uk-flex uk-flex-column">
                      <div
                        id="listing-title"
                        className="uk-text-bold uk-text-capitalize uk-text-left"
                      >
                        {decodeHtml(listing.item.title)}
                      </div>
                      <div
                        className="uk-flex uk-flex-row uk-margin-bottom uk-flex-middle"
                        id="starsContainer"
                      >
                        {ratingSummary.count > 0 ? (
                          <div className="uk-flex uk-flex-row">
                            <div className="uk-margin-small-right">{ratingStars}</div>
                            <p>
                              {ratingSummary.count.toFixed(0)} {locale.listingPage.reviewsText}
                            </p>
                          </div>
                        ) : (
                          <p className="color-secondary">{locale.listingPage.noRatingsText}</p>
                        )}
                      </div>
                    </div>
                    <div className="uk-flex uk-flex-column">
                      <div
                        className="uk-flex uk-flex-row uk-flex-middle text-blue"
                        id="price-container"
                      >
                        <div id="currency">{this.state.currentUser.preferences.fiat}</div>
                        <div id="price" className="text-blue">
                          {currency
                            .convert(
                              Number(listing.displayValue),
                              listing.metadata.pricingCurrency.toUpperCase(),
                              this.state.currentUser.preferences.fiat
                            )
                            .toFixed(2)}
                        </div>
                      </div>
                      <div className="uk-text-right">
                        {listing.metadata.serviceRateMethod !== 'FIXED' ? '/' : ''}
                        {this.locale.constants.singulars[listing.metadata.serviceRateMethod]}
                      </div>
                    </div>
                  </div>
                  <div className="uk-grid uk-text-left" uk-grid>
                    <div className="uk-flex uk-flex-column">
                      <div className="uk-text-bold">{locale.typeLabel}</div>
                      <div className="uk-text-capitalize">
                        {listing.metadata.contractType.toLowerCase()}
                      </div>
                    </div>
                    {listing.metadata.serviceClassification ? (
                      <div className="uk-flex uk-flex-column">
                        <div className="uk-text-bold">{locale.listingPage.classificationLabel}</div>
                        <div className="uk-text-capitalize">
                          {listing.metadata.serviceClassification}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="uk-grid uk-text-left" uk-grid>
                    <div className="uk-flex uk-flex-column">
                      <div className="uk-text-bold">{locale.listingPage.paymentMethodsLabel}</div>
                      <div className="uk-flex uk-flex-row">
                        {listing.metadata.acceptedCurrencies.map(crypto => {
                          let colorStyle
                          if (crypto.length === 4) {
                            colorStyle = crypto.toLowerCase().substr(1)
                          } else {
                            colorStyle = crypto.toLowerCase()
                          }
                          return (
                            <span className={`enumeration ${colorStyle}`} key={crypto}>
                              {crypto}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    {listing.item.tags.length > 0 ? (
                      <div className="uk-flex uk-flex-column">
                        <div className="uk-text-bold">{locale.listingPage.tagsLabel}</div>
                        <div className="uk-text-capitalize">
                          {listing.item.tags.map((tag, index) => (
                            <span key={index} className="tag uk-text-capitalize">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div
                    className="uk-margin-medium-top uk-grid uk-child-width-1-3@m uk-child-width-1-1@s"
                    uk-grid
                  >
                    <div>
                      <Button
                        data-uk-icon="icon: minus;"
                        className="text-blue hour-selector"
                        onClick={e => {
                          e.preventDefault()
                          this.handleQuantityChange(quantity - 1)
                        }}
                      />
                      <input
                        type="text"
                        id="order-quantity"
                        className="uk-input uk-text-center"
                        value={quantity}
                        onChange={e => {
                          this.handleQuantityChange(Number(e.target.value))
                        }}
                      />
                      <Button
                        data-uk-icon="icon: plus;"
                        className="text-blue hour-selector"
                        onClick={e => {
                          e.preventDefault()
                          this.handleQuantityChange(quantity + 1)
                        }}
                      />
                      <div>
                        {quantity === 1
                          ? this.locale.constants.singulars[listing.metadata.serviceRateMethod]
                          : this.locale.constants.plurals[listing.metadata.serviceRateMethod]}
                      </div>
                    </div>
                    <Button
                      id="checkout"
                      className="uk-button uk-button-primary uk-text-bold uk-margin-left"
                      onClick={this.handleBuy}
                      disabled={listing.hasExpired}
                    >
                      <span uk-icon="icon: cart" />{' '}
                      {locale.listingPage.checkoutBtnText.toUpperCase()}
                    </Button>
                  </div>
                </div>
                <hr className="uk-margin-top uk-margin-bottom" />
                <div className="uk-grid uk-grid-collapse" uk-grid>
                  <Link
                    className="uk-flex uk-flex-row text-gray uk-text-left"
                    id="vendor-info"
                    to={`/profile/${listing.vendorID.peerID}`}
                  >
                    <div className="uk-margin-small-right">
                      <img
                        className="uk-border-circle image-avatar"
                        src={
                          profile.avatarHashes.small
                            ? `${config.openBazaarHost}/ob/images/${profile.avatarHashes.small}`
                            : `${config.host}/images/user.svg`
                        }
                        alt="Border circle"
                      />
                    </div>
                    <div className="uk-flex uk-flex-column uk-margin-small-right">
                      <div id="vendor-info-name">{profile.name}</div>
                      <div>
                        {this.renderStars(profile.stats!.averageRating)} (
                        {profile.stats!.ratingCount})
                      </div>
                      <div className="text-gray">{profile.stats!.listingCount} Listings</div>
                    </div>
                  </Link>
                  <div
                    onClick={() => {
                      const dmEvent = new CustomEvent('dm', { detail: profile })
                      window.dispatchEvent(dmEvent)
                    }}
                  >
                    <a data-uk-icon="icon: mail; ratio: 1.5;" className="text-blue" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {listing.item.description ? (
          <div className="uk-card uk-card-default uk-card-medium uk-card-body card-head">
            <h3 className="uk-card-title text-blue uk-text-bold">{locale.descriptionLabel}</h3>
            <div className="inside-content markdown-container">
              <ReactMarkdown source={listing.item.description} />
            </div>
          </div>
        ) : null}
        {profile.contactInfo.email ||
        profile.contactInfo.phoneNumber ||
        profile.contactInfo.social.length > 0 ||
        profile.contactInfo.website ? (
          <SocialMediaCard contact={profile.contactInfo} title={locale.listingPage.contactHeader} />
        ) : null}
        {background && background.educationHistory.length > 0 ? (
          <ProfessionalBackgroundCard data={background} name={locale.listingPage.educationHeader} />
        ) : null}
        {background && background.employmentHistory.length > 0 ? (
          <ProfessionalBackgroundCard data={background} name={locale.listingPage.workHeader} />
        ) : null}
        {this.renderReviews()}

        {/* Return card if implementation is done */}
        {/* <TagsCard data={spokenLanguages || []} name="Spoken Languages" /> */}

        {skills.length > 0 ? (
          <TagsCard name={locale.listingPage.skillsHeader} data={skills} />
        ) : null}
        {profile.customProps.competencies ? (
          <div className="uk-margin-bottom">
            <CompetencyCard
              data={profile.customProps.competencies as AssessmentSummary}
              singleCompetency={competencySelectorInstance.getCompetencyIdFromOccupationId(
                listing.metadata.serviceClassification!
              )}
            />
          </div>
        ) : null}
        <TermsOfServiceCard
          data={listing.termsAndConditions || locale.listingPage.emptyTosContentParagraph}
        />
      </div>
    )
  }

  private renderStars(rating: number): JSX.Element[] {
    const ratingStars: JSX.Element[] = []
    for (let index = 0; index < 5; index++) {
      if (index < rating) {
        ratingStars.push(
          <span className="blue-fill" key={index}>
            <a data-uk-icon="icon: star;" className="text-blue star" />
          </span>
        )
      } else {
        ratingStars.push(
          <a key={index} data-uk-icon="icon: star;" className="empty-fill text-blue star" />
        )
      }
    }
    return ratingStars
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
