export interface Order {
  contract: Contract
  state: string
  read: boolean
  funded: boolean
  unreadChatMessages: number
  paymentAddressTransactions: PaymentAddressTransaction[]
}

export interface OrderPaymentInformation {
  amount: number
  orderId: string
  paymentAddress: string
  vendorOnline: boolean
}

export interface Contract {
  vendorListings: VendorListing[]
  buyerOrder: BuyerOrder
  vendorOrderConfirmation: VendorOrderConfirmation
  vendorOrderFulfillment: VendorOrderFulfillment[]
  buyerOrderCompletion: BuyerOrderCompletion
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

export interface BuyerOrderCompletion {
  orderId: string
  timestamp: string
  ratings: Rating[]
}

export interface Rating {
  ratingData: RatingData
  signature: string
}

export interface RatingData {
  ratingKey: string
  vendorID: RID
  vendorSig: RatingSignature
  buyerID: RID
  buyerName: string
  buyerSig: string
  timestamp: string
  overall: number
  quality: number
  description: number
  deliverySpeed: number
  customerService: number
  review: string
}

export interface RatingSignature {
  metadata: RatingSignatureMetadata
  signature: string
}

export interface RatingSignatureMetadata {
  listingSlug: string
  ratingKey: string
  listingTitle: string
  thumbnail: Image
}

export interface Image {
  tiny: string
  small: string
  medium: string
  large: string
  original: string
  filename?: string
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
  shippingOptions: any[]
  coupons: any[]
  moderators: any[]
  termsAndConditions: string
  refundPolicy: string
}

export interface VendorListingItem {
  title: string
  description: string
  processingTime: string
  price: number
  nsfw: boolean
  tags: any[]
  images: Image[]
  categories: any[]
  grams: number
  condition: string
  options: any[]
  skus: Skus[]
}

export interface Skus {
  productID: string
  surcharge: number
  quantity: number
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
}

export interface VendorOrderConfirmation {
  orderID: string
  timestamp: string
  paymentAddress: string
  requestedAmount: number
}

export interface VendorOrderFulfillment {
  orderId: string
  slug: string
  timestamp: string
  ratingSignature: RatingSignature
  note: string
}

export interface PaymentAddressTransaction {
  txid: string
  value: number
  confirmations: number
  height: number
  timestamp: string
}
