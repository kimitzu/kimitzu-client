export default interface OrderHistory {
  coinType: string
  moderated: boolean
  orderId: string
  paymentCoin: string
  read: boolean
  shippingAddress: string
  shippingName: string
  slug: string
  state: string
  thumbnail: string
  timestamp: string
  title: string
  total: number
  unreadChatMessages: number

  vendorHandle?: string
  vendorId?: string
  buyerHandle?: string
  buyerId?: string
  caseId?: string
}
