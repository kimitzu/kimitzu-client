export default interface PaymentNotification {
  notification: Notification
}

export interface Notification {
  coinType: string
  fundingTotal: number
  notificationId: string
  orderId: string
  type: string
}
