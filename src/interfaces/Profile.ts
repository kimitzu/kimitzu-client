import Image from './Image'
import Location from './Location'

export interface Profile {
  about: string
  avatarHashes: Image
  extLocation: EXTLocation
  handle: string
  moderator: boolean
  name: string
  nsfw: boolean
  vendor: boolean
  bitcoinPubkey?: string
  currencies?: string[]
  headerHashes?: Image
  lastModified?: string
  location?: string
  metaTags?: MetaTags
  peerID?: string
  preferences: Preferences
  profileType?: string
  shortDescription?: string
  stats?: Stats
  background?: Background
  spokenLanguages?: string[]
  programmingLanguages?: string[]
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

// TODO: added backgound interface
export interface Background {
  educationHistory: EducationHistory[]
  employmentHistory: EmploymentHistory[]
}

export interface EducationHistory {
  title: string
  subtitle: string
  date: string
  address: string
  desc: string
}

export interface EmploymentHistory {
  title: string
  subtitle: string
  date: string
  address: string
  desc: string
}
