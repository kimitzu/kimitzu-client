import Axios from 'axios'
import config from '../config'
import OrderHistoryInterface from '../interfaces/OrderHistory'
import currency from './Currency'

class OrderHistory implements OrderHistoryInterface {
  public static get filters() {
    return {
      unfunded: {
        states: ['AWAITING_PAYMENT'],
        description: 'Orders that have not yet paid by the buyer.',
      },
      pending: {
        states: ['PENDING'],
        description:
          'Orders that were paid and sent to the vendor but the vendor has not yet responded.',
      },
      processing: {
        states: ['AWAITING_FULFILLMENT'],
        description: 'Orders that were fully paid and vendor is processing the order.',
      },
      fulfilled: {
        states: ['FULFILLED', 'AWAITING_PICKUP'],
        description: 'Orders that were fulfilled by the vendor.',
      },
      completed: {
        states: ['COMPLETED'],
        description: 'Orders that were completed by the buyer.',
      },
      refunded: {
        states: ['REFUNDED'],
        description: 'Orders that were refunded by the vendor.',
      },
      disputes: {
        states: ['DISPUTED', 'DECIDED', 'RESOLVED', 'PAYMENT_FINALIZED'],
        description: 'Orders with a dispute case.',
      },
      cancelled: {
        states: ['CANCELLED', 'DECLINED'],
        description: 'Orders that were canceled by the buyer or that were refused by the vendor.',
      },
      errors: {
        states: ['PROCESSING_ERROR'],
        description: 'Orders that have errors.',
      },
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
