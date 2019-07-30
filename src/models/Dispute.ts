import Axios from 'axios'
import config from '../config'
import CryptoCurrencies from '../constants/CryptoCurrencies'
import { Dispute as DisputeInterface, RContract } from '../interfaces/Dispute'
import { Contract, DisputeResolution } from '../interfaces/Order'
import Profile from './Profile'

const cryptoCurrencies = CryptoCurrencies().map(crypto => crypto.value)

class Dispute implements DisputeInterface {
  public static async retrieve(id: string): Promise<Dispute> {
    const orderRequest = await Axios.get(`${config.openBazaarHost}/ob/case/${id}`)
    const dispute = new Dispute(orderRequest.data)
    dispute.vendor = await Profile.retrieve(
      dispute.vendorContract.vendorListings[0].vendorID.peerID
    )
    dispute.buyer = await Profile.retrieve(dispute.buyerContract.buyerOrder.buyerID.peerID)
    dispute.moderator = await Profile.retrieve()
    dispute.role = 'moderator'
    dispute.id = dispute.buyerContract.vendorOrderConfirmation.orderID

    if (dispute.isExpired) {
      dispute.state = 'EXPIRED'
    }

    return dispute
  }

  public id: string = ''
  public moderator: Profile = new Profile()
  public vendor: Profile = new Profile()
  public buyer: Profile = new Profile()
  public role: string = ''
  public timestamp: string = ''
  public buyerContract: RContract = {
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
          pricingCurrency: 'USD',
          language: '',
          escrowTimeoutHours: 1,
          coinType: '',
          coinDivisibility: 100000000,
          priceModifier: 0,
          serviceRateMethod: 'PER_HOUR',
          serviceClassification: '',
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
          condition: 'New',
          skus: [
            {
              productID: '',
              surcharge: 0,
              quantity: 0,
            },
          ],
        },
        moderators: [],
        termsAndConditions: '',
        refundPolicy: '',
        location: {
          latitude: '',
          longitude: '',
          plusCode: '',
          addressOne: '',
          addressTwo: '',
          city: '',
          state: '',
          country: 'PH',
          zipCode: '',
        },
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
        moderatorKey: '',
        coin: '',
      },
      ratingKeys: [],
      alternateContactInfo: '',
      version: 2,
    },
    vendorOrderConfirmation: {
      orderID: '',
      timestamp: '',
      paymentAddress: '',
      requestedAmount: 0,
      ratingSignatures: [],
    },
    vendorOrderFulfillment: [],
    signatures: [],
  }
  public vendorContract: RContract = {
    vendorListings: [],
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
      items: [],
      payment: {
        method: '',
        moderator: '',
        amount: 0,
        chaincode: '',
        address: '',
        redeemScript: '',
        moderatorKey: '',
        coin: '',
      },
      ratingKeys: [],
      alternateContactInfo: '',
      version: 2,
    },
    vendorOrderConfirmation: {
      orderID: '',
      timestamp: '',
      paymentAddress: '',
      requestedAmount: 0,
      ratingSignatures: [],
    },
    vendorOrderFulfillment: [
      {
        orderId: '',
        slug: '',
        timestamp: '',
        payout: {
          sigs: [],
          payoutAddress: '',
          payoutFeePerByte: 0,
        },
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
        buyerRating: {
          comment: '',
          slug: '',
          orderId: '',
          fields: [],
        },
      },
    ],
    signatures: [],
  }
  public state: string = 'DISPUTED'
  public read: boolean = false
  public buyerOpened: boolean = false
  public claim: string = ''
  public unreadChatMessages: number = 0
  public resolution: DisputeResolution = {
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
  }

  constructor(props?) {
    if (props) {
      Object.assign(this, props)
    }
  }

  public async settle(buyerPercentage: number, vendorPercentage: number, resolution: string) {
    await Axios.post(`${config.openBazaarHost}/ob/closedispute`, {
      orderId: this.id,
      buyerPercentage,
      vendorPercentage,
      resolution,
    })
  }

  public get fiatValue(): string {
    const listing = this.buyerContract.vendorListings[0]
    const currency = listing.metadata.pricingCurrency

    if (cryptoCurrencies.includes(currency)) {
      return `${(listing.item.price / listing.metadata.coinDivisibility).toString()} ${currency}`
    }
    const realPrice = listing.item.price / 100
    return `${realPrice.toFixed(2)} ${currency}`
  }

  public get cryptoValue(): string {
    return this.parseCrypto(this.buyerContract.buyerOrder.payment.amount)
  }

  public parseCrypto(value: number): string {
    return `${this.calculateCryptoDecimals(value)} ${this.buyerContract.buyerOrder.payment.coin}`
  }

  public calculateCryptoDecimals(value: number): number {
    return value / 100000000
  }

  public get isExpired() {
    const estimatedExpiration = new Date(this.timestamp)
    estimatedExpiration.setMinutes(estimatedExpiration.getMinutes() + 30)
    return new Date(Date.now()) >= estimatedExpiration && !this.resolution.timestamp
  }

  public get step(): number {
    switch (this.state) {
      case 'DISPUTED':
        return 0
      case 'EXPIRED':
        return 1
      case 'RESOLVED':
        return 2
      default:
        throw new Error('Unknown event #' + this.state)
    }
  }
}

export default Dispute
