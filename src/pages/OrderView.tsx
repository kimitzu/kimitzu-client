import React from 'react'
import { RouteComponentProps } from 'react-router'

import { Button } from '../components/Button'
import { SideMenuWithContentCard } from '../components/Card'
import GroupChatComponent from '../components/ChatBox/GroupChat'
import { FormLabel } from '../components/Label'
import { StarRatingGroup } from '../components/Rating'
import OrderBuyerPayment from '../components/Segment/OrderView/OrderBuyerPayment'
import OrderCancelAction from '../components/Segment/OrderView/OrderCancelAction'
import OrderCancelled from '../components/Segment/OrderView/OrderCancelled'
import OrderComplete from '../components/Segment/OrderView/OrderComplete'
import OrderCompleteForm from '../components/Segment/OrderView/OrderCompleteForm'
import OrderConfirmOffline from '../components/Segment/OrderView/OrderConfirmOffline'
import OrderDisputeClaimMessage from '../components/Segment/OrderView/OrderDisputeClaimMessage'
import OrderDisputeClosed from '../components/Segment/OrderView/OrderDisputeClosed'
import OrderDisputeDecided from '../components/Segment/OrderView/OrderDisputeDecided'
import OrderDisputeExpired from '../components/Segment/OrderView/OrderDisputeExpired'
import OrderDisputeInProgress from '../components/Segment/OrderView/OrderDisputeInProgress'
import OrderDisputeOpen from '../components/Segment/OrderView/OrderDisputeOpen'
import OrderErrorSegment from '../components/Segment/OrderView/OrderError'
import OrderFulfill from '../components/Segment/OrderView/OrderFulfill'
import OrderFulfillForm from '../components/Segment/OrderView/OrderFulfillForm'
import OrderPayments from '../components/Segment/OrderView/OrderPayments'
import OrderRefunded from '../components/Segment/OrderView/OrderRefunded'
import OrderSummary from '../components/Segment/OrderView/OrderSummary'
import OrderVendorAwaitingPayment from '../components/Segment/OrderView/OrderVendorAwaitingPayment'
import { CircleSpinner } from '../components/Spinner'
import { Stepper } from '../components/Stepper'
import PaymentNotification from '../interfaces/PaymentNotification'
import { RatingInput } from '../interfaces/Rating'
import GroupMessage from '../models/GroupMessage'
import Order from '../models/Order'

import ClientRatings from '../constants/ClientRatings.json'
import OrderRatings from '../constants/OrderRatings.json'

