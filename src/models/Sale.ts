import Axios from 'axios'
import config from '../config'
import { Sale as SaleInterface } from '../interfaces/Sale'

class Sale implements SaleInterface {
  public static async getSales(): Promise<Sale[]> {
    const sales = await Axios.get(`${config.openBazaarHost}/ob/sales`)
    return sales.data.sales.map(s => new Sale(s))
  }

  public buyerHandle: string = ''
  public buyerId: string = ''
  public coinType: string = ''
  public moderated: boolean = false
  public orderId: string = ''
  public paymentCoin: string = ''
  public read: boolean = false
  public shippingAddress: string = ''
  public shippingName: string = ''
  public slug: string = ''
  public state: string = ''
  public thumbnail: string = ''
  public timestamp: string = ''
  public title: string = ''
  public total: number = 0
  public unreadChatMessages: number = 0

  constructor(props) {
    Object.assign(this, props)
  }
}

export default Sale
