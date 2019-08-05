import React from 'react'
import { RouteComponentProps } from 'react-router'
import ReactSlider from 'react-slider'

import { SideMenuWithContentCard } from '../components/Card'
import GroupChatComponent from '../components/ChatBox/GroupChat'
import { FormLabel } from '../components/Label'
import {
  OrderDetailsSegment,
  OrderSummaryItemSegment,
  SimpleBorderedSegment,
} from '../components/Segment'
import DisputePayoutSegment from '../components/Segment/DisputePayoutSegment'
import Stepper from '../components/Stepper/Stepper'
import config from '../config'
import PaymentNotification from '../interfaces/PaymentNotification'
import Dispute from '../models/Dispute'
import GroupMessage from '../models/GroupMessage'
import './DisputeView.css'

interface RouteParams {
  id: string
  view: string
}

interface DisputeViewProps extends RouteComponentProps<RouteParams> {}

interface DisputeViewState {
  [key: string]: any
  dispute: Dispute
  isLoading: boolean
  currentContent: number
  loadIndicator: number
  groupMessage: GroupMessage
  disputePercentage: number
  disputeResolution: string
  id: string
}

const CONTENT_CONSTANTS = {
  MAIN_CONTENT: 0,
  DISPUTE_FORM: 1,
  DISCUSSION: 2,
  CONTACT: 3,
}

const LOAD_INDICATOR = {
  NO_LOAD: 0,
  FULFILL: 1,
  COMPLETE: 2,
}

