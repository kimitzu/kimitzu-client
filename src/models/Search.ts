import Axios from 'axios'
import config from '../config'
import PlusCode from '../utils/Location/PlusCode'
import Listing from './Listing'

export interface State {
  filters: Ers
  locationRadius: number
  modifiers: Ers
  plusCode: string
  query: string
  sort: string
  isSearching: boolean
  results: SearchResults
  paginate: Paginate
  transforms: Transform[]
}

export interface Ers {
  [key: string]: any
}

export interface Paginate {
  limit: number
  start: number
  totalPages: number
  currentPage: number
}

export interface SearchResults {
  data: any[]
  count: number
  limit: number
  nextStart: number
}

export interface Transform {
  operation: string
  spec: Spec
}

export interface Spec {
  hash: string
  thumbnail: string
  'item.title': string
  'item.price': string
  'metadata.pricingCurrency': string
  averageRating: string
}

class Search implements State {
  public filters: Ers = {
    'metadata.contractType': 'SERVICE',
  }
  public locationRadius: number = -1
  public modifiers: Ers = {
    'metadata.contractType': '==',
  }
  public plusCode: string = ''
  public query: string = ''
  public sort: string = 'x.item.title <= y.item.title'
  public isSearching: boolean = false
  public results: SearchResults = {
    data: [],
    count: 0,
    limit: 0,
    nextStart: 0,
  }
  public paginate: Paginate = {
    limit: 25,
    start: 0,
    totalPages: 0,
    currentPage: 0,
  }
  public transforms: Transform[] = [
    {
      operation: 'shift',
      spec: {
        hash: 'hash',
        thumbnail: 'thumbnail',
        'item.title': 'item.title',
        'item.price': 'item.price',
        'metadata.pricingCurrency': 'metadata.pricingCurrency',
        averageRating: 'averageRating',
      },
    },
  ]

  public original = {
    filters: {
      'metadata.contractType': 'SERVICE',
    },
    locationRadius: -1,
    modifiers: {
      'metadata.contractType': '==',
    },
    plusCode: '',
    query: '',
    sort: 'x.item.title <= y.item.title',
    isSearching: false,
    results: {
      data: [],
      count: 0,
      limit: 0,
      nextStart: 0,
    },
    paginate: {
      limit: 25,
      start: 0,
      totalPages: 0,
      currentPage: 0,
    },
    transforms: [
      {
        operation: 'shift',
        spec: {
          hash: 'hash',
          thumbnail: 'thumbnail',
          'item.title': 'item.title',
          'item.price': 'item.price',
          'metadata.pricingCurrency': 'metadata.pricingCurrency',
          averageRating: 'averageRating',
        },
      },
    ],
    CONSTANTS: {
      PAGE_FORWARD: 1,
      PAGE_BACKWARD: -1,
    },
  }

  public CONSTANTS = {
    PAGE_FORWARD: 1,
    PAGE_BACKWARD: -1,
  }

  public async clearSearch() {
    const searchResults = {
      data: [],
      count: 0,
      limit: 0,
      nextStart: 0,
    }
    const paginate = {
      limit: 25,
      start: 0,
      totalPages: 0,
      currentPage: 0,
    }
    this.results = searchResults
    this.paginate = paginate
  }

  public async nextPage() {
    return await this.executePaginate(this.CONSTANTS.PAGE_FORWARD)
  }

  public async previousPage() {
    return await this.executePaginate(this.CONSTANTS.PAGE_BACKWARD)
  }

  public async executePaginate(direction: number) {
    if (direction === -1 && this.paginate.start <= 0) {
      return
    }

    this.paginate.start = direction * this.paginate.limit

    if (this.paginate.start >= this.results.count) {
      return
    }

    this.paginate.currentPage = direction

    return await this.execute()
  }

  public saveAsOriginal() {
    this.original = JSON.parse(JSON.stringify(this))
  }

  public reset() {
    Object.assign(this, this.original)
    return this
  }

  public async executeSort(target: string) {
    const data = target.split('_')
    const field = data[0]
    const condition = data[1]
    this.sort = `x.${field} ${condition} y.${field}`
    return await this.execute()
  }

  public async execute(query?: string): Promise<Search> {
    if (query) {
      this.query = query
    }

    /**
     * Clone search params to prevent mutation of original search
     * which may contain DOM information
     */
    const searchParams = JSON.parse(JSON.stringify(this))

    const priceMin = searchParams.filters.priceMin * 100
    const priceMax = searchParams.filters.priceMax * 100
    let priceRange

    if (priceMin >= 0 && priceMax >= 0) {
      priceRange = `doc.item.price >= ${priceMin} && doc.item.price <= ${priceMax}`
    }

    delete searchParams.filters.priceMin
    delete searchParams.filters.priceMax

    const keys = Object.keys(searchParams.filters)
    const values = Object.values(searchParams.filters)

    let extendedFilters = keys.map((key, index) => {
      if (values[index] === '') {
        return
      }
      if (key === 'item.categories') {
        return `containsInArr(doc.item.categories, "${values[index]}")`
      }
      return 'doc.' + key + ' ' + searchParams.modifiers[key] + ' "' + values[index] + '"'
    })

    if (searchParams.locationRadius > -1 && searchParams.filters['location.zipCode']) {
      extendedFilters = extendedFilters.map(filter => {
        if (filter && filter.includes(searchParams.filters['location.zipCode'])) {
          return `zipWithin("${searchParams.filters['location.zipCode']}", "${searchParams.filters['location.country']}", doc.location.zipCode, doc.location.country, ${searchParams.locationRadius})`
        } else {
          return filter
        }
      })
    }

    if (searchParams.plusCode) {
      const locationRadiusFilter =
        searchParams.locationRadius > -1 ? searchParams.locationRadius : 0
      const { latitudeCenter, longitudeCenter } = PlusCode.decode(searchParams.plusCode)
      extendedFilters[0] = `coordsWithin(${latitudeCenter}, ${longitudeCenter}, doc.location.zipCode, doc.location.country, ${locationRadiusFilter})`
      // extendedFilters.push(`geoWithin(${latitudeCenter}, ${longitudeCenter}, doc.location.latitude, doc.location.longitude, ${locationRadiusFilter})`)
    }

    if (priceRange) {
      extendedFilters.push(priceRange)
    }

    const searchObject = {
      query: searchParams.query,
      filters: extendedFilters,
      limit: searchParams.paginate.limit,
      start: searchParams.paginate.start,
      sort: searchParams.sort,
      transforms: searchParams.transforms,
    }

    const result = await Axios.post(`${config.djaliHost}/djali/search`, searchObject, {
      withCredentials: true,
    })
    this.paginate.totalPages = Math.ceil(result.data.count / this.paginate.limit)

    const listings = result.data.data.map(d => new Listing(d))
    result.data.data = listings

    this.results = result.data as SearchResults
    return this
  }
}

export default Search
