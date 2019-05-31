import Location from './Location'

export interface Profile {
  peerID?: string
  handle: string
  name: string
  location?: string
  about: string
  shortDescription?: string
  nsfw: boolean
  vendor: boolean
  moderator: boolean
  bitcoinPubkey?: string
  lastModified?: string
  currencies?: string[]
  extLocation: EXTLocation
  profileType?: string
  metaTags?: MetaTags
  preferences: Preferences
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
