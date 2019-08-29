import Axios from 'axios'
import getCurrencySymbol from 'currency-symbol-map'
import config from '../config'
import Image from '../interfaces/Image'
import Location from '../interfaces/Location'
import { Moderator } from '../interfaces/Moderator'
import {
  Background,
  Contact,
  CustomDescription,
  EducationHistory,
  EmploymentHistory,
  EXTLocation,
  MetaTags,
  Preferences,
  Profile as ProfileSchema,
  Stats,
} from '../interfaces/Profile'

import defaults from '../constants/Defaults'

const profileDefaults = defaults.profile
const LOCATION_TYPES = ['primary', 'shipping', 'billing', 'return']

class Profile implements ProfileSchema {
  public static async deleteCredentials(username: string, password: string) {
    const deleteRequest = await Axios.delete(`${config.djaliHost}/authenticate`, {
      data: {
        username,
        password,
      },
    })
    return deleteRequest
  }

  public static async isAuthenticationActivated(): Promise<boolean> {
    const queryRequest = await Axios.get(`${config.djaliHost}/authenticate`)
    return queryRequest.data.authentication as boolean
  }

  public static async login(username, password) {
    const loginRequest = await Axios.post(`${config.djaliHost}/authenticate`, {
      username,
      password,
    })
    document.cookie = loginRequest.data.success
    return loginRequest
  }

  public static logout() {
    const manipulatedExpireDate = new Date()
    manipulatedExpireDate.setDate(manipulatedExpireDate.getDate() - 1)
    document.cookie = `OpenBazaar_Auth_Cookie='';Expires=${manipulatedExpireDate.toUTCString()};Path=/`
    if (document.cookie) {
      throw new Error('Internal Error: Unable to logout, cannot clear session.')
    }
  }

  public static async setCredentials(oldUsername, oldPassword, newUsername, newPassword) {
    const newCredentialRequest = await Axios.patch(`${config.djaliHost}/authenticate`, {
      username: oldUsername,
      password: oldPassword,
      newUsername,
      newPassword,
    })
    return newCredentialRequest
  }

  public static periodParser(e: EducationHistory | EmploymentHistory) {
    if (e.period) {
      e.period.from = new Date(e.period.from)
      if (e.period.to) {
        e.period.to = new Date(e.period.to!)
        if (isNaN(e.period.to.getTime())) {
          delete e.period.to
        }
      }
    }
  }

  public static periodSorter(
    a: EducationHistory | EmploymentHistory,
    b: EducationHistory | EmploymentHistory
  ) {
    if (a.period && b.period) {
      if (a.period.from === b.period.from) {
        return 0
      }
      return a.period.from < b.period.from ? 1 : -1
    }
    return 0
  }

  public static async addToIndex(id: string): Promise<void> {
    await Axios.get(`${config.djaliHost}/djali/peer/add?id=${id}`)
  }

  public static async publish(): Promise<void> {
    await Axios.post(`${config.openBazaarHost}/ob/publish`, {})
  }

  public static async retrieve(id?: string, force?: boolean): Promise<Profile> {
    let profile: Profile

    if (id) {
      const peerRequest = await Axios.get(
        `${config.djaliHost}/djali/peer/get?id=${id}${force ? '&force=true' : ''}`
      )
      const peerInfo = peerRequest.data.profile as Profile
      profile = new Profile(peerInfo)
    } else {
      const profileRequest = await Axios.get(
        `${config.djaliHost}/djali/peer/get?id=${force ? '&force=true' : ''}`
      )
      profile = new Profile(profileRequest.data.profile)
      profile.extLocation = profile.processAddresses(profile.extLocation)
    }

    profile!.background!.educationHistory.forEach(Profile.periodParser)

    profile!.background!.educationHistory.sort(Profile.periodSorter)

    profile!.background!.employmentHistory.forEach(Profile.periodParser)

    profile!.background!.employmentHistory.sort(Profile.periodSorter)

    profile.spokenLanguages = ['English', 'Tagalog']
    profile.programmingLanguages = ['Javascript', 'Golang', 'C++']

    if (profile.moderatorInfo.fee.fixedFee && profile.moderatorInfo.fee.fixedFee.amount) {
      profile.moderatorInfo.fee.fixedFee.amount = profile.moderatorInfo.fee.fixedFee.amount / 100
    }

    return profile
  }

  public about: string = ''
  public avatarHashes: Image = {
    tiny: '',
    small: '',
    medium: '',
    large: '',
    original: '',
  }
  public extLocation: EXTLocation = {
    primary: 0,
    shipping: 0,
    billing: 0,
    return: 0,
    addresses: [
      {
        type: [''],
        latitude: '',
        longitude: '',
        plusCode: '',
        addressOne: '',
        addressTwo: '',
        city: '',
        state: '',
        country: profileDefaults.country,
        zipCode: '',
      },
    ],
  }
  public handle: string = ''
  public moderator: boolean = false
  public moderatorInfo: Moderator = {
    description: '',
    termsAndConditions: '',
    languages: [],
    acceptedCurrencies: [],
    fee: {
      fixedFee: {
        currencyCode: '',
        amount: 0,
      },
      percentage: 0,
      feeType: 'FIXED',
    },
  }
  public name: string = ''
  public nsfw: boolean = false
  public vendor: boolean = true
  public contactInfo: Contact = {
    website: '',
    email: '',
    phoneNumber: '',
    social: [],
  }
  public bitcoinPubkey?: string = ''
  public currencies?: string[] = []
  public headerHashes?: Image = {
    tiny: '',
    small: '',
    medium: '',
    large: '',
    original: '',
  }
  // public lastModified?: string = ''
  public location?: string = ''
  public metaTags?: MetaTags = {
    DjaliVersion: '',
  }
  public peerID: string = ''
  public preferences: Preferences = {
    currencyDisplay: profileDefaults.currencyDisplay,
    fiat: profileDefaults.fiat,
    cryptocurrency: profileDefaults.cryptocurrency,
    language: profileDefaults.language,
    measurementUnit: profileDefaults.measurementUnit,
  }
  public profileType?: string = ''
  public shortDescription?: string = ''
  public stats?: Stats = {
    followerCount: 0,
    followingCount: 0,
    listingCount: 0,
    ratingCount: 0,
    postCount: 0,
    averageRating: 0,
  }
  public background?: Background = {
    educationHistory: [],
    employmentHistory: [],
  }
  public spokenLanguages?: string[] = ['English', 'Tagalog']
  public programmingLanguages?: string[] = ['Javascript', 'Golang', 'C++']
  public customFields: CustomDescription[] = []

