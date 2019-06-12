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
import { Profile } from '../models/Profile'

import Axios from 'axios'
import config from '../config'
import { DjaliListing, Image as ListingImage, IpfsListing, Listing } from '../models/Listing'
import decodeHtml from '../utils/Unescape'
import './ListingInformation.css'

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
    this.state = {
      currentIndex: 1,
      hasStarted: false,
      numberOfPages: 2,
      imageData: [],
      listing: {
        djali: {
          acceptedCurrencies: [''],
          averageRating: 0,
          categories: [''],
          coinType: '',
          contractType: '',
          description: '',
          hash: '',
          language: '',
          location: {
            addressOne: '',
            addressTwo: '',
            city: '',
            country: '',
            latitude: '',
            longitude: '',
            plusCode: '',
            state: '',
            zipCode: '',
          },
          moderators: [],
          nsfw: false,
          parentPeer: '',
          peerSlug: '',
          price: {
            amount: 0,
            currencyCode: '',
            modifier: 0,
          },
          ratingCount: 0,
          slug: '',
          thumbnail: {
            medium: '',
            small: '',
            tiny: '',
          },
          title: '',
        },
        ipfs: {
          listing: {
            slug: '',
            vendorID: {
              peerID: '',
              handle: '',
              pubkeys: {
                identity: '',
                bitcoin: '',
              },
              bitcoinSig: '',
            },
            metadata: {
              version: 4,
              contractType: '',
              format: '',
              expiry: '',
              acceptedCurrencies: [],
              pricingCurrency: '',
              language: '',
              escrowTimeoutHours: 0,
              coinType: '',
              coinDivisibility: 0,
              priceModifier: 0,
              serviceRateMethod: '',
            },
            item: {
              title: '',
              description: '',
              processingTime: '',
              price: 300,
              nsfw: false,
              tags: [],
              images: [],
              categories: [],
              grams: 0,
              condition: '',
              options: [],
              skus: [
                {
                  productID: '',
                  surcharge: 0,
                  quantity: 0,
                },
              ],
            },
            shippingOptions: [
              {
                name: '',
                type: '',
                regions: [],
                services: [
                  {
                    name: '',
                    price: 0,
                    estimatedDelivery: '',
                    additionalItemPrice: 0,
                  },
                ],
              },
            ],
            coupons: [],
            moderators: [],
            termsAndConditions: '',
            refundPolicy: '',
          },
          hash: '',
          signature: '',
        },
      },
      profile: {
        about: '',
        avatarHashes: {
          large: '',
          medium: '',
          original: '',
          small: '',
          tiny: '',
        },
        bitcoinPubkey: '',
        currencies: [],
        extLocation: {
          addresses: [
            {
              addressOne: '',
              addressTwo: '',
              city: '',
              country: '',
              latitude: '',
              longitude: '',
              plusCode: '',
              state: '',
              zipCode: '',
            },
          ],
          billing: 0,
          primary: 0,
          return: 0,
          shipping: 0,
        },
        handle: '',
        lastModified: '',
        location: '',
        metaTags: {
          DjaliVersion: '',
        },
        moderator: false,
        name: '',
        nsfw: false,
        peerID: '',
        preferences: {
          cryptocurrency: '',
          currencyDisplay: '',
          fiat: '',
          language: '',
          measurementUnit: '',
        },
        profileType: '',
        shortDescription: '',
        stats: {
          averageRating: 0,
          followerCount: 0,
          followingCount: 0,
          listingCount: 0,
          postCount: 0,
          ratingCount: 0,
        },
        vendor: true,
        // TODO: ============== Implement handlers
        background: {
          educationHistory: [
            {
              title: 'Central Philippine University',
              subtitle: 'BSCS',
              date: '2013-2018',
              address: 'Jaro Iloilo City Philippines',
              desc: 'A short description about the education',
            },
            {
              title: 'Central Philippine University',
              subtitle: 'BSCS',
              date: '2013-2018',
              address: 'Jaro Iloilo City Philippines',
              desc: 'A short description about the education',
            },
          ],
          employmentHistory: [
            {
              title: 'Developer',
              subtitle: 'Kingsland University',
              date: '2013-2018',
              address: 'Jaro Iloilo City Philippines',
              desc: 'A short description about the work',
            },
            {
              title: 'Developer',
              subtitle: 'Kingsland University',
              date: '2013-2018',
              address: 'Jaro Iloilo City Philippines',
              desc: 'A short description about the work',
            },
          ],
        },
        spokenLanguages: ['English', 'Tagalog', 'British'],
        programmingLanguages: ['Javascript', 'Golang', 'C++'],
      },
    }
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    const djaliListingRequest = await Axios.post(`${config.djaliHost}/djali/search`, {
      filters: [`contains(doc.hash, "${id}")`],
    })

    const djaliListing = djaliListingRequest.data.data[0] as DjaliListing
    const ipfsListingRequest = await Axios.get(`${config.openBazaarHost}/ob/listing/ipfs/${id}`)
    const ipfsListing = ipfsListingRequest.data as IpfsListing

    const peerRequest = await Axios.get(
      `${config.djaliHost}/djali/peer/get?id=${djaliListing.parentPeer}`
    )
    const profile = peerRequest.data.profile

    // TODO: Implement handlers for the following placeholders
    profile.background = {
      educationHistory: [
        {
          title: 'Central Philippine University',
          subtitle: 'BSCS',
          date: '2013-2018',
          address: 'Jaro Iloilo City Philippines',
          desc: 'A short description about the education',
        },
        {
          title: 'Central Philippine University',
          subtitle: 'BSCS',
          date: '2013-2018',
          address: 'Jaro Iloilo City Philippines',
          desc: 'A short description about the education',
        },
      ],
      employmentHistory: [
        {
          title: 'Developer',
          subtitle: 'Kingsland University',
          date: '2013-2018',
          address: 'Jaro Iloilo City Philippines',
          desc: 'A short description about the work',
        },
        {
          title: 'Developer',
          subtitle: 'Kingsland University',
          date: '2013-2018',
          address: 'Jaro Iloilo City Philippines',
          desc: 'A short description about the work',
        },
      ],
    }
    profile.spokenLanguages = ['English', 'Tagalog', 'British']
    profile.programmingLanguages = ['Javascript', 'Golang', 'C++']

    const imageData = ipfsListing.listing.item.images.map((image: ListingImage) => {
      return { src: `${config.openBazaarHost}/ob/images/${image.medium}` }
    })

    this.setState({
      listing: {
        djali: djaliListing,
        ipfs: ipfsListing,
      },
      profile,
      imageData,
    })
  }

  public render() {
    const { background, spokenLanguages, programmingLanguages } = this.state.profile

    const rating = Math.floor(this.state.listing.djali.averageRating)
    const ratingStars = []

    for (let index = 0; index < 5; index++) {
      if (index < rating) {
        ratingStars.push(
          <span className="blue-fill">
            <a data-uk-icon="icon: star;" className="text-blue" />
          </span>
        )
      } else {
        ratingStars.push(<a data-uk-icon="icon: star;" className="empty-fill text-blue" />)
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
                  {decodeHtml(this.state.listing.djali.title)}
                </p>
                <div className="uk-text-small">
                  Type:{' '}
                  <p className="uk-display-inline uk-text-bold">
                    {this.state.listing.djali.contractType}
                  </p>
                  &nbsp; &nbsp; Condition:{' '}
                  <p className="uk-display-inline uk-text-bold">
                    {this.state.listing.ipfs.listing.item.condition}
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
                  {this.state.listing.djali.price.amount}{' '}
                  {this.state.listing.djali.price.currencyCode}
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
          <p className="inside-content">{this.state.listing.djali.description}</p>
        </div>
        <PayoutCard acceptedPayments={this.state.listing.djali.acceptedCurrencies} />
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
        <TermsOfServiceCard
          data={this.state.listing.ipfs.listing.termsAndConditions || 'Nothing specified.'}
        />
      </div>
    )
  }
}

export default ListingProfile
