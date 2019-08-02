import Axios from 'axios'
import config from '../config'
import CryptoCurrencies from '../constants/CryptoCurrencies'
import {
  Contract,
  DisputeResolution,
  Order as OrderInterface,
  OrderPaymentInformation,
  OrdersSpend,
  Refund,
} from '../interfaces/Order'
import Rating from '../interfaces/Rating'
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
    order.buyer = await Profile.retrieve(order.contract.buyerOrder.buyerID.peerID)
    order.id = id

    if (order.contract.buyerOrder.payment.moderator) {
      order.moderator = await Profile.retrieve(order.contract.buyerOrder.payment.moderator)
    }

    if (order.contract.disputeAcceptance) {
      if (order.contract.disputeAcceptance!.closedBy === order.vendor.peerID) {
        order.contract.disputeAcceptance!.closedByProfile = order.vendor
      } else {
        order.contract.disputeAcceptance!.closedByProfile = order.buyer
      }
    }

    const owner = await Profile.retrieve()
    if (order.buyer!.peerID === owner.peerID) {
      order.role = 'buyer'
    } else {
      order.role = 'vendor'
    }

    if (order.isDisputeExpired) {
      order.state = 'DISPUTE_EXPIRED'
    }

    return order
  }

  public id: string = ''
  public moderator?: Profile
  public role?: string
  public vendor?: Profile
  public buyer?: Profile
  public contract: Contract = {
    errors: [],
    disputeResolution: {
      timestamp: '',
      orderId: '',
      proposedBy: '',
      resolution: '',
      payout: {
        sigs: [],
        inputs: [],
        buyerOutput: {
          address: '',
          amount: 0,
        },
        moderatorOutput: {
          address: '',
          amount: 0,
        },
        vendorOutput: {
          address: '',
          amount: 0,
        },
      },
      moderatorRatingSigs: [],
    },
    disputeAcceptance: {
      timestamp: '',
      closedBy: '',
      closedByProfile: new Profile(),
    },
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
    signatures: [],
    refund: {
      orderID: '',
      timestamp: '',
      refundTransaction: {
        txid: '',
        value: 0,
      },
      memo: '',
    },
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
    moderator: string,
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
      moderator,
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

  public async fulfill(ratings: Rating[], note?: string) {
    const parsedRatings = ratings.map(obj => {
      return {
        max: obj.starCount,
        score: obj.value,
        type: obj.index,
        weight: 100,
      }
    })

    const buyerRating = {
      comment: note, // TODO: Change to review because note is a per-transaction note
      fields: parsedRatings,
    }

    try {
      await Axios.post(`${config.openBazaarHost}/ob/orderfulfillment`, {
        orderId: this.contract.vendorOrderConfirmation.orderID,
        note: note || '',
        buyerRating,
      })
    } catch (e) {
      throw e
    }
  }

  public async complete(review: string, anonymous: boolean) {
    try {
      await Axios.post(`${config.openBazaarHost}/ob/ordercompletion`, {
        orderId: this.contract.vendorOrderConfirmation.orderID,
        ratings: [
          {
            slug: this.contract.vendorListings[0].slug,
            overall: 3,
            quality: 4,
            description: 5,
            deliverySpeed: 5,
            customerService: 3,
            review,
            anonymous,
          },
        ],
      })
    } catch (e) {
      throw e
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

  public toCryptoValue(value: number): number {
    return value * 100000000
  }

  public async refund(memo: string) {
    try {
      await Axios.post(`${config.openBazaarHost}/ob/refund`, {
        orderId: this.contract.vendorOrderConfirmation.orderID,
        memo,
      })
    } catch (e) {
      throw e
    }
  }

  public get isPaymentModerated(): boolean {
    return !!this.contract.buyerOrder.payment.moderator
  }

  public async dispute(claim: string) {
    await Axios.post(`${config.openBazaarHost}/ob/opendispute`, {
      orderID: this.id,
      claim,
    })
  }

  public async releaseFunds() {
    await Axios.post(`${config.openBazaarHost}/ob/releasefunds`, {
      orderID: this.id,
    })
  }

  public get isDisputeExpired() {
    if (this.contract.dispute) {
      const estimatedExpiration = new Date(this.contract.dispute!.timestamp)
      estimatedExpiration.setMinutes(estimatedExpiration.getMinutes() + 30)

      return new Date(Date.now()) >= estimatedExpiration && !this.contract.disputeResolution
    }
    return false
  }

  public async pay(orderSpend: OrdersSpend) {
    try {
      await Axios.post(`${config.openBazaarHost}/ob/orderspend`, {
        wallet: orderSpend.wallet,
        address: orderSpend.address,
        amount: this.toCryptoValue(orderSpend.amount),
        feeLevel: orderSpend.feeLevel,
        memo: orderSpend.memo,
        orderID: this.id,
      })
    } catch (e) {
      throw e
    }
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
      case 'DISPUTE_EXPIRED':
        return 9
      case 'DECIDED':
        return 10
      case 'RESOLVED':
        return 11
      case 'PAYMENT_FINALIZED':
        return 12
      case 'PROCESSING_ERROR':
        return -1
      default:
        throw new Error('Unknown event #' + this.state)
    }
  }
}

export default Order
