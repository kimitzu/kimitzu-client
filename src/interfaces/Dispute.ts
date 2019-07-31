import { DisputeResolution } from './Order'

export interface Dispute {
  timestamp: string
  buyerContract: RContract
  vendorContract: RContract
  state: string
  read: boolean
  buyerOpened: boolean
  claim: string
  unreadChatMessages: number
  resolution: DisputeResolution
}

export interface RContract {
  vendorListings: VendorListing[]
  buyerOrder: BuyerOrder
  vendorOrderConfirmation: VendorOrderConfirmation
  vendorOrderFulfillment: VendorOrderFulfillment[]
  signatures: Signature[]
}

export interface BuyerOrder {
  refundAddress: string
  refundFee: number
  shipping: Shipping
  buyerID: RID
  timestamp: string
  items: ItemElement[]
  payment: Payment
  ratingKeys: string[]
  alternateContactInfo: string
  version: number
}

export interface RID {
  peerID: string
  handle: string
  pubkeys: Pubkeys
  bitcoinSig: string
}

export interface Pubkeys {
  identity: string
  bitcoin: string
}

export interface ItemElement {
  listingHash: string
  quantity: number
  quantity64: number
  shippingOption: ShippingOption
  memo: string
  paymentAddress: string
}

export interface ShippingOption {
  name: string
  service: string
}

export interface Payment {
  method: string
  moderator: string
  amount: number
  chaincode: string
  address: string
  redeemScript: string
  moderatorKey: string
  coin: string
}

export interface Shipping {
  shipTo: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  addressNotes: string
}

export interface Signature {
  section: string
  signatureBytes: string
}

export interface VendorListing {
  slug: string
  vendorID: RID
  metadata: VendorListingMetadata
  item: VendorListingItem
  moderators: string[]
  termsAndConditions: string
  refundPolicy: string
  location: Location
}

export interface VendorListingItem {
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
  skus: Skus[]
}

export interface Image {
  filename?: string
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

export interface Location {
  latitude: string
  longitude: string
  plusCode: string
  addressOne: string
  addressTwo: string
  city: string
  state: string
  country: string
  zipCode: string
}

export interface VendorListingMetadata {
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
  serviceClassification: string
}

export interface VendorOrderConfirmation {
  orderID: string
  timestamp: string
  paymentAddress: string
  requestedAmount: number
  ratingSignatures: RatingSignature[]
}

export interface RatingSignature {
  metadata: RatingSignatureMetadata
  signature: string
}

export interface RatingSignatureMetadata {
  listingSlug: string
  moderatorKey?: string
  listingTitle: string
  thumbnail: Image
  ratingKey?: string
}

export interface VendorOrderFulfillment {
  orderId: string
  slug: string
  timestamp: string
  payout: Payout
  ratingSignature: RatingSignature
  note: string
  buyerRating: BuyerRating
}

export interface BuyerRating {
  comment: string
  slug: string
  orderId: string
  fields: Field[]
}

export interface Field {
  type: string
  score: number
  max: number
  weight: number
}

export interface Payout {
  sigs: Sig[]
  payoutAddress: string
  payoutFeePerByte: number
}

export interface Sig {
  inputIndex: number
  signature: string
}
