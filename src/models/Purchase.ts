import Axios from 'axios'
import config from '../config'
import { Purchase as PurchaseInterface } from '../interfaces/Purchase'
import Profile from '../models/Profile'

class Purchase implements PurchaseInterface {
  public static async getPurchases(): Promise<Purchase[]> {
    const orders = await Axios.get(`${config.openBazaarHost}/ob/purchases`)
    const purchaseProfileRelationship = orders.data.purchases.map(async p => {
      const purchase = new Purchase(p)
      const profile = await Profile.retrieve(purchase.vendorId)
      purchase.vendor = profile
      return purchase
    })
    return Promise.all(purchaseProfileRelationship)
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
  public vendor: Profile = new Profile()

  constructor(props) {
    Object.assign(this, props)
  }

  get displayValue() {
    return this.total / 1000000000
  }
}

export default Purchase
