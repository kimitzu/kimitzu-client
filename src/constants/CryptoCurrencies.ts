const production = [
  {
    label: 'Select preferred cryptocurrency',
    value: '',
  },
  {
    label: 'Bitcoin (BTC)',
    value: 'BTC',
  },
  {
    label: 'Litecoin (LTC)',
    value: 'LTC',
  },
  {
    label: 'ZCash (ZEC)',
    value: 'ZEC',
  },
  {
    label: 'Bitcoin Cash (BCH)',
    value: 'BCH',
  },
]

const development = [
  {
    label: 'Select preferred cryptocurrency',
    value: '',
  },
  {
    label: 'Bitcoin (TBTC)',
    value: 'TBTC',
  },
  {
    label: 'Litecoin (TLTC)',
    value: 'TLTC',
  },
  {
    label: 'ZCash (TZEC)',
    value: 'TZEC',
  },
  {
    label: 'Bitcoin Cash (TBCH)',
    value: 'TBCH',
  },
]

export default function get() {
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
