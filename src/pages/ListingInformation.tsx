import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { Button } from '../components/Button'
import {
  PayoutCard,
  ProfessionalBackgroundCard,
  SocialMediaCard,
  TagsCard,
  TermsOfServiceCard,
} from '../components/Card'
import { CarouselListing } from '../components/Carousel'

import config from '../config'
import ServiceRateMethods from '../constants/ServiceRateMethods.json'
import decodeHtml from '../utils/Unescape'
import './ListingInformation.css'

import ServiceTypes from '../constants/ServiceTypes.json'
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
      quantity: 1,
    }
    this.handleBuy = this.handleBuy.bind(this)
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    const listing = await Listing.retrieve(id)

    this.setState({
      listing: listing.listing,
      imageData: listing.imageData,
      profile: listing.profile,
    })
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

    return (
      <div id="container">
        <div className="uk-card uk-card-default uk-card-body card-head">
          {listing.isOwner ? (
            <div className="uk-margin-bottom uk-align-right">
              <button
                type="button"
                className="uk-button uk-button-default"
                onClick={() => {
                  window.location.hash = `/listing/edit/${listing.hash}`
                }}
              >
                <span uk-icon="pencil" /> Edit
              </button>
              <button
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
              </button>
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
                  &nbsp; &nbsp; Classification:{' '}
                  <p className="uk-display-inline uk-text-bold uk-text-capitalize">
                    {ServiceTypes[listing.metadata.serviceClassification!]}
                  </p>
                </div>
                <div id="starsContainer" className="uk-margin-small-top">
                  {ratingStars}
                  <a id="rating" className="text-blue uk-margin-left uk-text-bold rating">
                    {rating} star{rating !== 1 ? 's' : ''}
                  </a>
                </div>
                <a className="uk-text-small text-blue uk-margin-small-top">
                  How ratings are calculated
                </a>
                <br />
                <hr />
                <p className="priceSize uk-margin-small-top uk-text-uppercase">
                  {listing.displayValue} {listing.metadata.pricingCurrency.toUpperCase()}
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
                          className="uk-border-circle"
                          src={
                            profile.avatarHashes.small
                              ? `${config.openBazaarHost}/ob/images/${profile.avatarHashes.small}`
                              : `${config.host}/images/user.svg`
                          }
                          width="65"
                          height="65"
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
            <p className="inside-content">{listing.item.description}</p>
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
        <TagsCard data={spokenLanguages || []} name="Spoken Langguages" />
        <TagsCard data={programmingLanguages || []} name="Programming Langguages" />
        <div className="uk-card uk-card-default uk-card-medium uk-card-body card-head">
          <h3 className="uk-card-title text-blue uk-text-bold">Programming Expertise Level</h3>
          <h4 className="uk-text-bold text-gray inside-content">Level 1</h4>
        </div>
        <TermsOfServiceCard data={listing.termsAndConditions || 'Nothing specified.'} />
      </div>
    )
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
