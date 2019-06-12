import Location from './Location'

export interface Listing {
  djali: DjaliListing
  ipfs: IpfsListing
}

export interface DjaliListing {
  acceptedCurrencies: string[]
  averageRating: number
  categories: string[]
  coinType: string
  contractType: string
  description: string
  hash: string
  language: string
  location: Location
  moderators: string[]
  nsfw: boolean
  parentPeer: string
  peerSlug: string
  price: Price
  ratingCount: number
  slug: string
  thumbnail: Thumbnail
  title: string
}

export interface Price {
  amount: number
  currencyCode: string
  modifier: number
}

export interface Thumbnail {
  medium: string
  small: string
  tiny: string
}

// ================================================

export interface IpfsListing {
  listing: IpfsListingInfo
  hash: string
  signature: string
}

export interface IpfsListingInfo {
  slug: string
  vendorID: VendorID
  metadata: Metadata
  item: Item
  shippingOptions: ShippingOption[]
  coupons: any[]
  moderators: string[]
  termsAndConditions: string
  refundPolicy: string
}

export interface Item {
  title: string
  description: string
  processingTime: string
  price: number
  nsfw: boolean
  tags: string[]
  images: Image[]
  categories: string[]
  grams: number
  condition: string
  options: any[]
  skus: Skus[]
}

export interface Image {
  filename: string
  original: string
  large: string
  medium: string
  small: string
  tiny: string
}

export interface Skus {
  productID: string
  surcharge: number
  quantity: number
}

export interface Metadata {
  version: number
  contractType: string
  format: string
  expiry: string
  acceptedCurrencies: string[]
  pricingCurrency: string
  language: string
  escrowTimeoutHours: number
  coinType: string
  coinDivisibility: number
  priceModifier: number
  serviceRateMethod: string
}

export interface ShippingOption {
  name: string
  type: string
  regions: string[]
  services: Service[]
}

export interface Service {
  name: string
  price: number
  estimatedDelivery: string
  additionalItemPrice: number
}

export interface VendorID {
  peerID: string
  handle: string
  pubkeys: Pubkeys
  bitcoinSig: string
}

export interface Pubkeys {
  identity: string
  bitcoin: string
}
