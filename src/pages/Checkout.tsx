import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import {
  // AddressCard,
  CheckoutPaymentCard,
  ListingCheckoutCard,
  ModeratorCard,
  PaymentQRCard,
} from '../components/Card'
import { FormLabel } from '../components/Label'
import ModeratorInfoModal from '../components/Modal/ModeratorInfoModal'
import CryptoCurrencies from '../constants/CryptoCurrencies'

import Listing from '../models/Listing'
import Order from '../models/Order'
import Profile from '../models/Profile'

import Axios from 'axios'
import config from '../config'
import PaymentNotification, { Notification } from '../interfaces/PaymentNotification'
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
  isEstimating: boolean
  listing: Listing
  memo: string
  order: Order
  paymentAddress: string
  quantity: number
  selectedCurrency: string
  payment: Notification
  isPaymentSchemeDirect: boolean
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
      hasFetchedAModerator: false,
      selectedModerator: new Profile(),
      originalModerators: [],
      availableModerators: [],
      selectedModerators: [],
      selectedModeratorID: '',
      isPaymentSchemeDirect: true,
    }
    this.copyToClipboard = this.copyToClipboard.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this)
    this.handleMoreInfo = this.handleMoreInfo.bind(this)
    this.socket = window.socket
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    const quantity = this.props.match.params.quantity
    const listing = await Listing.retrieve(id)

    const profile = await Profile.retrieve()
    const moderatorListResponse = listing.listing.moderators

    const profileIndex = moderatorListResponse.indexOf(profile.peerID)
    moderatorListResponse.splice(profileIndex, 1)

    if (moderatorListResponse.length > 0) {
      await moderatorListResponse.forEach(async (moderatorId, index) => {
        const moderator = await Profile.retrieve(moderatorId)
        const { availableModerators, originalModerators } = this.state
        this.setState({
          availableModerators: [...availableModerators, moderator],
          originalModerators: [...originalModerators, moderator],
        })
        if (index === 0) {
          this.setState({ hasFetchedAModerator: true })
        }
      })
    }

    this.setState({
      listing: listing.listing,
      quantity: Number(quantity),
      profile,
    })

    this.socket.onmessage = event => {
      const rawData = JSON.parse(event.data)
      if (rawData.notification) {
        const data = JSON.parse(event.data) as PaymentNotification
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

  public handleMoreInfo(moderator: Profile) {
    this.setState({ selectedModerator: moderator })
    const moderatorModal = window.UIkit.modal('#moderator-info')
    if (moderatorModal) {
      moderatorModal.show()
    }
  }

  public componentWillUnmount() {
    window.UIkit.modal(this.modal).hide()
  }

  public render() {
    const { listing, isPending, quantity, amountToPay, paymentAddress } = this.state
    return (
      <div id="checkout-container" className="uk-flex uk-flex-row uk-margin background-body">
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
                memo={this.state.memo}
                handlePay={async orderDetails => {
                  const element = document.getElementById('dropID')
                  if (element) {
                    window.UIkit.dropdown(element).hide()
                  }
                  await this.state.order.pay(orderDetails)
                }}
              />
            </div>
          ) : (
            <div>
              {/* TODO: Implementation */}
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
                  <h3>Payment Scheme</h3>
                  <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                    <label>
                      <input
                        className="uk-radio"
                        type="radio"
                        name="isPaymentSchemeDirect"
                        checked={this.state.isPaymentSchemeDirect}
                        onClick={() => {
                          this.setState({
                            isPaymentSchemeDirect: true,
                          })
                        }}
                      />{' '}
                      Direct Payment
                    </label>
                    {listing.moderators.length > 0 ? (
                      <label>
                        <input
                          className="uk-radio"
                          type="radio"
                          name="isPaymentSchemeDirect"
                          checked={!this.state.isPaymentSchemeDirect}
                          onClick={() => {
                            this.setState({
                              isPaymentSchemeDirect: false,
                            })
                          }}
                        />{' '}
                        Moderated Payment
                      </label>
                    ) : null}
                  </div>
                  {!this.state.isPaymentSchemeDirect ? (
                    <div className="uk-margin">
                      {this.state.availableModerators.map((data, index) => {
                        if (data.name) {
                          return (
                            <ModeratorCard
                              key={index}
                              profile={data}
                              currIndex={this.state.selectedModeratorID}
                              handleSelect={() => {
                                this.setState({ selectedModeratorID: data.peerID })
                              }}
                              id={data.peerID}
                            >
                              <a
                                id="moderator-card-more-link"
                                onClick={() => this.handleMoreInfo(data)}
                              >
                                More...
                              </a>
                            </ModeratorCard>
                          )
                        }
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
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
              currency: this.state.listing.metadata.pricingCurrency,
              estimate: this.state.estimate,
              listingAmount: parseFloat(this.state.listing.displayValue),
              shippingAmount: 0,
              subTotalAmount: parseFloat(this.state.listing.displayValue),
              totalAmount: parseFloat(this.state.listing.displayValue),
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
            <img width="15%" height="15%" src={`${process.env.PUBLIC_URL}/images/check.png`} />
            <h4>
              Payment of {this.state.payment.fundingTotal / 100000000} {this.state.payment.coinType}{' '}
              Received!
            </h4>
            <p>Thank you for your purchase!</p>
            <Link to={`/history/purchases/${this.state.payment.orderId}`}>
              Check the status of your order.
            </Link>
          </div>
        </div>
        <ModeratorInfoModal
          handleMessageBtn={() => {
            // TODO: WIP
          }}
          profile={this.state.selectedModerator}
        />
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

    const isOwner = this.state.listing.isOwner
    if (isOwner) {
      window.UIkit.notification('This is how your listing looks like to other users.', {
        status: 'primary',
      })
      return
    }

    try {
      paymentInformation = await this.state.order.create(
        this.state.listing.hash,
        this.state.quantity,
        this.state.memo,
        this.state.selectedCurrency,
        this.state.selectedModeratorID
      )
    } catch (e) {
      window.UIkit.notification(e.message, {
        status: 'warning',
      })
      return
    }

    const order = this.state.order
    order.id = paymentInformation.orderId

    this.setState({
      paymentAddress: paymentInformation.paymentAddress,
      amountToPay: paymentInformation.amount.toString(),
      isPending: true,
      order,
    })
  }
}

export default Checkout
