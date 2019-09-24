import Axios from 'axios'
import config from '../config'

class Currency {
  public currencies: any

  public load() {
    ;(async () => {
      const currencyRequest = await Axios.get(`${config.openBazaarHost}/ob/exchangerate/btc`)
      this.currencies = currencyRequest.data
    })()
  }

  public convert(value: number, from: string, to: string) {
    if (from.toUpperCase() === to.toUpperCase()) {
      return value
    }
    return (
      value *
      (this.currencies[to.toUpperCase()] / this.currencies[from.toUpperCase()])
    ).toFixed(2)
  }

  public async convertCrypto(from: string, to: string, value: number): Promise<number> {
    const conversion = await Axios.get(`${config.openBazaarHost}/ob/exchangerate/${from}/${to}`)
    const rate = Number(conversion.data)
    return parseFloat((value * rate).toFixed(2))
  }

  public humanizeCrypto(value: number, divisibility: number = 100000000) {
    return value / divisibility
  }

  public dehumanizeCrypto(value: number, divisibility: number = 100000000) {
    return value * divisibility
  }
}

const currency = new Currency()
currency.load()

// Request new currency conversion data every 30 minutes
setInterval(() => {
  currency.load()
}, 1800000)

export default currency
