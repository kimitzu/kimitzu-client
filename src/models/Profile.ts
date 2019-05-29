interface ProfileInterface {
  handle: string
  name: string
  about: string
  extLocation: {
    primary: number
    shipping: number
    billing: number
    return: number
    addresses: [
      {
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
    ]
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

export default ProfileInterface