  constructor(props?: ProfileSchema) {
    if (props) {
      Object.assign(this, props)
    }
  }

  public getAddress(type: string): string {
    const addressTypes = ['primary', 'shipping', 'billing', 'return']
    if (!addressTypes.includes(type)) {
      throw new Error('Unknown address type')
    }
    const address = this.extLocation.addresses[this.extLocation[type]]
    if (address.latitude && address.longitude) {
      return `(${address.latitude}, ${address.longitude})`
    }
    if (address.plusCode) {
      return `Plus Code: ${address.plusCode}`
    }
    return `${address.city ? `${address.city}, ` : ''}${address.state ? `${address.state}, ` : ''}${
      address.country ? `${address.country}, ` : ''
    }${address.zipCode ? `${address.zipCode}` : ''}`
  }

  public async save() {
    this.location = this.getAddress('primary')
    await Axios.post(`${config.openBazaarHost}/ob/profile`, this)
    await Profile.publish()
  }

  public preSave() {
    if (this.moderatorInfo.fee.fixedFee && this.moderatorInfo.fee.fixedFee.amount) {
      this.moderatorInfo.fee.fixedFee.amount = this.moderatorInfo.fee.fixedFee.amount * 100
    }
    const firstSentence = this.about.split('.')[0]
    this.shortDescription = firstSentence + '.'
  }

  public postSave() {
    if (this.moderatorInfo.fee.fixedFee && this.moderatorInfo.fee.fixedFee.amount) {
      this.moderatorInfo.fee.fixedFee.amount = this.moderatorInfo.fee.fixedFee.amount / 100
    }
  }

  public async update() {
    this.location = this.getAddress('primary')
    this.preSave()
    await Axios.put(`${config.openBazaarHost}/ob/profile`, this)
    await Profile.publish()
    this.postSave()
    this.extLocation = this.processAddresses(this.extLocation)
    return this
  }

  public async setModerator(moderatorProfile: Moderator) {
    this.preSave()
    await Axios.put(`${config.openBazaarHost}/ob/moderator`, moderatorProfile)
    await Profile.publish()
    this.postSave()
  }

  public async unsetModerator() {
    await Axios.delete(`${config.openBazaarHost}/ob/moderator/${this.peerID}`)
    await Profile.publish()
  }

  public async crawlOwnListings() {
    await Axios.get(`${config.djaliHost}/djali/peer/add?id=${this.peerID}`)
  }

  public processAddresses(extLocation: EXTLocation) {
    extLocation.addresses.forEach(a => {
      a.type = []
    })

    LOCATION_TYPES.forEach(type => {
      const index = extLocation[type] as number
      if (index === -1) {
        return
      }
      extLocation.addresses[index].type!.push(type)
    })

    return extLocation
  }

  public deleteAddress(index: number) {
    const address = this.extLocation.addresses[index]

    address.type!.forEach(t => {
      this.extLocation[t] = -1
    })

    this.extLocation.addresses.splice(index, 1)

    LOCATION_TYPES.forEach(type => {
      const tempIndex = this.extLocation[type]
      if (tempIndex > index) {
        this.extLocation[type] = this.extLocation[type] - 1
      }
    })
  }

  public updateAddresses(address: Location, index?: number) {
    const isEntryNew = index == null || index < 0

    if (isEntryNew) {
      this.extLocation.addresses.push(address)
    }

    /**
     * Update indexes in extLocation which tells what type of address is this, either:
     *    primary: index,
     *    shipping: index,
     *    billing: index,
     *    return: index,
     */
    address.type!.forEach((t: string) => {
      this.extLocation[t] = isEntryNew ? this.extLocation.addresses.length - 1 : index
    })

    if (!isEntryNew) {
      this.extLocation.addresses[index!] = address
    }

    this.processAddresses(this.extLocation)
  }

  public getAvatarSrc(type: string = 'medium') {
    const { avatarHashes } = this
    if (!avatarHashes[type]) {
      return `${process.env.PUBLIC_URL}/images/user.svg`
    }
    return `${config.openBazaarHost}/ob/images/${avatarHashes[type]}`
  }

  public get displayModeratorFee() {
    const { moderatorInfo, moderator } = this
    const { feeType, fixedFee, percentage } = moderatorInfo.fee
    if (!moderator) {
      return 'N/A'
    }
    const fixed = fixedFee ? `${fixedFee.amount.toFixed(2)} ${fixedFee.currencyCode}` : ''

    const percent = percentage ? `${percentage}%` : ''
    switch (feeType) {
      case 'FIXED':
        return fixed
      case 'PERCENTAGE':
        return percent
      case 'FIXED_PLUS_PERCENTAGE':
        return `${fixed} (+${percent})`
      default:
        return '0'
    }
  }
}

export default Profile
