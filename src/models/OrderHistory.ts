import Axios from 'axios'
import config from '../config'
import { localeInstance } from '../i18n'
import OrderHistoryInterface from '../interfaces/OrderHistory'
import currency from './Currency'

class OrderHistory implements OrderHistoryInterface {
  public static get filters() {
    const { localizations } = localeInstance.get

    return {
      ...localizations.constants.filters,
    }
  }

  public static async getSales(): Promise<OrderHistory[]> {
    const sales = await Axios.get(`${config.openBazaarHost}/ob/sales`)
    if (!sales.data.sales || sales.data.sales.length <= 0) {
      return []
    }
    const parsedSales = sales.data.sales.map(s => {
      const orderHistory = new OrderHistory(s)
      orderHistory.source = 'sales'
      return orderHistory
    })
    return parsedSales
  }

  public static async getPurchases(): Promise<OrderHistory[]> {
    const purchases = await Axios.get(`${config.openBazaarHost}/ob/purchases`)
    if (!purchases.data.purchases || purchases.data.purchases.length <= 0) {
      return []
    }
    const parsedPurchases = purchases.data.purchases.map(p => {
      const purchase = new OrderHistory(p)
      purchase.source = 'purchases'
      return purchase
    })
    return parsedPurchases
  }

  public static async getCases(): Promise<OrderHistory[]> {
    const cases = await Axios.get(`${config.openBazaarHost}/ob/cases`)
    if (!cases.data.cases) {
      return []
    }
    const parsedCases = cases.data.cases.map(c => {
      const caseTemp = new OrderHistory(c)
      caseTemp.source = 'cases'
      return caseTemp
    })
    return parsedCases
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
  public caseId: string = ''

  constructor(props) {
    Object.assign(this, props)
  }

  get displayValue() {
    return currency.humanizeCrypto(this.total)
  }
}

export default OrderHistory
