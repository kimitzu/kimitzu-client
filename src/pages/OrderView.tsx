import React from 'react'
import { RouteComponentProps } from 'react-router'

import { Button } from '../components/Button'
import { PaymentQRCard, SideMenuWithContentCard } from '../components/Card'
import GroupChatComponent from '../components/ChatBox/GroupChat'
import { ReviewForm } from '../components/Form'
import { FormLabel } from '../components/Label'
import {
  OrderDetailsSegment,
  OrderSummaryItemSegment,
  SimpleBorderedSegment,
} from '../components/Segment'
import Stepper from '../components/Stepper/Stepper'
import config from '../config'
import PaymentNotification from '../interfaces/PaymentNotification'
import Rating from '../interfaces/Rating'
import GroupMessage from '../models/GroupMessage'
import Order from '../models/Order'

interface RouteParams {
  id: string
}

interface OrderViewProps extends RouteComponentProps<RouteParams> {}

interface OrderViewState {
  [key: string]: any
  order: Order
  isLoading: boolean
  currentContent: number
  note: string
  review: string
  isAnonymous: boolean
  loadIndicator: number
  orderFulfillRatings: Rating[]
  orderCompleteRatings: Rating[]
  groupMessage: GroupMessage
}

const CONTENT_CONSTANTS = {
  MAIN_CONTENT: 0,
  FULFILL_FORM: 1,
  DISCUSSION: 2,
  CONTACT: 3,
}

const LOAD_INDICATOR = {
  NO_LOAD: 0,
  FULFILL: 1,
  COMPLETE: 2,
}

