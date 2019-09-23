import config from '../config'
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
    icon: `${config.host}/images/cryptos/BTC.png`,
  },
  {
    label: 'Litecoin (LTC)',
    value: 'LTC',
    explorer: 'https://live.blockcypher.com/ltc/tx/${tx}',
    icon: `${config.host}/images/cryptos/LTC.png`,
  },
  {
    label: 'ZCash (ZEC)',
    value: 'ZEC',
    explorer: 'https://explorer.zcha.in/transactions/${tx}',
    icon: `${config.host}/images/cryptos/ZEC.png`,
  },
  {
    label: 'Bitcoin Cash (BCH)',
    value: 'BCH',
    explorer: 'https://explorer.bitcoin.com/bch/tx/${tx}',
    icon: `${config.host}/images/cryptos/BCH.png`,
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
    icon: `${config.host}/images/cryptos/BTC.png`,
  },
  {
    label: 'Litecoin (TLTC)',
    value: 'TLTC',
    explorer: 'https://blockexplorer.one/litecoin/testnet/tx/${tx}',
    icon: `${config.host}/images/cryptos/LTC.png`,
  },
  {
    label: 'ZCash (TZEC)',
    value: 'TZEC',
    explorer: 'https://www.chain.so/tx/ZECTEST/${tx}',
    icon: `${config.host}/images/cryptos/ZEC.png`,
  },
  {
    label: 'Bitcoin Cash (TBCH)',
    value: 'TBCH',
    explorer: 'https://explorer.bitcoin.com/tbch/tx/${tx}',
    icon: `${config.host}/images/cryptos/BCH.png`,
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
