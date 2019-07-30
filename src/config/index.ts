interface Config {
  djaliHost: string
  host: string
  openBazaarHost: string
  websocketHost: string
}

const development = {
  djaliHost: 'http://localhost:8109',
  host: 'http://localhost:3001',
  openBazaarHost: 'http://localhost:4002',
  websocketHost: 'ws://localhost:4002/ws',
}

const production = {
  djaliHost: 'https://djali-api.djali.org',
  host: 'https://test.djali.org',
  openBazaarHost: 'https://djali-ob.djali.org',
  websocketHost: 'wss://djali-ob.djali.org/ws',
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
