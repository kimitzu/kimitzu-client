import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import {
  AddressCard,
  CheckoutPaymentCard,
  ListingCheckoutCard,
  PaymentQRCard,
} from '../components/Card'
import { FormLabel } from '../components/Label'

import Listing from '../models/Listing'

import './Checkout.css'

interface RouteProps {
  id: string
}

interface CheckoutProps extends RouteComponentProps<RouteProps> {}

interface CheckoutState {
  listing: Listing
  isPending: boolean
  quantity: number
  qrValue: string
  amountToPay: string // Includes the amount and its currency
  paymentAddress: string
}

class Checkout extends Component<CheckoutProps, CheckoutState> {
  constructor(props: CheckoutProps) {
    super(props)
    const listing = new Listing()
    this.state = {
      listing,
      isPending: false,
      quantity: 1,
      qrValue: '',
      amountToPay: '',
      paymentAddress: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.copyToClipboard = this.copyToClipboard.bind(this)
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    const listing = await Listing.retrieve(id)
    console.log(listing, 'ahjdgfhasjfashjefgve')
    this.setState({
      listing: listing.listing,
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
              />
            </div>
          ) : (
            <div>
              <div className="uk-margin-bottom">
                {/* TODO: Update shipping Address */}
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
              </div>
              <div className="uk-margin-bottom">
                <div className="uk-card uk-card-default uk-card-body uk-card-small">
                  <h3>Additional Information</h3>
                  <div className="uk-margin">
                    <FormLabel label="MEMO" />
                    <input
                      className="uk-input"
                      type="text"
                      placeholder="Provide additional details for the vendor (Optional)"
                      // TODO: update handler and value
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="uk-flex-1 uk-padding-small">
          {/* TODO: update order summary and accepted currencies */}
          <CheckoutPaymentCard
            orderSummary={{
              listingAmount: 140,
              currency: 'USD',
              couponAmount: 10,
              shippingAmount: 20,
              subTotalAmount: 140,
              totalAmount: 140,
            }}
            acceptedCurrencies={[]}
            handleOnChange={this.handleChange}
          />
        </div>
      </div>
    )
  }

  private copyToClipboard(field: string) {
    navigator.clipboard.writeText(this.state.listing[field])
  }

  private handleChange(field: string, value: any) {
    // TODO: add code
  }
}

export default Checkout
