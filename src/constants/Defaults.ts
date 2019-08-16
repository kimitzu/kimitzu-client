import Cryptocurrencies from './CryptoCurrencies'

const cryptocurrencies = Cryptocurrencies()

export default {
  profile: {
    country: 'US',
    currencyDisplay: 'FIAT',
    cryptocurrency: cryptocurrencies[1].value,
    fiat: 'USD',
    language: 'en-US',
    measurementUnit: 'ENGLISH',
  },
}
