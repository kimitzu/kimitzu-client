import Axios from 'axios'
import config from '../config'
import Image from '../interfaces/Image'
import Location from '../interfaces/Location'
import {
  Background,
  EXTLocation,
  MetaTags,
  Preferences,
  Profile as ProfileSchema,
  Stats,
} from '../interfaces/Profile'

const LOCATION_TYPES = ['primary', 'shipping', 'billing', 'return']

class Profile implements ProfileSchema {
  public static async retrieve(id?: string): Promise<Profile> {
    let profile

    if (id) {
      const peerRequest = await Axios.get(`${config.djaliHost}/djali/peer/get?id=${id}`)
      const peerInfo = peerRequest.data as Profile
      profile = new Profile(peerInfo)
      return profile
    } else {
      const profileRequest = await Axios.get(`${config.openBazaarHost}/ob/profile`)
      profile = new Profile(profileRequest.data)
      profile.extLocation = profile.processAddresses(profile.extLocation)
    }

    profile.background = {
      educationHistory: [
        {
          title: 'Central Philippine University',
          subtitle: 'BSCS',
          date: '2013-2018',
          address: 'Jaro Iloilo City Philippines',
          desc: 'A short description about the education',
        },
        {
          title: 'Central Philippine University',
          subtitle: 'BSCS',
          date: '2013-2018',
          address: 'Jaro Iloilo City Philippines',
          desc: 'A short description about the education',
        },
      ],
      employmentHistory: [
        {
          title: 'Developer',
          subtitle: 'Kingsland University',
          date: '2013-2018',
          address: 'Jaro Iloilo City Philippines',
          desc: 'A short description about the work',
        },
        {
          title: 'Developer',
          subtitle: 'Kingsland University',
          date: '2013-2018',
          address: 'Jaro Iloilo City Philippines',
          desc: 'A short description about the work',
        },
      ],
    }
    profile.spokenLanguages = ['English', 'Tagalog']
    profile.programmingLanguages = ['Javascript', 'Golang', 'C++']

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
        country: '',
        zipCode: '',
      },
    ],
  }
  public handle: string = ''
  public moderator: boolean = false
  public name: string = ''
  public nsfw: boolean = false
  public vendor: boolean = true
  public bitcoinPubkey?: string = ''
  public currencies?: string[] = []
  public headerHashes?: Image = {
    tiny: '',
    small: '',
    medium: '',
    large: '',
    original: '',
  }
  public lastModified?: string = ''
  public location?: string = ''
  public metaTags?: MetaTags = {
    DjaliVersion: '',
  }
  public peerID?: string = ''
  public preferences: Preferences = {
    currencyDisplay: '',
    fiat: '',
    cryptocurrency: '',
    language: '',
    measurementUnit: '',
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
    educationHistory: [
      {
        title: 'Central Philippine University',
        subtitle: 'BSCS',
        date: '2013-2018',
        address: 'Jaro Iloilo City Philippines',
        desc: 'A short description about the education',
      },
      {
        title: 'Central Philippine University',
        subtitle: 'BSCS',
        date: '2013-2018',
        address: 'Jaro Iloilo City Philippines',
        desc: 'A short description about the education',
      },
    ],
    employmentHistory: [
      {
        title: 'Developer',
        subtitle: 'Kingsland University',
        date: '2013-2018',
        address: 'Jaro Iloilo City Philippines',
        desc: 'A short description about the work',
      },
      {
        title: 'Developer',
        subtitle: 'Kingsland University',
        date: '2013-2018',
        address: 'Jaro Iloilo City Philippines',
        desc: 'A short description about the work',
      },
    ],
  }
  public spokenLanguages?: string[] = ['English', 'Tagalog']
  public programmingLanguages?: string[] = ['Javascript', 'Golang', 'C++']

  constructor(props?: ProfileSchema) {
    if (props) {
      Object.assign(this, props)
    }
  }

  public async save() {
    await Axios.post(`${config.openBazaarHost}/ob/profile`, this)
  }

  public async update() {
    await Axios.put(`${config.openBazaarHost}/ob/profile`, this)
    this.extLocation = this.processAddresses(this.extLocation)
    return this
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

  public addAddress(address: Location, index: number) {
    if (index === -1) {
      this.extLocation.addresses.push(address) // Create new entry
    }

    address.type!.forEach((t: string) => {
      this.extLocation[t] = index > -1 ? index : this.extLocation.addresses.length - 1
    })
  }
}

export default Profile
