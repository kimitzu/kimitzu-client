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
import Profile from './Profile'

const cryptoCurrencies = CryptoCurrencies().map(crypto => crypto.value)

class Listing implements ListingInterface {
  public static async retrieve(
    id: string
  ): Promise<{ profile: Profile; listing: Listing; imageData: [{ src: string }] }> {
    const djaliListingRequest = await Axios.post(`${config.djaliHost}/djali/listing?hash=${id}`)
    const djaliListing = djaliListingRequest.data
    const profile = await Profile.retrieve(djaliListing.vendorID.peerID)

    const imageData = djaliListing.item.images.map((image: Image) => {
      return { src: `${config.openBazaarHost}/ob/images/${image.medium}` }
    })

    const listing = new Listing(djaliListing)
    listing.isOwner = await listing.determineOwnership()

    return { profile, listing, imageData }
  }

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
  public coupons: Coupon[] = [
    {
      title: '',
      discountCode: '',
      percentDiscount: 0,
      type: 'percent',
    },
  ]
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
  }

  public normalize() {
    this.item.price /= 100
  }

  public denormalize(): ListingInterface {
    const MAX_SLUG_LENGTH = 70

    const listingClone = JSON.parse(JSON.stringify(this)) as ListingInterface
    listingClone.slug = slugify(listingClone.item.title, { remove: /[*+~.()'"!:@]/g }).substr(
      0,
      MAX_SLUG_LENGTH
    )
    listingClone.coupons = listingClone.coupons.filter(
      coupon => coupon.discountCode !== '' || coupon.title !== ''
    )
    listingClone.item.price = listingClone.item.price * 100
    return listingClone
  }

  public async save() {
    /**
     * Clone listing before doing any operation to prevent mutation
     * of original listing object which contains DOM rendering information
     */
    const denormalizedListingObject = this.denormalize()
    await Axios.post(`${config.openBazaarHost}/ob/listing`, denormalizedListingObject)
  }

  public async update() {
    const denormalizedListingObject = this.denormalize()
    await Axios.put(`${config.openBazaarHost}/ob/listing`, denormalizedListingObject)
  }

  public async delete() {
    await Axios.delete(`${config.openBazaarHost}/ob/listing/${this.slug}`)
  }

  public addCoupon() {
    const tempCoupon = {
      title: '',
      discountCode: '',
      percentDiscount: 0,
      type: 'percent',
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
    const realPrice = this.item.price / 100
    return realPrice.toFixed(2)
  }

  public get displayServiceRateMethod(): string | undefined {
    const { serviceRateMethod } = this.metadata
    const index = ServiceRateMethods.findIndex(method => method.value === serviceRateMethod)
    return ServiceRateMethods[index].display
  }

  public async determineOwnership(): Promise<boolean> {
    const user = await Profile.retrieve()
    return user.peerID === this.vendorID.peerID
  }
}

export default Listing
