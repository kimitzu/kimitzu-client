import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'

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
  listing: Listing
  memo: string
  order: Order
  paymentAddress: string
  qrValue: string
  quantity: number
  selectedCurrency: string
}

class Checkout extends Component<CheckoutProps, CheckoutState> {
  constructor(props: CheckoutProps) {
    super(props)
    const listing = new Listing()
    const order = new Order()

    this.state = {
      amountToPay: '',
      estimate: 0,
      isPending: false,
      listing,
      memo: '',
      order,
      paymentAddress: '',
      qrValue: '',
      quantity: 1,
      selectedCurrency: '',
    }
    this.copyToClipboard = this.copyToClipboard.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this)
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    const quantity = this.props.match.params.quantity
    const listing = await Listing.retrieve(id)

    this.setState({
      listing: listing.listing,
      quantity: Number(quantity),
    })
  }

  public render() {
    const { listing, isPending, quantity, amountToPay, paymentAddress, qrValue } = this.state
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
                qrValue={qrValue}
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
          />
        </div>
      </div>
    )
  }

  private copyToClipboard(field: string) {
    navigator.clipboard.writeText(this.state.listing[field])
  }

  private async handleChange(field: string, value: any) {
    if (field === 'selectedCurrency') {
      const estimate = await this.state.order.estimate(
        this.state.listing.hash,
        this.state.quantity,
        this.state.memo,
        value
      )
      this.setState({
        estimate,
      })
    }

    this.setState({
      [field]: value,
    })
  }

  private async handlePlaceOrder() {
    const paymentInformation = await this.state.order.create(
      this.state.listing.hash,
      this.state.quantity,
      this.state.memo,
      this.state.selectedCurrency
    )
    this.setState({
      paymentAddress: paymentInformation.paymentAddress,
      amountToPay: paymentInformation.amount.toString(),
      qrValue: Order.getQRCodeValue(
        this.state.selectedCurrency,
        paymentInformation.paymentAddress,
        paymentInformation.amount.toString()
      ),
      isPending: true,
    })
  }
}

export default Checkout
