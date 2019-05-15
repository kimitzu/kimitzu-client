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
