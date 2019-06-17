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
  locationHost: 'https://djali-api-loc.nauxe.com',
  djaliHost: 'https://djali-api.nauxe.com',
  openBazaarHost: 'https://djali-ob.nauxe.com',
  host: 'https://djali.nauxe.com',
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
