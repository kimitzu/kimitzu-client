import React from 'react'
import { RouteComponentProps } from 'react-router'

import { Button } from '../components/Button'
import { PaymentQRCard, SideMenuWithContentCard } from '../components/Card'
import GroupChatComponent from '../components/ChatBox/GroupChat'
import { FormLabel } from '../components/Label'
import { StarRatingGroup } from '../components/Rating'
import {
  OrderDetailsSegment,
  OrderSummaryItemSegment,
  SimpleBorderedSegment,
} from '../components/Segment'
import Stepper from '../components/Stepper/Stepper'
import config from '../config'
import PaymentNotification from '../interfaces/PaymentNotification'
import { RatingInput } from '../interfaces/Rating'
import GroupMessage from '../models/GroupMessage'
import Order from '../models/Order'

import DisputePayoutSegment from '../components/Segment/DisputePayoutSegment'
import { CircleSpinner } from '../components/Spinner'
import ClientRatings from '../constants/ClientRatings.json'
import OrderRatings from '../constants/OrderRatings.json'
import currency from '../models/Currency'
import decodeHtml from '../utils/Unescape'

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
  orderFulfillRatings: RatingInput[]
  orderCompleteRatings: RatingInput[]
  groupMessage: GroupMessage
  claim: string
  isSendingRequest: boolean
  id: string
  loadingStatus: string
}

