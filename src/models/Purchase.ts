import Axios from 'axios'
import config from '../config'
import { Purchase as PurchaseInterface } from '../interfaces/Purchase'

class Purchase implements PurchaseInterface {
  public static async getPurchases(): Promise<Purchase[]> {
    const orders = await Axios.get(`${config.openBazaarHost}/ob/purchases`)
    return orders.data.purchases.map(p => new Purchase(p))
  }

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
  public vendorHandle: string = ''
  public vendorId: string = ''

  constructor(props) {
    Object.assign(this, props)
  }
}

export default Purchase
