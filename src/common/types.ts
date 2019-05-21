declare global {
  interface Window {
    UIkit: any
  }
}

export interface Location {
  type: string
  isDefault: boolean
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
  country: string
  latitude: number
  longitude: number
  plusCode: string
}

export interface ExtendedLocation {
  primary: number | null
  shipping: number | null
  billing: number | null
  return: number | null
  addresses: Location[]
}

export interface UserProfile {
  extendedLocation: ExtendedLocation
}

export interface SettingsActions {
  NONE: number
  ADD_SOCIAL_MEDIA: number
  ADD_EDUCATION: number
  UPDATE_EDUCATION: number
  ADD_WORK: number
  UPDATE_WORK: number
  ADD_ADDRESS: number
  UPDATE_ADDRESS: number
}
