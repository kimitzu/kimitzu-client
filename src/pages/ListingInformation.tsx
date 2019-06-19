import React, { Component } from 'react'

import { RouteComponentProps } from 'react-router-dom'
import {
  PayoutCard,
  ProfessionalBackgroundCard,
  SocialMediaCard,
  TagsCard,
  TermsOfServiceCard,
} from '../components/Card'
import { CarouselListing } from '../components/Carousel'

import config from '../config'
import decodeHtml from '../utils/Unescape'
import './ListingInformation.css'

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
    }
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

  public render() {
    const { background, spokenLanguages, programmingLanguages } = this.state.profile

    const rating = Math.floor(this.state.listing.averageRating)
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
          <div id="profile-header">
            <div id="left-content">
              <CarouselListing data={this.state.imageData} />
            </div>
            <div id="right-content">
              <div id="head-content">
                <p className="uk-text-large uk-text-bold text-blue">
                  {decodeHtml(this.state.listing.item.title)}
                </p>
                <div className="uk-text-small">
                  Type:{' '}
                  <p className="uk-display-inline uk-text-bold">
                    {this.state.listing.metadata.contractType}
                  </p>
                  &nbsp; &nbsp; Condition:{' '}
                  <p className="uk-display-inline uk-text-bold">
                    {this.state.listing.item.condition}
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
                <p className="text-blue priceSize uk-margin-small-top">
                  {this.state.listing.item.price} {this.state.listing.metadata.pricingCurrency}
                </p>
                <div id="footerContent" className="uk-margin-medium-top">
                  <div id="footerContentLeft">
                    <div>
                      <span>Buy:</span>
                      <a
                        id="hourSelector"
                        data-uk-icon="icon: plus;"
                        className="text-blue uk-margin-left "
                      />
                      <span className="uk-margin-left">1</span>
                      <a
                        id="hourSelector"
                        data-uk-icon="icon: minus;"
                        className="text-blue uk-margin-left "
                      />
                    </div>
                    <button className="uk-button uk-button-primary uk-button-large uk-margin-medium-top uk-text-bold btnRound">
                      BUY NOW
                    </button>
                  </div>
                  <div id="footerContentRight">
                    <span id="soldbytext">Sold by:</span>
                    <div id="soldByCont">
                      <div id="soldByContLeft">
                        <img
                          className="uk-border-circle"
                          src={`${config.openBazaarHost}/ob/images/${
                            this.state.profile.avatarHashes.small
                          }`}
                          width="65"
                          height="65"
                          alt="Border circle"
                        />
                      </div>
                      <div id="soldByContRight">
                        <p className="uk-text-medium uk-text-bold text-blue">
                          {this.state.profile.name}
                        </p>
                        <div>
                          <a data-uk-icon="icon: mail; ratio: 1.5;" className="text-blue" />
                          <span className="uk-text-small uk-margin-small-left">Message</span>
                        </div>
                      </div>
                    </div>
                    <p className="uk-text-medium uk-text-bold text-blue uk-margin-small-top underlinedText">
                      GO TO STORE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="uk-card uk-card-default uk-card-medium uk-card-body card-head">
          <h3 className="uk-card-title text-blue uk-text-bold">Description</h3>
          <p className="inside-content">{this.state.listing.item.description}</p>
        </div>
        <PayoutCard acceptedPayments={this.state.listing.metadata.acceptedCurrencies} />
        <div className="uk-card uk-card-default uk-card-medium uk-card-body card-head">
          <h3 className="uk-card-title text-blue uk-text-bold">Contact Information</h3>
          <div className="inside-content">
            <p className="uk-text-bold">Email</p>
            <p>johndoe@gmail.com</p>
          </div>
        </div>
        <SocialMediaCard />
        {background && background.educationHistory ? (
          <ProfessionalBackgroundCard data={background} name="Education" />
        ) : null}
        {background && background.employmentHistory ? (
          <ProfessionalBackgroundCard data={background} name="Work History" />
        ) : null}
        <TagsCard data={spokenLanguages || []} name="Spoken Langguages" />
        <TagsCard data={programmingLanguages || []} name="Programming Langguages" />
        <div className="uk-card uk-card-default uk-card-medium uk-card-body card-head">
          <h3 className="uk-card-title text-blue uk-text-bold">Programming Expertise Level</h3>
          <h4 className="uk-text-bold text-gray inside-content">Level 1</h4>
        </div>
        <TermsOfServiceCard data={this.state.listing.termsAndConditions || 'Nothing specified.'} />
      </div>
    )
  }
}

export default ListingProfile
