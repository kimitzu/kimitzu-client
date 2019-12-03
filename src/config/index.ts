type Environment = 'local' | 'remote' | 'test'

interface Config {
  kimitzuHost: string
  host: string
  openBazaarHost: string
  websocketHost: string
}

const local = {
  kimitzuHost: `http://${window.location.hostname}:8109`,
  host: process.env.PUBLIC_URL,
  openBazaarHost: `http://${window.location.hostname}:4002`,
  websocketHost: `ws://${window.location.hostname}:4002/ws`,
}

const remote = {
  kimitzuHost: 'https://kimitzu-api.kimitzu.ch',
  host: 'https://test.kimitzu.ch',
  openBazaarHost: 'https://kimitzu-ob.kimitzu.ch',
  websocketHost: 'wss://kimitzu-ob.kimitzu.ch/ws',
}

function getConfig(): Config {
  console.log('Mode: ' + process.env.NODE_ENV)
  console.log('Link: ' + process.env.REACT_APP_LINK)
  switch (process.env.REACT_APP_LINK as Environment) {
    case 'local': {
      return local
    }
    case 'remote': {
      return remote
    }
    default: {
      return local
    }
  }
}

export default {
  ...getConfig(),
}
