import Axios from 'axios'
import config from '../config'
import CryptoCurrencies from '../constants/CryptoCurrencies'
import { Contract, Order as OrderInterface, OrderPaymentInformation } from '../interfaces/Order'
import Profile from './Profile'

const cryptoCurrencies = CryptoCurrencies().map(crypto => crypto.value)

class Order implements OrderInterface {
  public static getQRCodeValue(crypto: string, address: string, amount: string) {
    switch (crypto.toUpperCase()) {
      case 'TBTC':
      case 'BTC': {
        return `bitcoin:${address}?amount=${amount}`
      }
      case 'TLTC':
      case 'LTC': {
        return `litecoin:${crypto.toLowerCase()}:${address}?amount=${amount}`
      }
      case 'ZEC':
      case 'TZEC': {
        return `zcash:${crypto.toLowerCase()}:${address}?amount=${amount}`
      }
      case 'TBCH':
      case 'BCH': {
        return `bch:${crypto.toLowerCase()}:${address}?amount=${amount}`
      }
      default:
        throw new Error('Unrecognized cryptocurrency: ' + crypto)
    }
  }

  public static async retrieve(id: string): Promise<Order> {
    const orderRequest = await Axios.get(`${config.openBazaarHost}/ob/order/${id}`)
    const order = new Order(orderRequest.data)
    order.vendor = await Profile.retrieve(order.contract.vendorListings[0].vendorID.peerID)
    order.buyer = await Profile.retrieve()
    console.log(order)
    return order
  }

  public vendor?: Profile
  public buyer?: Profile
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
        coin: 'BTC',
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
  public state: string = 'PENDING'
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
      Object.assign(this, props)
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
      paymentInformation.amount = this.calculateCryptoDecimals(paymentInformation.amount)
      return paymentInformation
    } catch (e) {
      throw new Error(e.response.data.reason)
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
      return this.calculateCryptoDecimals(estimate)
    } catch (e) {
      throw e
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

  public get fiatValue(): string {
    const listing = this.contract.vendorListings[0]
    const currency = listing.metadata.pricingCurrency

    if (cryptoCurrencies.includes(currency)) {
      return `${(listing.item.price / listing.metadata.coinDivisibility).toString()} ${currency}`
    }
    const realPrice = listing.item.price / 100
    return `${realPrice.toFixed(2)} ${currency}`
  }

  public get cryptoValue(): string {
    return this.parseCrypto(this.contract.buyerOrder.payment.amount)
  }

  public parseCrypto(value: number): string {
    return `${this.calculateCryptoDecimals(value)} ${this.contract.buyerOrder.payment.coin}`
  }

  public calculateCryptoDecimals(value: number): number {
    return value / 100000000
  }

  public get step(): number {
    switch (this.state) {
      case 'PENDING':
        return 0
      case 'AWAITING_PAYMENT':
        return 0
      case 'AWAITING_PICKUP':
        return 1
      case 'AWAITING_FULFILLMENT':
        return 2
      case 'PARTIALLY_FULFILLED':
        return 2
      case 'FULFILLED':
        return 3
      case 'COMPLETED':
        return 4
      case 'CANCELED':
        return 5
      case 'DECLINED':
        return 6
      case 'REFUNDED':
        return 7
      case 'DISPUTED':
        return 8
      case 'DECIDED':
        return 9
      case 'RESOLVED':
        return 10
      case 'PAYMENT_FINALIZED':
        return 11
      case 'PROCESSING_ERROR':
        return 12
      default:
        throw new Error('Unknown event #' + this.state)
    }
  }
}

export default Order
