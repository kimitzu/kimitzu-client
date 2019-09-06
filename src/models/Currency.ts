import Axios from 'axios'
import config from '../config'

class Currency {
  public async convert(from: string, to: string, value: number): Promise<number> {
    const conversion = await Axios.get(`${config.openBazaarHost}/ob/exchangerate/${from}/${to}`)
    const rate = Number(conversion.data)
    return parseFloat((value * rate).toFixed(2))
  }
}

const currency = new Currency()
export default currency