class DisputeView extends React.Component<DisputeViewProps, DisputeViewState> {
  constructor(props) {
    super(props)
    const dispute = new Dispute()
    const groupMessage = new GroupMessage()
    this.state = {
      dispute,
      isLoading: true,
      currentContent: CONTENT_CONSTANTS.MAIN_CONTENT,
      loadIndicator: LOAD_INDICATOR.NO_LOAD,
      groupMessage,
      disputePercentage: 0,
      disputeResolution: '',
      isSubmitting: false,
      id: '',
    }
    this.handleBackBtn = this.handleBackBtn.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleDisputeFormSubmit = this.handleDisputeFormSubmit.bind(this)
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    const dispute = await Dispute.retrieve(id)

    const groupMessage = await GroupMessage.retrieve(id)

    groupMessage.peerIds.push(dispute.vendor!.peerID)
    groupMessage.peerIds.push(dispute.buyer!.peerID)
    groupMessage.peerIds.push(dispute.moderator.peerID)

    this.setState({
      dispute,
      isLoading: false,
      groupMessage,
      id,
    })

    window.socket.onmessage = async message => {
      const info = JSON.parse(message.data)
      if (info.notification) {
        const payment = info as PaymentNotification
        if (payment.notification.orderId === id) {
          const disputeUpdate = await Dispute.retrieve(id)
          this.setState({
            dispute: disputeUpdate,
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
  }

  public render() {
    const { currentContent, isLoading, dispute: order } = this.state

    let content
    let currentTitle

    switch (currentContent) {
      case CONTENT_CONSTANTS.MAIN_CONTENT:
        content = this.renderMainContent()
        currentTitle = 'SUMMARY'
        break
      case CONTENT_CONSTANTS.DISPUTE_FORM:
        content = this.renderDisputeForm()
        currentTitle = 'DISPUTE ORDER'
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
          isLoading={isLoading}
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

  private renderMainContent() {
    const { dispute } = this.state
    let options

    if (dispute.isExpired) {
      options = ['Disputed', 'Expired']
    } else {
      options = ['Disputed', 'Decided', 'Closed']
    }

    return (
      <div className="uk-margin-bottom full-width">
        <Stepper options={options} currentIndex={dispute.step} />

        {dispute.isExpired ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment title="Dispute Expired">
              <SimpleBorderedSegment>
                <p className="color-secondary">
                  Time is up! You failed to make a decision in time. The vendor can now claim the
                  funds.
                </p>
              </SimpleBorderedSegment>
            </OrderSummaryItemSegment>
          </div>
        ) : null}

        {dispute.state === 'DISPUTED' ? (
          <div className="uk-margin-bottom">
            <SimpleBorderedSegment>
              <p className="color-secondary">
                You have an hour to process the dispute and make a decision.
              </p>
            </SimpleBorderedSegment>
          </div>
        ) : null}

        {dispute.step >= 2 ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment
              title="Dispute Payout"
              date={new Date(dispute.resolution.timestamp)}
            >
              <SimpleBorderedSegment>
                <div className="uk-flex uk-flex-column">
                  <DisputePayoutSegment
                    name={dispute.vendor!.name}
                    avatar={dispute.vendor!.avatarHashes.medium}
                    amount={dispute.parseCrypto(dispute.resolution.payout.vendorOutput.amount)}
                  />
                  <DisputePayoutSegment
                    name={dispute.buyer!.name}
                    avatar={dispute.buyer!.avatarHashes.medium}
                    amount={dispute.parseCrypto(dispute.resolution.payout.buyerOutput.amount)}
                  />
                  <DisputePayoutSegment
                    name={dispute.moderator!.name}
                    avatar={dispute.moderator!.avatarHashes.medium}
                    amount={dispute.parseCrypto(dispute.resolution.payout.moderatorOutput.amount)}
                    note={dispute.resolution.resolution}
                  />
                </div>
              </SimpleBorderedSegment>
            </OrderSummaryItemSegment>
          </div>
        ) : null}

        <div className="uk-margin-bottom">
          <OrderSummaryItemSegment title="Dispute Started" date={new Date(dispute.timestamp)}>
            <SimpleBorderedSegment
              title={`${dispute.buyer.name} is disputing the order`}
              imageSrc={
                dispute.buyer.avatarHashes.medium
                  ? `${config.djaliHost}/djali/media?id=${dispute.buyer.avatarHashes.medium}`
                  : `/images/user.png`
              }
              sideButtons={
                dispute.state === 'DISPUTED' ? (
                  <button
                    className="uk-button uk-button-primary btn-fix"
                    onClick={e => this.setState({ currentContent: CONTENT_CONSTANTS.DISPUTE_FORM })}
                  >
                    Resolve Dispute
                  </button>
                ) : null
              }
            >
              <div className="row-text">
                <p className="color-secondary text-fix">{dispute.claim}</p>
              </div>
            </SimpleBorderedSegment>
          </OrderSummaryItemSegment>
        </div>

        <div className="uk-margin-bottom">
          <OrderSummaryItemSegment
            title="Accepted"
            date={new Date(dispute.vendorContract.vendorOrderConfirmation.timestamp)}
          >
            <SimpleBorderedSegment
              title="Order Accepted"
              imageSrc={
                dispute.vendor.avatarHashes.medium
                  ? `${config.djaliHost}/djali/media?id=${dispute.vendor.avatarHashes.medium}`
                  : `/images/user.png`
              }
            >
              <p className="color-secondary">The vendor order has accepted the order.</p>
            </SimpleBorderedSegment>
          </OrderSummaryItemSegment>
        </div>

        <OrderSummaryItemSegment title="Order Details">
          <SimpleBorderedSegment>
            <OrderDetailsSegment
              listingName={dispute.buyerContract.vendorListings[0].item.title}
              listingThumbnailSrc={`${config.djaliHost}/djali/media?id=${dispute.buyerContract.vendorListings[0].item.images[0].medium}`}
              listingType="SERVICE"
              quantity={`${dispute.buyerContract.buyerOrder.items[0].quantity ||
                dispute.buyerContract.buyerOrder.items[0].quantity64}`}
              total={`${dispute.fiatValue} (${dispute.cryptoValue})`}
              memo={dispute.buyerContract.buyerOrder.items[0].memo}
            />
          </SimpleBorderedSegment>
        </OrderSummaryItemSegment>
      </div>
    )
  }

  private renderDisputeForm() {
    const { disputePercentage, disputeResolution, isSubmitting } = this.state
    return (
      <form className="full-width" onSubmit={this.handleDisputeFormSubmit}>
        <div className="uk-margin">
          <FormLabel label="PERCENTAGE" required />
          <div className="slider-container-main">
            <div className="slider-stat">
              <div className="perc-left">Buyer {100 - disputePercentage}%</div>
              <div className="perc-right">Seller {disputePercentage}%</div>
            </div>
            <div className="slider-container">
              <ReactSlider
                value={disputePercentage}
                withBars
                min={0}
                max={100}
                barClassName="bar-style"
                onChange={e => {
                  this.setState({ disputePercentage: e })
                }}
              >
                <div className="my-handle" />
              </ReactSlider>
            </div>
          </div>
        </div>
        <div className="uk-margin">
          <FormLabel label="RESOLUTION" required />
          <div className="uk-form-controls">
            <textarea
              required
              className="uk-textarea"
              rows={3}
              placeholder="Details of your dispute resolution"
              value={disputeResolution}
              onChange={event => {
                this.setState({ disputeResolution: event.target.value })
              }}
            />
          </div>
        </div>
        <div className="left-submit">
          <div className="uk-margin-top">
            {isSubmitting ? (
              <div uk-spinner="ratio: 1" />
            ) : (
              <button className="uk-button uk-button-primary" type="submit">
                SUBMIT
              </button>
            )}
          </div>
        </div>
      </form>
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

  private handleInputChange(field: any, value: any) {
    this.setState({
      [field]: value,
    })
  }

  private async handleDisputeFormSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    const buyerPercentage = 100 - this.state.disputePercentage
    const sellerPercentage = this.state.disputePercentage
    await this.state.dispute.settle(buyerPercentage, sellerPercentage, this.state.disputeResolution)
    alert('Resolution sent!')
    await this.handleBackBtn(true)
  }

  private async handleBackBtn(refresh?: boolean) {
    if (refresh) {
      const dispute = await Dispute.retrieve(this.state.id)
      this.setState({ currentContent: CONTENT_CONSTANTS.MAIN_CONTENT, dispute })
    } else {
      this.setState({ currentContent: CONTENT_CONSTANTS.MAIN_CONTENT })
    }
  }
}

export default DisputeView
