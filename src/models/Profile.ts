import Location from './Location'

export default interface ProfileInterface {
  handle: string
  name: string
  about: string
  extLocation: {
    primary: number
    shipping: number
    billing: number
    return: number
    addresses: Location[]
    [key: string]: number | object[]
  }
  preferences: {
    currencyDisplay: string
    fiat: string
    cryptocurrency: string
    language: string
    measurementUnit: string
  }
  [key: string]: any
}
