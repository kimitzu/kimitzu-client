export interface Listing {
  peerSlugId: string
  parentPeer: string
  rawData: string
  acceptedCurrencies: string[]
  averageRating: number
  categories: string[]
  coinType: string
  contractType: string
  description: string
  hash: string
  language: string
  moderators: string[]
  nsfw: boolean
  price: Price
  ratingCount: number
  shipsTo: string[]
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
