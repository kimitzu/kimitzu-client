import slugify from 'slugify'

import Axios from 'axios'
import config from '../config'
import CryptoCurrencies from '../constants/CryptoCurrencies'
import ServiceRateMethods from '../constants/ServiceRateMethods.json'
import Image from '../interfaces/Image'
import {
  Coupon,
  Item,
  Listing as ListingInterface,
  Metadata,
  Price,
  ShippingOption,
  Thumbnail,
  VendorID,
} from '../interfaces/Listing'
import Location from '../interfaces/Location'
import Rating, { RatingSummary } from '../interfaces/Rating'
import currency from './Currency'
import Profile from './Profile'

const cryptoCurrencies = CryptoCurrencies().map(crypto => crypto.value)

class Listing implements ListingInterface {
  public static async retrieve(
    id: string
  ): Promise<{ profile: Profile; listing: Listing; imageData: [{ src: string }] }> {
    const djaliListingRequest = await Axios.post(`${config.djaliHost}/djali/listing?hash=${id}`)
    const djaliListing = djaliListingRequest.data
    const profile = await Profile.retrieve(djaliListing.vendorID.peerID, true)

    const imageData = djaliListing.item.images.map((image: Image) => {
      return { src: `${config.openBazaarHost}/ob/images/${image.medium}` }
    })

    const currentUser = await Profile.retrieve()

    const listing = new Listing(djaliListing)
    listing.currentUser = currentUser
    listing.isOwner = listing.determineOwnership()

    return { profile, listing, imageData }
  }

  public currentUser: Profile = new Profile()
  public isOwner: boolean = false
  public item: Item = {
    title: '',
    description: '',
    processingTime: '1 day',
    price: 0,
    tags: [],
    images: [
      {
        filename: '',
        original: '',
        large: '',
        medium: '',
        small: '',
        tiny: '',
      },
    ],
    categories: [],
    grams: 0,
    condition: 'New',
    options: [],
    skus: [
      {
        quantity: -1,
        productID: '',
      },
    ],
  }

  public averageRating: number = 0
  public hash: string = ''
  public location: Location = {
    addressOne: '',
    addressTwo: '',
    city: '',
    country: '',
    latitude: '',
    longitude: '',
    plusCode: '',
    state: '',
    zipCode: '',
  }
  public parentPeer: string = ''
  public peerSlug: string = ''
  public price: Price = {
    amount: 0,
    currencyCode: '',
    modifier: 0,
  }
  public ratingCount: number = 0
  public thumbnail: Thumbnail = {
    medium: '',
    small: '',
    tiny: '',
  }

  public nsfw: boolean = false
  public signature: string = ''
  public slug: string = ''
  public currentSlug: string = ''
  public vendorID: VendorID = {
    peerID: '',
    handle: '',
    pubkeys: {
      identity: '',
      bitcoin: '',
    },
    bitcoinSig: '',
  }
  public metadata: Metadata = {
    version: 0,
    contractType: 'SERVICE',
    format: 'FIXED_PRICE',
    expiry: '',
    acceptedCurrencies: [],
    pricingCurrency: 'USD',
    language: '',
    escrowTimeoutHours: 0,
    coinType: '',
    coinDivisibility: 100000000, // USD Default
    priceModifier: 0,
    serviceRateMethod: 'PER_HOUR',
    serviceClassification: '',
  }
  public shippingOptions: ShippingOption[] = []
  public coupons: Coupon[] = []
  public moderators: string[] = []
  public termsAndConditions: string = ''
  public refundPolicy: string = ''

  constructor(props?: Listing) {
    const expirationDate = new Date()
    expirationDate.setMonth(expirationDate.getMonth() + 1)
    this.metadata.expiry = expirationDate.toISOString()
    if (props) {
      Object.assign(this, props)
    }
    this.normalize()
  }

  public normalize() {
    this.item.price /= 100
    this.currentSlug = this.slug
    this.coupons = this.coupons.map(c => {
      if (c.priceDiscount) {
        c.type = 'price'
        c.priceDiscount /= 100
      } else {
        c.type = 'percent'
      }
      c.uniqueId = `${Math.random()}`
      return c
    })
  }

