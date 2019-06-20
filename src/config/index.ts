interface Config {
  locationHost: string
  djaliHost: string
  openBazaarHost: string
  host: string
}

const development = {
  locationHost: 'http://localhost:8108',
  djaliHost: 'http://localhost:8109',
  openBazaarHost: 'http://localhost:4002',
  host: 'http://localhost:3001',
}

const production = {
  locationHost: 'https://djali-api-loc.djali.org',
  djaliHost: 'https://djali-api.djali.org',
  openBazaarHost: 'https://djali-ob.djali.org',
  host: 'https://test.djali.org',
}

function getConfig(): Config {
  console.log('Mode: ' + process.env.NODE_ENV)
  switch (process.env.NODE_ENV) {
    case 'development': {
      return development
    }
    case 'production': {
      return production
    }
    case 'test': {
      return development
    }
    default: {
      throw new Error('Unsupported environment: ' + process.env.NODE_ENV)
    }
  }
}

export default {
  ...getConfig(),
}