import OrderVendorDeclined from '../components/Segment/OrderView/OrderVendorDeclined'
import { localeInstance } from '../i18n'

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
  private locale = localeInstance.get.localizations

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
      orderFulfillRatings: [...ClientRatings],
      orderCompleteRatings: [...OrderRatings],
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
    this.handleWebSocket = this.handleWebSocket.bind(this)
    this.handleCancelOrder = this.handleCancelOrder.bind(this)
    this.handleConfirmOfflineOrder = this.handleConfirmOfflineOrder.bind(this)
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    this.setState({
      loadingStatus: this.locale.orderViewPage.retrieveOrderText,
    })
    const order = await Order.retrieve(id)
    this.setState({
      loadingStatus: this.locale.orderViewPage.retrieveDiscussionsText,
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

    if (order.contract.buyerOrderCompletion) {
      const orderCompleteRatings = [...this.state.orderCompleteRatings]
      const ratingData = order.contract.buyerOrderCompletion.ratings[0].ratingData
      orderCompleteRatings[0].value = ratingData.overall
      orderCompleteRatings[1].value = ratingData.quality
      orderCompleteRatings[2].value = ratingData.description
      orderCompleteRatings[3].value = ratingData.deliverySpeed
      orderCompleteRatings[4].value = ratingData.customerService
      this.setState({
        orderCompleteRatings,
      })
    }

    this.setState(
      {
        order,
        isLoading: false,
        groupMessage,
        id,
      },
      () => {
        window.socket.addEventListener('message', this.handleWebSocket)
      }
    )

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

  public async handleWebSocket(message) {
    const info = JSON.parse(message.data)
    if (info.notification && info.notification.type) {
      const payment = info as PaymentNotification
      if (payment.notification.orderId === this.state.id) {
        const orderUpdate = await Order.retrieve(this.state.id)
        this.setState({
          order: orderUpdate,
        })
      }
    }
    if (info.message) {
      if (info.message.subject !== this.state.id) {
        return
      }
      const groupMessage = this.state.groupMessage
      const messages = [...groupMessage.messages, info.message]
      groupMessage.messages = messages
      this.setState({
        groupMessage,
      })
    }
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
        currentTitle = this.locale.orderViewPage.summaryText.toUpperCase()
        break
      case CONTENT_CONSTANTS.FULFILL_FORM:
        content = this.renderFulfillForm()
        currentTitle = this.locale.orderViewPage.fulfillOrderText.toUpperCase()
        break
      case CONTENT_CONSTANTS.DISCUSSION:
        content = this.renderDiscussionContent()
        currentTitle = this.locale.orderViewPage.discussionText.toUpperCase()
        break
      case CONTENT_CONSTANTS.DISPUTE_FORM:
        content = this.renderDisputeForm()
        currentTitle = this.locale.orderViewPage.prepareDisputeText.toUpperCase()
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
            title:
              order.role === 'buyer'
                ? this.locale.orderViewPage.purchaseText
                : this.locale.orderViewPage.saleText,
            navItems: [
              {
                label: this.locale.orderViewPage.summaryText,
                handler: () => {
                  this.handleContentChange(CONTENT_CONSTANTS.MAIN_CONTENT)
                },
              },
              {
                label: this.locale.orderViewPage.discussionText,
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
      <form className="uk-form-stacked uk-flex uk-flex-column uk-width-1-1">
        <div>
          <FormLabel label={this.locale.orderViewPage.disputeForm.claimLabel} required />
          <textarea
            className="uk-textarea uk-width-1-1 uk-height-1-1"
            rows={10}
            cols={75}
            value={this.state.claim}
            onChange={e => this.handleInputChange('claim', e.target.value)}
            placeholder={this.locale.orderViewPage.disputeForm.claimPlaceholder}
          />
        </div>
        <div className="uk-flex uk-flex-center uk-margin-top">
          <Button
            className="uk-button uk-button-danger"
            type="submit"
            onClick={this.handleOrderDispute}
            showSpinner={this.state.isSendingRequest}
          >
            {this.locale.orderViewPage.disputeForm.submitBtnText}
          </Button>
        </div>
      </form>
    )
  }

  private renderMainContent() {
    const { order } = this.state
    const disableReviewTextArea = order.step > 3

    let steps
    let currentStep = order.step

    if (order.step === 7) {
      steps = [
        this.locale.orderViewPage.stepperTexts.pending,
        this.locale.orderViewPage.stepperTexts.paid,
        this.locale.orderViewPage.stepperTexts.accepted,
        this.locale.orderViewPage.stepperTexts.refunded,
      ]
    } else if (order.step === 11) {
      steps = [
        this.locale.orderViewPage.stepperTexts.disputed,
        this.locale.orderViewPage.stepperTexts.expired,
        this.locale.orderViewPage.stepperTexts.decided,
        this.locale.orderViewPage.stepperTexts.resolved,
      ]
      currentStep = 1
    } else if (order.step === -1) {
      steps = [this.locale.orderViewPage.stepperTexts.error]
      currentStep = 0
    } else if (order.step >= 8) {
      steps = [
        this.locale.orderViewPage.stepperTexts.disputed,
        this.locale.orderViewPage.stepperTexts.decided,
        this.locale.orderViewPage.stepperTexts.resolved,
      ]
      currentStep = order.step - 8
    } else if (order.step === 5) {
      steps = [
        this.locale.orderViewPage.stepperTexts.pending,
        this.locale.orderViewPage.stepperTexts.canceled,
      ]
    } else if (order.step === 6) {
      steps = [
        this.locale.orderViewPage.stepperTexts.pending,
        this.locale.orderViewPage.stepperTexts.paid,
        `Declined`,
      ]
    } else {
      steps = [
        this.locale.orderViewPage.stepperTexts.pending,
        this.locale.orderViewPage.stepperTexts.paid,
        this.locale.orderViewPage.stepperTexts.accepted,
        this.locale.orderViewPage.stepperTexts.fulfilled,
        this.locale.orderViewPage.stepperTexts.completed,
      ]
    }

    return (
      <div className="uk-width-1-1 uk-flex uk-flex-column">
        <div className="uk-width-1-1">
          <Stepper options={steps} currentIndex={currentStep} />
          {order.step === 0 && order.funded && order.role === 'vendor' ? (
            <OrderConfirmOffline
              locale={this.locale}
              onConfirmOfflineOrder={this.handleConfirmOfflineOrder}
            />
          ) : null}
          {order.step === -1 ? <OrderErrorSegment locale={this.locale} order={order} /> : null}
          {order.isDisputeExpired ? <OrderDisputeExpired locale={this.locale} /> : null}
          {order.step === 7 ? <OrderRefunded locale={this.locale} order={order} /> : null}
          {order.step === 10 ? <OrderDisputeClosed locale={this.locale} order={order} /> : null}
          {order.step >= 9 && order.step < 11 ? (
            <OrderDisputeDecided
              locale={this.locale}
              order={order}
              handleOrderFundRelease={this.handleOrderFundRelease}
              isSendingRequest={this.state.isSendingRequest}
            />
          ) : null}
          {order.step >= 8 ? <OrderDisputeClaimMessage locale={this.locale} order={order} /> : null}
          {order.contract.dispute && order.step === 8 ? (
            <OrderDisputeInProgress
              locale={this.locale}
              handleChangeCurrentContent={this.handleContentChange}
            />
          ) : null}
          {order.step === 5 ? <OrderCancelled locale={this.locale} order={order} /> : null}
          {order.step >= 2 && order.isPaymentModerated && !order.contract.dispute ? (
            <OrderDisputeOpen
              locale={this.locale}
              handleChangeCurrentContent={this.handleContentChange}
            />
          ) : null}
          {order.step === 4 ? <OrderComplete locale={this.locale} order={order} /> : null}
          {order.step === 3 && order.role === 'buyer' ? (
            <OrderCompleteForm
              locale={this.locale}
              order={order}
              disableReviewTextArea={disableReviewTextArea}
              review={
                this.state.order.contract.buyerOrderCompletion
                  ? this.state.order.contract.buyerOrderCompletion.ratings[0].ratingData.review
                  : ''
              }
              orderCompleteRatings={this.state.orderCompleteRatings}
              handleCompleteSubmit={this.handleCompleteSubmit}
            />
          ) : null}
          {order.step >= 3 && order.step <= 4 ? (
            <OrderFulfill locale={this.locale} order={order} />
          ) : null}
          {order.step === 6 ? <OrderVendorDeclined locale={this.locale} order={order} /> : null}
          {order.step >= 2 && order.step !== 5 && order.step !== 6 ? (
            <OrderFulfillForm
              locale={this.locale}
              order={order}
              handleChangeCurrentContent={this.handleContentChange}
            />
          ) : null}
          {(order.step > 0 || order.funded) && order.paymentAddressTransactions.length > 1 ? (
            <OrderPayments locale={this.locale} order={order} />
          ) : null}
          {order.step === 0 &&
          order.role === 'buyer' &&
          order.paymentAddressTransactions.length >= 1 ? (
            <OrderCancelAction
              locale={this.locale}
              order={order}
              handleCancelOrder={this.handleCancelOrder}
            />
          ) : null}
          {order.step === 0 &&
          order.role === 'buyer' &&
          order.paymentAddressTransactions.length < 1 ? (
            <OrderBuyerPayment locale={this.locale} order={order} />
          ) : null}
          {order.step === 0 && order.role === 'vendor' && !order.funded ? (
            <OrderVendorAwaitingPayment locale={this.locale} />
          ) : null}
          <OrderSummary locale={this.locale} order={order} />
        </div>
      </div>
    )
  }

  private renderFulfillForm() {
    const { orderFulfillRatings, review, note } = this.state
    return (
      <div className="uk-flex-row uk-width-1-1">
        <form className="uk-form uk-form-stacked uk-width-1-1 uk-flex uk-flex-row">
          <fieldset className="uk-fieldset uk-flex-1 uk-width-1-1 uk-padding-small uk-padding-remove-horizontal">
            <div className="uk-margin">
              <FormLabel label="Review" />
              <textarea
                className="uk-textarea uk-width-1-1"
                rows={4}
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
          <StarRatingGroup
            handleStarRatingChange={this.handleStarRatingChange}
            ratingType="orderFulfillRatings"
            ratings={orderFulfillRatings}
          />
        </form>
        <div className="uk-flex uk-flex-center">
          <Button
            className="uk-button uk-button-primary"
            onClick={this.handleFulfillSubmit}
            showSpinner={this.state.loadIndicator === LOAD_INDICATOR.FULFILL}
          >
            {this.locale.orderViewPage.fulfillOrderForm.submitBtnText}
          </Button>
        </div>
      </div>
    )
  }

  private async handleConfirmOfflineOrder(confirm: boolean) {
    try {
      await this.state.order.confirmOfflineOrder(confirm)
      window.UIkit.notification(
        confirm
          ? this.locale.orderConfirmOffline.orderAccepted
          : this.locale.orderConfirmOffline.orderRejected,
        {
          status: 'success',
        }
      )
      window.location.reload()
    } catch (e) {
      window.UIkit.notification(e.response.data.reason || e.message, {
        status: 'danger',
      })
    }
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
      window.UIkit.notification(this.locale.orderViewPage.refundSuccessNotif, {
        status: 'success',
      })
      window.location.reload()
    } catch (e) {
      window.UIkit.notification(`${this.locale.orderViewPage.refundErrorNotif}: ${e.message}`, {
        status: 'danger',
      })
    }
  }

  private async handleCompleteSubmit(orderCompleteRatingsCriteria, reviewText) {
    try {
      await this.state.order.complete(
        reviewText,
        orderCompleteRatingsCriteria,
        this.state.isAnonymous
      )
      window.UIkit.notification(`${this.locale.orderViewPage.completedSuccessNotif}`, {
        status: 'success',
      })
      const order = await Order.retrieve(this.state.order.id)
      this.setState({
        order,
      })
    } catch (e) {
      console.log(e.response)
      window.UIkit.notification(e.message, {
        status: 'danger',
      })
    }
  }

  private async handleFulfillSubmit() {
    try {
      this.setState({
        loadIndicator: LOAD_INDICATOR.FULFILL,
      })
      await this.state.order.fulfill(
        this.state.orderFulfillRatings,
        this.state.note,
        this.state.review
      )
      const order = await Order.retrieve(this.state.order.contract.vendorOrderConfirmation.orderID)
      this.setState({
        order,
      })
      window.UIkit.notification(`${this.locale.orderViewPage.fulfilledSuccessNotif}: `, {
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
    window.UIkit.notification(this.locale.orderViewPage.openDisputeSuccessNotif, {
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
    window.UIkit.notification(this.locale.orderViewPage.fundReleaseSuccessNotif, {
      status: 'success',
    })
    await this.handleBackBtn(true)
    this.setState({
      isSendingRequest: false,
    })
  }

  private async handleCancelOrder() {
    await this.state.order.cancel()
    const orderUpdate = await Order.retrieve(this.state.id)
    this.setState({
      order: orderUpdate,
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
