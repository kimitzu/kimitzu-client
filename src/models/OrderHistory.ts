import Axios from 'axios'
import config from '../config'
import OrderHistoryInterface from '../interfaces/OrderHistory'

class OrderHistory implements OrderHistoryInterface {
  public static async getSales(): Promise<OrderHistory[]> {
    const sales = await Axios.get(`${config.openBazaarHost}/ob/sales`)
    const parsedSales = sales.data.sales.map(s => {
      // TODO: Causes error if no sales history
      const orderHistory = new OrderHistory(s)
      orderHistory.source = 'sales'
      return orderHistory
    })
    return parsedSales
  }

  public static async getPurchases(): Promise<OrderHistory[]> {
    const purchases = await Axios.get(`${config.openBazaarHost}/ob/purchases`)
    const parsedPurchases = purchases.data.purchases.map(p => {
      const purchase = new OrderHistory(p)
      purchase.source = 'purchases'
      return purchase
    })
    return parsedPurchases
  }

  public source: string = ''

  public buyerHandle: string = ''
  public buyerId: string = ''
  public vendorHandle: string = ''
  public vendorId: string = ''

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

  get displayValue() {
    return this.total / 1000000000
  }
}

export default OrderHistory
