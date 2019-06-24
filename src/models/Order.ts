import Axios from 'axios'
import config from '../config'
import { Contract, Order as OrderInterface, OrderPaymentInformation } from '../interfaces/Order'

class Order implements OrderInterface {
  public static async getOrder(id: string): Promise<Order> {
    const order = await Axios.get(`${config.openBazaarHost}/ob/order/${id}`)
    return new Order(order.data)
  }

  public contract: Contract = {
    vendorListings: [
      {
        slug: '',
        vendorID: {
          peerID: '',
          handle: '',
          pubkeys: {
            identity: '',
            bitcoin: '',
          },
          bitcoinSig: '',
        },
        metadata: {
          version: 4,
          contractType: 'SERVICE',
          format: 'FIXED_PRICE',
          expiry: '',
          acceptedCurrencies: [],
          pricingCurrency: '',
          language: '',
          escrowTimeoutHours: 1,
          coinType: '',
          coinDivisibility: 100000000,
          priceModifier: 0,
          serviceRateMethod: '',
        },
        item: {
          title: '',
          description: '',
          processingTime: '',
          price: 0,
          nsfw: false,
          tags: [],
          images: [
            {
              filename: '',
              original: '',
              large: '',
              medium: '',
              small: '',
              tiny: '',
            },
          ],
          categories: [],
          grams: 0,
          condition: '',
          options: [],
          skus: [
            {
              productID: '',
              surcharge: 0,
              quantity: 0,
            },
          ],
        },
        shippingOptions: [],
        coupons: [],
        moderators: [],
        termsAndConditions: '',
        refundPolicy: '',
      },
    ],
    buyerOrder: {
      refundAddress: '',
      refundFee: 0,
      shipping: {
        shipTo: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        addressNotes: '',
      },
      buyerID: {
        peerID: '',
        handle: '',
        pubkeys: {
          identity: '',
          bitcoin: '',
        },
        bitcoinSig: '',
      },
      timestamp: '',
      items: [
        {
          listingHash: '',
          quantity: 0,
          quantity64: 0,
          shippingOption: {
            name: '',
            service: '',
          },
          memo: '',
          paymentAddress: '',
        },
      ],
      payment: {
        method: '',
        moderator: '',
        amount: 0,
        chaincode: '',
        address: '',
        redeemScript: '',
        coin: '',
      },
      ratingKeys: [''],
      alternateContactInfo: '',
      version: 2,
    },
    vendorOrderConfirmation: {
      orderID: '',
      timestamp: '',
      paymentAddress: '',
      requestedAmount: 0,
    },
    vendorOrderFulfillment: [
      {
        orderId: '',
        slug: '',
        timestamp: '',
        ratingSignature: {
          metadata: {
            listingSlug: '',
            ratingKey: '',
            listingTitle: '',
            thumbnail: {
              tiny: '',
              small: '',
              medium: '',
              large: '',
              original: '',
            },
          },
          signature: '',
        },
        note: '',
      },
    ],
    buyerOrderCompletion: {
      orderId: '',
      timestamp: '',
      ratings: [
        {
          ratingData: {
            ratingKey: '',
            vendorID: {
              peerID: '',
              handle: '',
              pubkeys: {
                identity: '',
                bitcoin: '',
              },
              bitcoinSig: '',
            },
            vendorSig: {
              metadata: {
                listingSlug: '',
                ratingKey: '',
                listingTitle: '',
                thumbnail: {
                  tiny: '',
                  small: '',
                  medium: '',
                  large: '',
                  original: '',
                },
              },
              signature: '',
            },
            buyerID: {
              peerID: '',
              handle: '',
              pubkeys: {
                identity: '',
                bitcoin: '',
              },
              bitcoinSig: '',
            },
            buyerName: '',
            buyerSig: '',
            timestamp: '',
            overall: 0,
            quality: 0,
            description: 0,
            deliverySpeed: 0,
            customerService: 0,
            review: '',
          },
          signature: '',
        },
      ],
    },
    signatures: [
      {
        section: 'LISTING',
        signatureBytes: '',
      },
      {
        section: 'ORDER',
        signatureBytes: '',
      },
      {
        section: 'ORDER_CONFIRMATION',
        signatureBytes: '',
      },
      {
        section: 'ORDER_FULFILLMENT',
        signatureBytes: '',
      },
      {
        section: 'ORDER_COMPLETION',
        signatureBytes: '',
      },
    ],
  }
  public state: string = ''
  public read: boolean = false
  public funded: boolean = false
  public unreadChatMessages: number = 0
  public paymentAddressTransactions = [
    {
      txid: '',
      value: 0,
      confirmations: 0,
      height: 0,
      timestamp: '',
    },
  ]

  constructor(props?) {
    if (props) {
      Object.assign(props)
    }
  }

  public async create(
    listingHash: string,
    quantity: number,
    memo: string,
    paymentCoin: string,
    coupons?: string
  ): Promise<OrderPaymentInformation> {
    const order = {
      shipTo: '',
      address: '',
      city: '',
      state: '',
      countryCode: '',
      postalCode: '',
      addressNotes: '',
      items: [
        {
          listingHash,
          quantity,
          memo,
          coupons: [],
        },
      ],
      moderator: '',
      paymentCoin,
    }
    try {
      const orderRequest = await Axios.post(`${config.openBazaarHost}/ob/purchase`, order)
      const paymentInformation = orderRequest.data as OrderPaymentInformation
      return paymentInformation
    } catch (e) {
      return e
    }
  }

  public async estimate(
    listingHash: string,
    quantity: number,
    memo: string,
    paymentCoin: string,
    coupons?: string
  ): Promise<number> {
    const order = {
      shipTo: '',
      address: '',
      city: '',
      state: '',
      countryCode: '',
      postalCode: '',
      addressNotes: '',
      items: [
        {
          listingHash,
          quantity,
          memo,
          coupons: [],
        },
      ],
      moderator: '',
      paymentCoin,
    }
    try {
      const estimateRequest = await Axios.post(`${config.openBazaarHost}/ob/estimatetotal`, order)
      const estimate = estimateRequest.data
      return estimate
    } catch (e) {
      return e
    }
  }

  public async fulfill() {
    try {
      await Axios.post(`${config.openBazaarHost}/ob/orderfulfillment`, {
        orderId: this.contract.vendorOrderConfirmation.orderID,
      })
    } catch (e) {
      alert(e.message)
    }
  }

  public async complete() {
    try {
      await Axios.post(`${config.openBazaarHost}/ob/ordercompletion`, {
        orderId: this.contract.vendorOrderConfirmation.orderID,
      })
    } catch (e) {
      alert(e.message)
    }
  }
}

export default Order