const CONTENT_CONSTANTS = {
  MAIN_CONTENT: 0,
  FULFILL_FORM: 1,
  DISCUSSION: 2,
  CONTACT: 3,
  DISPUTE_FORM: 4,
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
      isSendingRequest: false,
      currentContent: CONTENT_CONSTANTS.MAIN_CONTENT,
      note: '',
      review: '',
      isAnonymous: false,
      loadIndicator: LOAD_INDICATOR.NO_LOAD,
      groupMessage,
      orderFulfillRatings: ClientRatings,
      orderCompleteRatings: OrderRatings,
      claim: '',
      id: '',
      loadingStatus: '',
    }
    this.handleBackBtn = this.handleBackBtn.bind(this)
    this.handleFulfillOrderBtn = this.handleFulfillOrderBtn.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFulfillSubmit = this.handleFulfillSubmit.bind(this)
    this.handleCompleteSubmit = this.handleCompleteSubmit.bind(this)
    this.handleRefund = this.handleRefund.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleStarRatingChange = this.handleStarRatingChange.bind(this)
    this.handleOrderDispute = this.handleOrderDispute.bind(this)
    this.handleOrderFundRelease = this.handleOrderFundRelease.bind(this)
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    this.setState({
      loadingStatus: 'Retrieving Order...',
    })
    const order = await Order.retrieve(id)
    this.setState({
      loadingStatus: 'Retrieving Discussions...',
    })
    const groupMessage = await GroupMessage.retrieve(id)

    if (order.role === 'buyer') {
      groupMessage.peerIds.push(order.vendor!.peerID)
    } else {
      groupMessage.peerIds.push(order.buyer!.peerID)
    }

    if (order.contract.buyerOrder.payment.moderator && order.role !== 'moderator') {
      groupMessage.peerIds.push(order.contract.buyerOrder.payment.moderator)
    }

    this.setState({
      order,
      isLoading: false,
      groupMessage,
      id,
    })

    window.socket.onmessage = async message => {
      const info = JSON.parse(message.data)
      if (info.notification && info.notification.type) {
        const payment = info as PaymentNotification
        if (payment.notification.orderId === id) {
          const orderUpdate = await Order.retrieve(id)
          this.setState({
            order: orderUpdate,
          })
        }
      }
      if (info.message) {
        if (info.message.subject !== this.state.id) {
          return
        }
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
    const { currentContent, isLoading, order } = this.state
    let content
    let currentTitle

    if (isLoading) {
      return (
        <div className="uk-flex uk-flex-row uk-flex-center">
          <div className="uk-margin-top">
            <CircleSpinner message={`${this.state.loadingStatus}...`} />
          </div>
        </div>
      )
    }

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
      case CONTENT_CONSTANTS.DISPUTE_FORM:
        content = this.renderDisputeForm()
        currentTitle = 'PREPARE DISPUTE'
        break
      default:
        content = null
    }

    return (
      <div className="uk-padding-small full-vh background-body">
        <SideMenuWithContentCard
          mainContentTitle={currentTitle}
          showBackBtn={currentContent !== CONTENT_CONSTANTS.MAIN_CONTENT}
          handleBackBtn={this.handleBackBtn}
          menuContent={{
            title: order.role === 'buyer' ? 'Purchase' : 'Sale',
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
            ],
          }}
          mainContent={content}
        />
      </div>
    )
  }

  private renderDisputeForm() {
    return (
      <div>
        <p className="uk-text-center uk-text-bold">Order ID#: {this.state.order.id}</p>
        <form className="uk-form uk-flex uk-flex-column uk-flex-center">
          <div>
            <FormLabel label="Claim" required />
            <textarea
              className="uk-textarea uk-width-1-1 uk-height-1-1"
              rows={10}
              cols={75}
              value={this.state.claim}
              onChange={e => this.handleInputChange('claim', e.target.value)}
              placeholder="Prepare a suitable claim that has the most relevant evidence. This can help ensure you have the greatest possible chance of a dispute being found in your favor."
            />
          </div>
          <div className="uk-flex uk-flex-center uk-margin-top">
            <Button
              className="uk-button uk-button-danger"
              type="submit"
              onClick={this.handleOrderDispute}
              showSpinner={this.state.isSendingRequest}
            >
              Send Claim
            </Button>
          </div>
        </form>
      </div>
    )
  }

  private renderMainContent() {
    const { isAnonymous, loadIndicator, order, orderCompleteRatings, review } = this.state
    const disableReviewTextArea = order.step > 3

    let steps
    let currentStep = order.step

    if (order.step === 7) {
      steps = ['PENDING', 'PAID', 'ACCEPTED', 'REFUNDED']
    } else if (order.step === 11) {
      steps = ['DISPUTED', 'EXPIRED', 'DECIDED', 'RESOLVED']
      currentStep = 1
    } else if (order.step === -1) {
      steps = ['ERROR']
      currentStep = 0
    } else if (order.step >= 8) {
      steps = ['DISPUTED', 'DECIDED', 'RESOLVED']
      currentStep = order.step - 8
    } else {
      steps = ['PENDING', 'PAID', 'ACCEPTED', 'FULFILLED', 'COMPLETED']
    }

    return (
      <div className="uk-width-1-1">
        <Stepper options={steps} currentIndex={currentStep} />
        {order.step === -1 ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment title="Processing Error">
              <SimpleBorderedSegment>
                <p className="color-secondary">
                  There was an error processing this order.{' '}
                  <span className="uk-text-capitalize uk-text-danger">
                    {order.contract.errors!.join(',')}
                  </span>
                </p>
              </SimpleBorderedSegment>
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {order.isDisputeExpired ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment title="Dispute Expired">
              <SimpleBorderedSegment>
                <p className="color-secondary">
                  Time is up! The moderator failed to make a decision in time. The vendor can now
                  claim the funds.
                </p>
              </SimpleBorderedSegment>
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {order.step === 7 ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment
              title="Refunded"
              date={new Date(order.contract.refund!.timestamp)}
            >
              <SimpleBorderedSegment
                title={order.vendor ? order.vendor!.name : ''}
                imageSrc={
                  order.vendor!.avatarHashes.original
                    ? `${config.djaliHost}/djali/media?id=${order.vendor!.avatarHashes.original}`
                    : `${process.env.PUBLIC_URL}/images/user.svg`
                }
              >
                <p className="color-secondary">
                  Order Refunded. Transaction ID:
                  <br />
                  {order.contract.refund!.refundTransaction.txid}
                </p>
              </SimpleBorderedSegment>
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {order.step === 10 ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment
              title="Dispute Closed"
              date={new Date(order.contract.disputeAcceptance!.timestamp)}
            >
              <SimpleBorderedSegment
                title={`${
                  this.state.order.contract.disputeAcceptance!.closedByProfile.name
                } accepted the dispute payout.`}
                imageSrc={
                  order.contract.disputeAcceptance!.closedByProfile.avatarHashes.medium
                    ? `${config.djaliHost}/djali/media?id=${
                        order.contract.disputeAcceptance!.closedByProfile.avatarHashes.medium
                      }`
                    : `${process.env.PUBLIC_URL}/images/user.svg`
                }
              />
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {order.step >= 9 && order.step < 11 ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment
              title="Dispute Payout"
              date={new Date(order.contract.disputeResolution!.timestamp)}
            >
              <SimpleBorderedSegment
                sideButtons={
                  order.step === 9 ? (
                    <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-around">
                      <Button
                        className="uk-button uk-button-default uk-margin-small-left max-content-width button-small-padding"
                        onClick={this.handleOrderFundRelease}
                        showSpinner={this.state.isSendingRequest}
                      >
                        Release Funds
                      </Button>
                    </div>
                  ) : null
                }
              >
                <div className="uk-flex uk-flex-column">
                  <DisputePayoutSegment
                    name={order.vendor!.name}
                    avatar={order.vendor!.avatarHashes.medium}
                    amount={order.parseCrypto(
                      order.contract.disputeResolution!.payout.vendorOutput
                        ? order.contract.disputeResolution!.payout.vendorOutput.amount
                        : 0
                    )}
                  />
                  <DisputePayoutSegment
                    name={order.buyer!.name}
                    avatar={order.buyer!.avatarHashes.medium}
                    amount={order.parseCrypto(
                      order.contract.disputeResolution!.payout.buyerOutput
                        ? order.contract.disputeResolution!.payout.buyerOutput.amount
                        : 0
                    )}
                  />
                  <DisputePayoutSegment
                    name={order.moderator!.name}
                    avatar={order.moderator!.avatarHashes.medium}
                    amount={order.parseCrypto(
                      order.contract.disputeResolution!.payout.moderatorOutput
                        ? order.contract.disputeResolution!.payout.moderatorOutput.amount
                        : 0
                    )}
                    note={order.contract.disputeResolution!.resolution}
                  />
                </div>
              </SimpleBorderedSegment>
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {order.step >= 8 ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment
              title="Dispute Started"
              date={new Date(order.contract.dispute!.timestamp)}
            >
              <SimpleBorderedSegment title={'The order is being disputed:'}>
                <p className="color-secondary">{decodeHtml(order.contract.dispute!.claim)}</p>
              </SimpleBorderedSegment>
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {order.contract.dispute && order.step === 8 ? (
          <div className="uk-margin-bottom">
            <SimpleBorderedSegment
              title="Disputing Order..."
              sideButtons={
                <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-around">
                  <Button
                    className="uk-button uk-button-default uk-margin-small-left max-content-width button-small-padding"
                    onClick={() => {
                      this.setState({
                        currentContent: CONTENT_CONSTANTS.DISCUSSION,
                      })
                    }}
                  >
                    Discuss Order
                  </Button>
                </div>
              }
            >
              <p className="color-secondary">
                The order is being disputed. The moderator has approximately an hour to process the
                dispute and make a decision.
              </p>
            </SimpleBorderedSegment>
          </div>
        ) : null}
        {order.step >= 2 && order.isPaymentModerated && !order.contract.dispute ? (
          <div className="uk-margin-bottom">
            <SimpleBorderedSegment
              title="Dispute Order"
              sideButtons={
                <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-around">
                  <Button
                    className="uk-button uk-button-danger uk-margin-small-left max-content-width button-small-padding"
                    onClick={() => {
                      this.setState({
                        currentContent: CONTENT_CONSTANTS.DISPUTE_FORM,
                      })
                    }}
                  >
                    DISPUTE
                  </Button>
                </div>
              }
            >
              <p className="uk-text-danger">
                This order can be disputed for 6 blocks or approximately an hour. The clock will
                start when the funding payment is confirmed.
              </p>
              <p className="uk-text-muted">
                Once the clock expires, the vendor can claim payment and finalize the order without
                support from the moderator.
              </p>
            </SimpleBorderedSegment>
          </div>
        ) : null}
        {order.step === 4 ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment
              title="Completed"
              date={new Date(order.contract.buyerOrderCompletion.timestamp)}
            >
              <SimpleBorderedSegment
                title={order.buyer ? order.buyer!.name : ''}
                imageSrc={
                  order.buyer!.avatarHashes.original
                    ? `${config.djaliHost}/djali/media?id=${order.buyer!.avatarHashes.original}`
                    : `${process.env.PUBLIC_URL}/images/user.svg`
                }
              >
                <p className="color-secondary">
                  {decodeHtml(order.contract.buyerOrderCompletion.ratings[0].ratingData.review)}
                </p>
              </SimpleBorderedSegment>
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {order.step === 3 && order.role === 'buyer' ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment title="Order Complete" date={new Date()}>
              <SimpleBorderedSegment title={`${order.buyer!.name}'s review`}>
                <div className="uk-flex-row uk-width-1-1">
                  <form className="uk-form uk-form-stacked uk-width-1-1 uk-flex uk-flex-row">
                    <div className="uk-flex-1 uk-width-1-1 uk-padding-small uk-padding-remove-horizontal">
                      <textarea
                        className="uk-textarea uk-width-1-1 uk-height-1-1"
                        rows={5}
                        style={{
                          border: disableReviewTextArea ? 'none' : '',
                          backgroundColor: '#fff',
                        }}
                        disabled={disableReviewTextArea}
                        value={review}
                        onChange={e => this.handleInputChange('review', e.target.value)}
                      />
                    </div>
                    <StarRatingGroup
                      handleStarRatingChange={this.handleStarRatingChange}
                      ratingType="orderCompleteRatings"
                      ratings={orderCompleteRatings}
                    />
                  </form>
                </div>
              </SimpleBorderedSegment>
              <div className="uk-flex uk-flex-row uk-flex-middle uk-padding-small uk-padding-remove-horizontal">
                <Button
                  className="uk-button uk-button-primary"
                  showSpinner={loadIndicator === LOAD_INDICATOR.COMPLETE}
                  onClick={this.handleCompleteSubmit}
                >
                  COMPLETE ORDER
                </Button>
                {/* <label className="uk-margin-left">
                  <input
                    className="uk-checkbox uk-margin-small-right"
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={() => {
                      this.handleInputChange('isAnonymous', !isAnonymous)
                    }}
                  />
                  Include my name (Seen Publicly)
                </label> */}
              </div>
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {order.step >= 3 && order.step <= 4 ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment
              title="Fulfilled"
              date={new Date(order.contract.vendorOrderFulfillment[0].timestamp)}
            >
              <SimpleBorderedSegment
                title={order.vendor ? order.vendor!.name : ''}
                imageSrc={
                  order.vendor!.avatarHashes.medium
                    ? `${config.djaliHost}/djali/media?id=${order.vendor!.avatarHashes.medium}`
                    : `${process.env.PUBLIC_URL}/images/user.svg`
                }
              >
                <p className="color-secondary">
                  {decodeHtml(order.contract.vendorOrderFulfillment[0].note)}
                </p>
              </SimpleBorderedSegment>
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {order.step >= 2 ? (
          <>
            <div className="uk-margin-bottom">
              <OrderSummaryItemSegment
                title="Accepted"
                date={
                  new Date(
                    order.paymentAddressTransactions[
                      order.paymentAddressTransactions.length - 1
                    ].timestamp
                  )
                }
              >
                <SimpleBorderedSegment
                  title={order.vendor ? order.vendor!.name : ''}
                  imageSrc={
                    order.vendor!.avatarHashes.medium
                      ? `${config.djaliHost}/djali/media?id=${order.vendor!.avatarHashes.medium}`
                      : `${process.env.PUBLIC_URL}/images/user.svg`
                  }
                  sideButtons={
                    order.role === 'vendor' && order.step === 2 ? (
                      <div className="uk-flex uk-flex-row uk-flex-middle uk-flex-around">
                        <a
                          href="#"
                          className="margin-small-right text-underline"
                          id="js-modal-prompt"
                        >
                          Refund
                        </a>
                        <Button
                          className="uk-button uk-button-primary uk-margin-small-left max-content-width button-small-padding"
                          onClick={this.handleFulfillOrderBtn}
                        >
                          FULFILL ORDER
                        </Button>
                      </div>
                    ) : null
                  }
                >
                  {order.role === 'vendor' ? (
                    <p className="color-secondary">
                      You received the order from{' '}
                      <a href={`${config.host}/#/profile/${order.buyer!.peerID}`}>
                        {order.buyer!.name}
                      </a>{' '}
                      and can fulfill it whenever you're ready.
                    </p>
                  ) : (
                    <p className="color-secondary">Your order is now being processed...</p>
                  )}
                </SimpleBorderedSegment>
              </OrderSummaryItemSegment>
            </div>
            <div className="uk-margin-bottom">
              <OrderSummaryItemSegment
                title="Payment Details"
                date={new Date(order.contract.buyerOrder.timestamp)}
              >
                <SimpleBorderedSegment
                  title={`${order.cryptoValue} to ${
                    order.vendor
                      ? order.vendor!.name || order.contract.vendorListings[0].vendorID.peerID
                      : order.contract.vendorOrderConfirmation.paymentAddress
                  }`}
                  icon="check"
                >
                  {order.paymentAddressTransactions.map(paymentTx => {
                    return (
                      <p key={paymentTx.txid} className="color-secondary">
                        {currency.humanizeCrypto(paymentTx.value)}{' '}
                        {order.contract.buyerOrder.payment.coin} - {paymentTx.confirmations}{' '}
                        confirmations. {paymentTx.txid.substr(0, 10)}...{' '}
                        {order.paymentAddressTransactions.length > 1
                          ? 'Partial Payment'
                          : 'Full Payment'}
                      </p>
                    )
                  })}
                </SimpleBorderedSegment>
              </OrderSummaryItemSegment>
            </div>
          </>
        ) : null}
        {order.step === 0 && order.role === 'buyer' ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment title="Send Payment To">
              <PaymentQRCard
                amount={order.contract.buyerOrder.payment.amount}
                address={order.contract.vendorOrderConfirmation.paymentAddress}
                cryptocurrency={order.contract.buyerOrder.payment.coin}
                handleCopyToClipboard={field => {
                  console.log(field)
                }}
                handlePay={async () => {
                  try {
                    await order.pay({
                      wallet: order.contract.buyerOrder.payment.coin,
                      address: order.contract.buyerOrder.payment.address,
                      amount: order.contract.buyerOrder.payment.amount,
                      feeLevel: 'NORMAL',
                      memo: '',
                    })
                    window.UIkit.notification('Payment Sent!', { status: 'success' })
                  } catch (e) {
                    window.UIkit.notification(e.message, { status: 'danger' })
                  }
                }}
              />
            </OrderSummaryItemSegment>
          </div>
        ) : null}
        {order.step === 0 && order.role === 'vendor' ? (
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
                listingName={decodeHtml(order.contract.vendorListings[0].item.title)}
                listingThumbnailSrc={`${config.djaliHost}/djali/media?id=${order.contract.vendorListings[0].item.images[0].medium}`}
                listingType="SERVICE"
                quantity={`${order.contract.buyerOrder.items[0].quantity ||
                  order.contract.buyerOrder.items[0].quantity64}`}
                total={`${(
                  order.value *
                  (order.contract.buyerOrder.items[0].quantity ||
                    order.contract.buyerOrder.items[0].quantity64)
                ).toFixed(2)} ${order[order.role!].preferences.fiat} (${order.cryptoValue})`}
                memo={decodeHtml(order.contract.buyerOrder.items[0].memo)}
              />
            </SimpleBorderedSegment>
          </OrderSummaryItemSegment>
        </div>
      </div>
    )
  }

  private renderFulfillForm() {
    const { orderFulfillRatings, review, note } = this.state
    return (
      <div className="uk-flex-row uk-width-1-1">
        <StarRatingGroup
          handleStarRatingChange={this.handleStarRatingChange}
          ratingType="orderFulfillRatings"
          ratings={orderFulfillRatings}
        />
        <form className="uk-form uk-form-stacked uk-width-1-1 uk-flex">
          <fieldset className="uk-fieldset uk-width-1-1">
            <div className="uk-margin">
              <FormLabel label="Review" />
              <textarea
                className="uk-textarea uk-width-1-1"
                rows={3}
                value={review}
                onChange={e => this.handleInputChange('review', e.target.value)}
              />
            </div>
            <div className="uk-margin">
              <FormLabel label="Note" />
              <textarea
                className="uk-textarea uk-width-1-1"
                rows={1}
                value={note}
                onChange={e => this.handleInputChange('note', e.target.value)}
              />
            </div>
          </fieldset>
        </form>
        <div className="uk-flex uk-flex-right">
          <Button className="uk-button uk-button-primary" onClick={this.handleFulfillSubmit}>
            Submit
          </Button>
        </div>
      </div>
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
      window.UIkit.notification('Order successfully refunded!', {
        status: 'success',
      })
      window.location.reload()
    } catch (e) {
      window.UIkit.notification('Refund failed: ' + e.message, {
        status: 'danger',
      })
    }
  }

  private async handleCompleteSubmit() {
    this.setState({
      loadIndicator: LOAD_INDICATOR.COMPLETE,
    })
    try {
      await this.state.order.complete(
        this.state.review,
        this.state.orderCompleteRatings,
        this.state.isAnonymous
      )
      window.UIkit.notification('Order completed: ', {
        status: 'success',
      })
      const order = await Order.retrieve(this.state.order.contract.vendorOrderConfirmation.orderID)
      this.setState({
        order,
      })
    } catch (e) {
      window.UIkit.notification(e.message, {
        status: 'danger',
      })
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
      window.UIkit.notification('Order fulfilled: ', {
        status: 'success',
      })
    } catch (e) {
      window.UIkit.notification(e.message, {
        status: 'danger',
      })
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

  private async handleOrderDispute() {
    this.setState({
      isSendingRequest: true,
    })
    await this.state.order.dispute(this.state.claim)
    window.UIkit.notification('Dispute Sent!', {
      status: 'success',
    })
    this.handleBackBtn(true)
    this.setState({
      isSendingRequest: false,
    })
  }

  private async handleOrderFundRelease() {
    this.setState({
      isSendingRequest: true,
    })
    await this.state.order.releaseFunds()
    window.UIkit.notification('Fund released!', {
      status: 'success',
    })
    await this.handleBackBtn(true)
    this.setState({
      isSendingRequest: false,
    })
  }

  private async handleBackBtn(refresh?: boolean) {
    if (refresh) {
      const order = await Order.retrieve(this.state.id)
      this.setState({ currentContent: CONTENT_CONSTANTS.MAIN_CONTENT, order })
    } else {
      this.setState({ currentContent: CONTENT_CONSTANTS.MAIN_CONTENT })
    }
  }
}

export default OrderView
