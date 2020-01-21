interface CacheInterface {
  [key: string]: CacheData
}

interface CacheData {
  data: any
  expiresOn: number
}

class Cache {
  private cache: CacheInterface = {}

  constructor(props?) {
    if (props) {
      Object.assign(this, props)
    }
  }

  public store(key: string, data: any) {
    const expiresOn = Date.now() + 3600000
    this.cache[key] = { data, expiresOn }
  }

  public retrieve(key: string) {
    if (this.cache[key]) {
      if (this.hasExpired(key)) {
        delete this.cache[key]
        return false
      }
      /**
       * Cloning object to avoid unintentional mutations
       */
      return JSON.parse(JSON.stringify(this.cache[key].data))
    } else {
      return false
    }
  }

  public delete(key: string) {
    delete this.cache[key]
  }

  public hasExpired(key: string) {
    const cacheData = this.cache[key]
    return cacheData.expiresOn <= Date.now()
  }
}

const cacheInstance = new Cache()
export { cacheInstance, Cache }