  public denormalize(): Listing {
    const MAX_SLUG_LENGTH = 70

    const listingClone = JSON.parse(JSON.stringify(this)) as Listing
    listingClone.slug = slugify(listingClone.item.title, { remove: /[*+~.()'"!:@]/g }).substr(
      0,
      MAX_SLUG_LENGTH
    )

    listingClone.coupons = listingClone.coupons.filter(
      coupon => coupon.discountCode !== '' || coupon.title !== ''
    )
    listingClone.coupons = listingClone.coupons.map(c => {
      if (c.priceDiscount) {
        c.priceDiscount *= 100
      }
      return c
    })

    listingClone.item.price *= 100

    delete listingClone.item.skus[0].variantCombo
    listingClone.item.skus[0].productID = this.currentSlug
    listingClone.slug = this.currentSlug

    listingClone.item.categories = this.item.categories.map(category =>
      category.split(':')[0].substr(0, 40)
    )

    delete listingClone.currentUser

    return listingClone
  }

  public async save() {
    /**
     * Clone listing before doing any operation to prevent mutation
     * of original listing object which contains DOM rendering information
     */
    const denormalizedListingObject = this.denormalize()
    await Axios.post(`${config.openBazaarHost}/ob/listing`, denormalizedListingObject)
    await Profile.publish()
    await Profile.retrieve('', true)
  }

  public async update() {
    const denormalizedListingObject = this.denormalize()
    await Axios.put(`${config.openBazaarHost}/ob/listing`, denormalizedListingObject)
    await Profile.publish()
    await Profile.retrieve('', true)
  }

  public async delete() {
    await Axios.delete(`${config.openBazaarHost}/ob/listing/${this.slug}`)
    await Profile.retrieve('', true)
  }

  public addCoupon() {
    const tempCoupon = {
      title: '',
      discountCode: '',
      percentDiscount: 0,
      type: 'percent',
      uniqueId: `${Math.random()}`,
    }
    this.coupons.push(tempCoupon)
  }

  public removeCoupon(index: number) {
    this.coupons.splice(index, 1)
  }

  public get displayValue(): string {
    if (cryptoCurrencies.includes(this.metadata.pricingCurrency)) {
      return (this.item.price / this.metadata.coinDivisibility).toString()
    }
    const realPrice = this.item.price
    return realPrice.toFixed(2)
  }

  public toLocalCurrency() {
    const localCurrency = currency.convert(
      Number(this.displayValue),
      this.metadata.pricingCurrency,
      this.currentUser.preferences.fiat
    )
    return { price: localCurrency, currency: this.currentUser.preferences.fiat }
  }

  public get displayServiceRateMethod(): string | undefined {
    const { serviceRateMethod } = this.metadata
    const index = ServiceRateMethods.findIndex(method => method.value === serviceRateMethod)
    return ServiceRateMethods[index].display
  }

  public determineOwnership(): boolean {
    return this.currentUser.peerID === this.vendorID.peerID
  }

  public async getRatings(): Promise<{ ratingSummary: RatingSummary; ratings: Rating[] }> {
    const { vendorID, slug } = this
    const ratingSummaryRequest = await Axios.get(
      `${config.openBazaarHost}/ob/ratings/${vendorID.peerID}/${slug}`
    )
    const ratingSummary = ratingSummaryRequest.data
    if (!ratingSummary.ratings || ratingSummary.ratings.length === 0) {
      return { ratingSummary: { average: 0, count: 0, ratings: [], slug: '' }, ratings: [] }
    }
    const ratingsRequest = await Axios.post(
      `${config.openBazaarHost}/ob/fetchratings`,
      ratingSummary.ratings
    )
    return { ratingSummary, ratings: ratingsRequest.data }
  }

  public isRelatedCompetency(competencyIDs: string[]) {
    const competencyChecks = competencyIDs.map(competencyID =>
      this.metadata.serviceClassification!.startsWith(competencyID)
    )
    return competencyChecks.reduce((previous, next) => {
      return previous || next
    }, false)
  }
}

export default Listing
