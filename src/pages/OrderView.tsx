import React from 'react'

import { RouteComponentProps } from 'react-router'
import { PaymentQRCard, SideMenuWithContentCard } from '../components/Card'
import {
  OrderDetailsSegment,
  OrderSummaryItemSegment,
  SimpleBorderedSegment,
} from '../components/Segment'
import Stepper from '../components/Stepper/Stepper'
import config from '../config'
import PaymentNotification from '../interfaces/PaymentNotification'
import Order from '../models/Order'

interface RouteParams {
  id: string
}

interface OrderViewProps extends RouteComponentProps<RouteParams> {}

interface OrderViewState {
  order: Order
  isLoading: boolean
}

class OrderView extends React.Component<OrderViewProps, OrderViewState> {
  constructor(props) {
    super(props)
    const order = new Order()
    this.state = {
      order,
      isLoading: true,
    }
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    const order = await Order.retrieve(id)
    this.setState({
      order,
      isLoading: false,
    })
    window.socket.onmessage = async message => {
      const info = JSON.parse(message.data)
      if (info.notification) {
        const payment = info as PaymentNotification
        if (payment.notification.orderId === id) {
          const orderUpdate = await Order.retrieve(id)
          this.setState({
            order: orderUpdate,
          })
        }
      }
    }
  }

  public render() {
    return (
      <div className="uk-padding-small full-vh background-body">
        <SideMenuWithContentCard
          isLoading={this.state.isLoading}
          mainContentTitle="SUMMARY"
          menuContent={{
            title: 'PURCHASE HISTORY',
            navItems: [
              {
                label: 'Summary',
              },
              {
                label: 'Discussion',
              },
              {
                label: 'Contact',
              },
            ],
          }}
          mainContent={
            <div className="uk-width-1-1">
              <Stepper
                options={['PENDING', 'PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED']}
                currentIndex={this.state.order.step}
              />
              {this.state.order.step >= 4 ? (
                <div className="uk-margin-bottom">
                  <OrderSummaryItemSegment
                    title="Completed"
                    date={new Date(this.state.order.contract.buyerOrderCompletion.timestamp)}
                  >
                    <SimpleBorderedSegment
                      title={this.state.order.buyer ? this.state.order.buyer!.name : ''}
                      imageSrc={
                        this.state.order.buyer!.avatarHashes.original
                          ? `${config.djaliHost}/djali/media?id=${
                              this.state.order.buyer!.avatarHashes.original
                            }`
                          : ''
                      }
                    >
                      <p className="color-secondary">
                        {
                          this.state.order.contract.buyerOrderCompletion.ratings[0].ratingData
                            .review
                        }
                      </p>
                    </SimpleBorderedSegment>
                  </OrderSummaryItemSegment>
                </div>
              ) : null}
              {this.state.order.step >= 3 ? (
                <div className="uk-margin-bottom">
                  <OrderSummaryItemSegment
                    title="Fullfilled"
                    date={new Date(this.state.order.contract.vendorOrderFulfillment[0].timestamp)}
                  >
                    <SimpleBorderedSegment
                      title={this.state.order.vendor ? this.state.order.vendor!.name : ''}
                      imageSrc={
                        this.state.order.vendor!.avatarHashes.medium
                          ? `${config.djaliHost}/djali/media?id=${
                              this.state.order.vendor!.avatarHashes.medium
                            }`
                          : ''
                      }
                    >
                      <p className="color-secondary">
                        {this.state.order.contract.vendorOrderFulfillment[0].note}
                      </p>
                    </SimpleBorderedSegment>
                  </OrderSummaryItemSegment>
                </div>
              ) : null}
              {this.state.order.step >= 2 ? (
                <>
                  <div className="uk-margin-bottom">
                    <OrderSummaryItemSegment
                      title="Accepted"
                      date={
                        new Date(
                          this.state.order.paymentAddressTransactions[
                            this.state.order.paymentAddressTransactions.length - 1
                          ].timestamp
                        )
                      }
                    >
                      <SimpleBorderedSegment
                        title={this.state.order.vendor ? this.state.order.vendor!.name : ''}
                        imageSrc={
                          this.state.order.vendor!.avatarHashes.medium
                            ? `${config.djaliHost}/djali/media?id=${
                                this.state.order.vendor!.avatarHashes.medium
                              }`
                            : ''
                        }
                      >
                        <p className="color-secondary">Your order is now being processed...</p>
                      </SimpleBorderedSegment>
                    </OrderSummaryItemSegment>
                  </div>
                  <div className="uk-margin-bottom">
                    <OrderSummaryItemSegment
                      title="Payment Details"
                      date={new Date(this.state.order.contract.buyerOrder.timestamp)}
                    >
                      <SimpleBorderedSegment
                        title={`${this.state.order.cryptoValue} to ${
                          this.state.order.vendor
                            ? this.state.order.vendor!.name ||
                              this.state.order.contract.vendorListings[0].vendorID.peerID
                            : this.state.order.contract.vendorOrderConfirmation.paymentAddress
                        }`}
                        icon="check"
                      >
                        <p className="color-secondary">
                          {this.state.order.paymentAddressTransactions[0].confirmations}{' '}
                          confirmations.{' '}
                          {this.state.order.paymentAddressTransactions[0].txid.substr(0, 10)}...{' '}
                          <a className="text-underline uk-margin-small-left">Paid in Full</a>
                        </p>
                      </SimpleBorderedSegment>
                    </OrderSummaryItemSegment>
                  </div>
                </>
              ) : null}
              {this.state.order.step === 0 ? (
                <div className="uk-margin-bottom">
                  <OrderSummaryItemSegment title="Send Payment To">
                    <PaymentQRCard
                      amount={this.state.order
                        .calculateCryptoDecimals(
                          this.state.order.contract.vendorOrderConfirmation.requestedAmount
                        )
                        .toString()}
                      address={this.state.order.contract.vendorOrderConfirmation.paymentAddress}
                      cryptocurrency={this.state.order.contract.buyerOrder.payment.coin}
                      handleCopyToClipboard={field => {
                        console.log(field)
                      }}
                    />
                  </OrderSummaryItemSegment>
                </div>
              ) : null}
              <div className="uk-margin-bottom uk-width-1-1">
                <OrderSummaryItemSegment title="Order Details">
                  <SimpleBorderedSegment>
                    <OrderDetailsSegment
                      listingName={this.state.order.contract.vendorListings[0].item.title}
                      listingThumbnailSrc={`${config.djaliHost}/djali/media?id=${
                        this.state.order.contract.vendorListings[0].item.images[0].medium
                      }`}
                      listingType="SERVICE"
                      quantity={`${this.state.order.contract.buyerOrder.items[0].quantity ||
                        this.state.order.contract.buyerOrder.items[0].quantity64}`}
                      total={`${this.state.order.fiatValue} (${this.state.order.cryptoValue})`}
                      memo={this.state.order.contract.buyerOrder.items[0].memo}
                    />
                  </SimpleBorderedSegment>
                </OrderSummaryItemSegment>
              </div>
            </div>
          }
        />
      </div>
    )
  }
}

export default OrderView
