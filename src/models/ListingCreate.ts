import Location from './Location'
import { RHashes } from './Profile'

export interface ListingCreate {
  slug?: string
  metadata: Metadata
  item: Item
  shippingOptions: any
  taxes: any[]
  coupons: any[]
  moderators: any[]
  termsAndConditions: string
  refundPolicy: string
  location: Location
}

export interface Item {
  title: string
  description: string
  processingTime?: string
  price: number
  tags: string[]
  images: RHashes[]
  categories: string[]
  condition: string
  options?: Option[]
  skus?: Skus[]
  nsfw: boolean
}

export interface Option {
  name: string
  description: string
  variants: Variant[]
}

export interface Variant {
  name: string
  image?: RHashes
}

export interface Skus {
  variantCombo: number[]
  productID: string
  surcharge: number
  quantity: number
}

export interface Metadata {
  contractType: string
  format: string
  expiry?: string
  pricingCurrency: string
  acceptedCurrencies: string[]
}
