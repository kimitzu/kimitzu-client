import Location from './Location'

export interface Profile {
  about: string
  avatarHashes: RHashes
  extLocation: EXTLocation
  handle: string
  moderator: boolean
  name: string
  nsfw: boolean
  vendor: boolean
  bitcoinPubkey?: string
  currencies?: string[]
  headerHashes?: RHashes
  lastModified?: string
  location?: string
  metaTags?: MetaTags
  peerID?: string
  preferences: Preferences
  profileType?: string
  shortDescription?: string
  stats?: Stats
}

export interface EXTLocation {
  primary: number
  shipping: number
  billing: number
  return: number
  addresses: Location[]
  [key: string]: any
}

export interface MetaTags {
  DjaliVersion: string
}

export interface Preferences {
  currencyDisplay: string
  fiat: string
  cryptocurrency: string
  language: string
  measurementUnit: string
}

export interface Stats {
  followerCount: number
  followingCount: number
  listingCount: number
  ratingCount: number
  postCount: number
  averageRating: number
}

export interface RHashes {
  tiny: string
  small: string
  medium: string
  large: string
  original: string
}
