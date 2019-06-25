import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import {
  // AddressCard,
  CheckoutPaymentCard,
  ListingCheckoutCard,
  PaymentQRCard,
} from '../components/Card'
import { FormLabel } from '../components/Label'
import CryptoCurrencies from '../constants/CryptoCurrencies'

import Listing from '../models/Listing'
import Order from '../models/Order'

import './Checkout.css'

const cryptoCurrencies = CryptoCurrencies()

export interface Payment {
  notification: Notification
}

export interface Notification {
  coinType: string
  fundingTotal: number
  notificationId: string
  orderId: string
  type: string
}

interface RouteProps {
  id: string
  quantity: string
}

interface CheckoutProps extends RouteComponentProps<RouteProps> {}

interface CheckoutState {
  [key: string]: any
  amountToPay: string // Includes the amount and its currency
  estimate: number
  isPending: boolean
  isEstimating: boolean
  listing: Listing
  memo: string
  order: Order
  paymentAddress: string
  quantity: number
  selectedCurrency: string
  payment: Notification
}

class Checkout extends Component<CheckoutProps, CheckoutState> {
  private socket: WebSocket
  private modal: React.ReactNode

  constructor(props: CheckoutProps) {
    super(props)
    const listing = new Listing()
    const order = new Order()

    this.state = {
      amountToPay: '',
      estimate: 0,
      isPending: false,
      isEstimating: false,
      listing,
      memo: '',
      order,
      paymentAddress: '',
      quantity: 1,
      selectedCurrency: '',
      payment: {
        coinType: '',
        fundingTotal: 0,
        notificationId: '',
        orderId: '',
        type: '',
      },
    }
    this.copyToClipboard = this.copyToClipboard.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this)
    this.socket = window.socket
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    const quantity = this.props.match.params.quantity
    const listing = await Listing.retrieve(id)

    this.setState({
      listing: listing.listing,
      quantity: Number(quantity),
    })

    this.socket.onmessage = event => {
      const rawData = JSON.parse(event.data)
      if (rawData.notification) {
        const data = JSON.parse(event.data) as Payment
        this.setState(
          {
            payment: data.notification,
          },
          () => {
            window.UIkit.modal(this.modal).show()
          }
        )
      }
    }
  }

  public componentWillUnmount() {
    window.UIkit.modal(this.modal).hide()
  }

  public render() {
    const { listing, isPending, quantity, amountToPay, paymentAddress } = this.state
    return (
      <div id="checkout-container" className="uk-flex uk-flex-row uk-margin">
        <div id="checkout-order-summary" className="uk-flex uk-flex-column uk-padding-small">
          <div className="uk-margin-bottom">
            <ListingCheckoutCard listing={listing} quantity={quantity} />
          </div>
          {isPending ? (
            <div>
              <PaymentQRCard
                address={paymentAddress}
                amount={amountToPay}
                handleCopyToClipboard={this.copyToClipboard}
                cryptocurrency={this.state.selectedCurrency}
                handlePay={() => alert('Feature coming soon')}
              />
            </div>
          ) : (
            <div>
              {/* <div className="uk-margin-bottom">
                // TODO: Update shipping address
                <AddressCard
                  header="Shipping Address"
                  location={{
                    latitude: '105.1',
                    longitude: '12.2',
                    addressOne: 'Yellow House',
                    addressTwo: 'San Isidro',
                    city: 'Iloilo City',
                    country: 'ph',
                    plusCode: '14+E21',
                    state: 'Iloilo',
                    zipCode: '5000',
                  }}
                  handleSelectAddress={() => {
                    // TODO: Update method
                  }}
                />
              </div> */}
              <div className="uk-margin-bottom">
                <div className="uk-card uk-card-default uk-card-body uk-card-small">
                  <h3>Additional Information</h3>
                  <div className="uk-margin">
                    <FormLabel label="MEMO" />
                    <textarea
                      rows={4}
                      className="uk-textarea"
                      placeholder="Provide additional details for the vendor (Optional)"
                      onChange={e => {
                        this.handleChange('memo', e.target.value)
                      }}
                      value={this.state.memo}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="uk-flex-1 uk-padding-small">
          <CheckoutPaymentCard
            acceptedCurrencies={cryptoCurrencies.filter(crypto => {
              return this.state.listing.metadata.acceptedCurrencies.includes(crypto.value)
            })}
            orderSummary={{
              couponAmount: 0,
              currency: 'USD',
              estimate: this.state.estimate,
              listingAmount: 140,
              shippingAmount: 0,
              subTotalAmount: 140,
              totalAmount: 140,
            }}
            handleOnChange={this.handleChange}
            handlePlaceOrder={this.handlePlaceOrder}
            isPending={this.state.isPending}
            selectedCurrency={this.state.selectedCurrency}
            isEstimating={this.state.isEstimating}
          />
        </div>

        <div id="modal-payment-success" data-uk-modal ref={modal => (this.modal = modal)}>
          <div id="payment-modal" className="uk-modal-dialog uk-modal-body">
            <img width="15%" height="15%" src="/images/check.png" />
            <h4>
              Payment of {this.state.payment.fundingTotal / 100000000} {this.state.payment.coinType}{' '}
              Received!
            </h4>
            <p>Thank you for your purchase!</p>
            <Link to={`/order/${this.state.payment.orderId}`}>Check the status of your order.</Link>
          </div>
        </div>
      </div>
    )
  }

  private copyToClipboard(field: string) {
    navigator.clipboard.writeText(this.state.listing[field])
  }

  private async handleChange(field: string, value: any) {
    if (field === 'selectedCurrency') {
      this.setState({
        isEstimating: true,
      })
      const estimate = await this.state.order.estimate(
        this.state.listing.hash,
        this.state.quantity,
        this.state.memo,
        value
      )
      this.setState({
        estimate,
        isEstimating: false,
      })
    }

    this.setState({
      [field]: value,
    })
  }

  private async handlePlaceOrder() {
    let paymentInformation

    try {
      paymentInformation = await this.state.order.create(
        this.state.listing.hash,
        this.state.quantity,
        this.state.memo,
        this.state.selectedCurrency
      )
    } catch (e) {
      alert(e.message)
      return
    }

    this.setState({
      paymentAddress: paymentInformation.paymentAddress,
      amountToPay: paymentInformation.amount.toString(),
      isPending: true,
    })
  }
}

export default Checkout
