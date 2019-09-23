import { CryptoCurrencyConstant } from '../interfaces/Constants'

const production = [
  {
    label: 'Select preferred cryptocurrency',
    value: '',
    explorer: '',
  },
  {
    label: 'Bitcoin (BTC)',
    value: 'BTC',
    explorer: 'https://www.blockchain.com/btc/tx/${tx}',
  },
  {
    label: 'Litecoin (LTC)',
    value: 'LTC',
    explorer: 'https://live.blockcypher.com/ltc/tx/${tx}',
  },
  {
    label: 'ZCash (ZEC)',
    value: 'ZEC',
    explorer: 'https://explorer.zcha.in/transactions/${tx}',
  },
  {
    label: 'Bitcoin Cash (BCH)',
    value: 'BCH',
    explorer: 'https://explorer.bitcoin.com/bch/tx/${tx}',
  },
] as CryptoCurrencyConstant[]

const development = [
  {
    label: 'Select preferred cryptocurrency',
    value: '',
  },
  {
    label: 'Bitcoin (TBTC)',
    value: 'TBTC',
    explorer: 'https://live.blockcypher.com/btc-testnet/tx/${tx}',
  },
  {
    label: 'Litecoin (TLTC)',
    value: 'TLTC',
    explorer: 'https://blockexplorer.one/litecoin/testnet/tx/${tx}',
  },
  {
    label: 'ZCash (TZEC)',
    value: 'TZEC',
    explorer: 'https://www.chain.so/tx/ZECTEST/${tx}',
  },
  {
    label: 'Bitcoin Cash (TBCH)',
    value: 'TBCH',
    explorer: 'https://explorer.bitcoin.com/tbch/tx/${tx}',
  },
] as CryptoCurrencyConstant[]

export default function get(): CryptoCurrencyConstant[] {
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