class OrderView extends React.Component<OrderViewProps, OrderViewState> {
  constructor(props) {
    super(props)
    const order = new Order()
    const groupMessage = new GroupMessage()
    this.state = {
      order,
      isLoading: true,
      currentContent: CONTENT_CONSTANTS.MAIN_CONTENT,
      note: '',
      review: '',
      isAnonymous: false,
      loadIndicator: LOAD_INDICATOR.NO_LOAD,
      groupMessage,
      orderFulfillRatings: [
        {
          index: 0,
          fieldName: 'compensationFairness',
          title: 'Client pays for work outside of the initial scope without complaint',
          value: 0,
          starCount: 5,
        },
        {
          index: 1,
          fieldName: 'carefulReader',
          title: 'Client read the service listing carefully',
          value: 0,
          starCount: 5,
        },
        {
          index: 2,
          fieldName: 'accurateWorkDescription',
          title: 'Client described the scope and nature of the work accurately',
          value: 0,
          starCount: 5,
        },
        {
          index: 3,
          fieldName: 'responsiveness',
          title: 'Client responded swiftly to questions',
          value: 0,
          starCount: 5,
        },
      ],
      orderCompleteRatings: [
        {
          index: 0,
          title: 'Overall',
          fieldName: 'overall',
          value: 0,
          starCount: 5,
        },
        {
          index: 1,
          title: 'Quality',
          fieldName: 'quality',
          value: 0,
          starCount: 5,
        },
        {
          index: 2,
          title: 'As Advertised',
          fieldName: 'asAdvertised',
          value: 0,
          starCount: 5,
        },
        {
          index: 3,
          title: 'Delivery',
          fieldName: 'delivery',
          value: 0,
          starCount: 5,
        },
        {
          index: 4,
          title: 'Service',
          fieldName: 'service',
          value: 0,
          starCount: 5,
        },
      ],
    }
    this.handleBackBtn = this.handleBackBtn.bind(this)
    this.handleFulfillOrderBtn = this.handleFulfillOrderBtn.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFulfillSubmit = this.handleFulfillSubmit.bind(this)
    this.handleCompleteSubmit = this.handleCompleteSubmit.bind(this)
    this.handleRefund = this.handleRefund.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleStarRatingChange = this.handleStarRatingChange.bind(this)
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    const order = await Order.retrieve(id)
    const groupMessage = await GroupMessage.retrieve(id)

    if (order.role === 'buyer') {
      groupMessage.peerIds.push(order.vendor!.peerID)
    } else {
      groupMessage.peerIds.push(order.buyer!.peerID)
    }

    if (order.contract.buyerOrder.payment.moderator) {
      groupMessage.peerIds.push(order.contract.buyerOrder.payment.moderator)
    }

    this.setState({
      order,
      isLoading: false,
      groupMessage,
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
      if (info.message) {
        groupMessage.messages.push(info.message)
        this.setState({
          groupMessage,
        })
      }
    }

    window.UIkit.util.on('#js-modal-prompt', 'click', e => {
      e.preventDefault()
      e.target.blur()
      window.UIkit.modal.prompt(this.renderModal(), ' ').then(async memo => {
        if (memo) {
          memo = memo.trim()
          await this.handleRefund(memo)
        }
      })
    })
  }

  public renderModal() {
    return `
      <div>
        <div class="uk-text-center">
          <p class="uk-text-lead uk-text-primary uk-text-bold">REFUND</p>
          <p class="uk-text-meta">
            <b>Order ID: ${this.state.order.contract.vendorOrderConfirmation.orderID}</b>
          </p>
          <p class="uk-margin-top">Are you sure you want to refund</p>
          <p class="uk-text-bold">
            ${this.state.order.cryptoValue}
          </p>
          <p>to</p>
          <p>
            <span class="uk-text-bold">${this.state.order.contract.buyerOrder.refundAddress}</span>?
          </p>
        </div>
        <hr class="uk-margin" />
        <p>Additional memo:</p>
      </div>
    `
  }

  public render() {
    const { currentContent } = this.state

    let content
    let currentTitle

    switch (currentContent) {
      case CONTENT_CONSTANTS.MAIN_CONTENT:
        content = this.renderMainContent()
        currentTitle = 'SUMMARY'
        break
      case CONTENT_CONSTANTS.FULFILL_FORM:
        content = this.renderFulfillForm()
        currentTitle = 'FULFILL ORDER'
        break
      case CONTENT_CONSTANTS.DISCUSSION:
        content = this.renderDiscussionContent()
        currentTitle = 'DISCUSSION'
        break
      default:
        content = null
    }

    return (
      <div className="uk-padding-small full-vh background-body">
        <SideMenuWithContentCard
          isLoading={this.state.isLoading}
          mainContentTitle={currentTitle}
          showBackBtn={currentContent !== CONTENT_CONSTANTS.MAIN_CONTENT}
          handleBackBtn={this.handleBackBtn}
          menuContent={{
            title: this.state.order.role === 'buyer' ? 'Purchase' : 'Sale',
            navItems: [
              {
                label: 'Summary',
                handler: () => {
                  this.handleContentChange(CONTENT_CONSTANTS.MAIN_CONTENT)
                },
              },
              {
                label: 'Discussion',
                handler: () => {
                  this.handleContentChange(CONTENT_CONSTANTS.DISCUSSION)
                },
              },
              {
                label: 'Contact',
              },
            ],
          }}
          mainContent={content}
        />
      </div>
    )
  }

  private renderMainContent() {
    return (
      <div className="uk-width-1-1">
        <Stepper
          options={
            this.state.order.step === 7
              ? ['PENDING', 'PAID', 'ACCEPTED', 'REFUNDED']
              : ['PENDING', 'PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED']
          }
          currentIndex={this.state.order.step}
        />
        {this.state.order.step === 7 ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment
              title="Refunded"
              date={new Date(this.state.order.contract.refund!.timestamp)}
            >
              <SimpleBorderedSegment
                title={this.state.order.vendor ? this.state.order.vendor!.name : ''}
                imageSrc={
                  this.state.order.vendor!.avatarHashes.original
                    ? `${config.djaliHost}/djali/media?id=${
                        this.state.order.vendor!.avatarHashes.original
                      }`
                    : ''
                }
              >
                <p className="color-secondary">
                  Order Refunded. Transaction ID:
                  <br />
                  {this.state.order.contract.refund!.refundTransaction.txid}
                </p>
              </SimpleBorderedSegment>
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {this.state.order.step === 4 ? (
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
                  {this.state.order.contract.buyerOrderCompletion.ratings[0].ratingData.review}
                </p>
              </SimpleBorderedSegment>
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {this.state.order.step === 3 && this.state.order.role === 'buyer' ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment title="Order Complete" date={new Date()}>
              <SimpleBorderedSegment title={`${this.state.order.buyer!.name}'s review`}>
                <ReviewForm
                  disableTextArea={this.state.order.step > 3}
                  review={this.state.review}
                  ratings={this.state.orderCompleteRatings}
                  inlineDisplay
                  handleChange={this.handleInputChange}
                  ratingType="orderCompleteRatings"
                  handleStarRatingChange={this.handleStarRatingChange}
                />
              </SimpleBorderedSegment>
              <div className="uk-flex uk-flex-row uk-flex-middle uk-padding-small uk-padding-remove-horizontal">
                <Button
                  className="uk-button uk-button-primary"
                  showSpinner={this.state.loadIndicator === LOAD_INDICATOR.COMPLETE}
                  onClick={this.handleCompleteSubmit}
                >
                  COMPLETE ORDER
                </Button>
                <label className="uk-margin-left">
                  <input
                    className="uk-checkbox uk-margin-small-right"
                    type="checkbox"
                    checked={this.state.isAnonymous}
                    onChange={() => {
                      const isAnonymous = !this.state.isAnonymous
                      this.handleInputChange('isAnonymous', isAnonymous)
                    }}
                  />
                  Include my name (Seen Publicly)
                </label>
              </div>
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {this.state.order.step >= 3 && this.state.order.step <= 4 ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment
              title="Fulfilled"
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
                  sideButtons={
                    this.state.order.role === 'vendor' && this.state.order.step === 2 ? (
                      <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-around">
                        <a
                          href="#"
                          className="margin-small-right text-underline"
                          id="js-modal-prompt"
                        >
                          Refund
                        </a>
                        <button
                          className="uk-button uk-button-primary uk-margin-small-left max-content-width button-small-padding"
                          onClick={this.handleFulfillOrderBtn}
                        >
                          FULFILL ORDER
                        </button>
                      </div>
                    ) : null
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
                    {this.state.order.paymentAddressTransactions[0].confirmations} confirmations.{' '}
                    {this.state.order.paymentAddressTransactions[0].txid.substr(0, 10)}...{' '}
                    <a className="text-underline uk-margin-small-left">Paid in Full</a>
                  </p>
                </SimpleBorderedSegment>
              </OrderSummaryItemSegment>
            </div>
          </>
        ) : null}
        {this.state.order.step === 0 && this.state.order.role === 'buyer' ? (
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
        {this.state.order.step === 0 && this.state.order.role === 'vendor' ? (
          <div className="uk-margin-bottom">
            <SimpleBorderedSegment title={`Waiting for buyer to send payment...`} icon="info">
              <p className="color-secondary">
                Buyer has <b>NOT</b> paid for the order, yet.
              </p>
            </SimpleBorderedSegment>
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
    )
  }

  private renderFulfillForm() {
    return (
      <ReviewForm
        handleChange={this.handleInputChange}
        handleStarRatingChange={this.handleStarRatingChange}
        review={this.state.review}
        ratings={this.state.orderFulfillRatings}
        ratingType="orderFulfillRatings"
      >
        <div className="uk-flex uk-flex-right">
          <Button className="uk-button uk-button-primary" onClick={this.handleFulfillSubmit}>
            Submit
          </Button>
        </div>
      </ReviewForm>
    )
  }

  private handleContentChange(index: number) {
    this.setState({
      currentContent: index,
    })
  }

  private renderDiscussionContent() {
    return <GroupChatComponent groupMessage={this.state.groupMessage} />
  }

  private async handleRefund(memo: string) {
    try {
      await this.state.order.refund(memo)
      alert('Order successfully refunded!')
      window.location.reload()
    } catch (e) {
      alert('Refund failed: ' + e.message)
    }
  }

  private async handleCompleteSubmit() {
    this.setState({
      loadIndicator: LOAD_INDICATOR.COMPLETE,
    })
    try {
      await this.state.order.complete(this.state.review, this.state.isAnonymous)
      alert('Order completed!')
      const order = await Order.retrieve(this.state.order.contract.vendorOrderConfirmation.orderID)
      this.setState({
        order,
      })
    } catch (e) {
      alert(e.message)
    }
    this.setState({ loadIndicator: LOAD_INDICATOR.NO_LOAD })
  }

  private async handleFulfillSubmit() {
    try {
      this.setState({
        loadIndicator: LOAD_INDICATOR.FULFILL,
      })
      await this.state.order.fulfill(this.state.orderFulfillRatings, this.state.note)
      const order = await Order.retrieve(this.state.order.contract.vendorOrderConfirmation.orderID)
      this.setState({
        order,
      })
      alert('Order fulfilled!')
    } catch (e) {
      alert(e.message)
    }

    this.setState({
      currentContent: CONTENT_CONSTANTS.MAIN_CONTENT,
      loadIndicator: LOAD_INDICATOR.NO_LOAD,
    })
  }

  private handleInputChange(field: any, value: any) {
    this.setState({
      [field]: value,
    })
  }

  private handleStarRatingChange(index: number, value: number, type: string) {
    const ratings = this.state[type]
    ratings[index].value = value
    this.setState({
      [type]: ratings,
    })
  }

  private handleFulfillOrderBtn() {
    this.setState({ currentContent: CONTENT_CONSTANTS.FULFILL_FORM })
  }

  private handleBackBtn() {
    this.setState({ currentContent: CONTENT_CONSTANTS.MAIN_CONTENT })
  }
}

export default OrderView
