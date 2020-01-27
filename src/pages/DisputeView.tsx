import { IonContent, IonPage } from '@ionic/react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import ReactSlider from 'react-slider'

import { Button } from '../components/Button'
import { SideMenuWithContentCard } from '../components/Card'
import GroupChatComponent from '../components/ChatBox/GroupChat'
import { MobileHeader } from '../components/Header'
import { FormLabel } from '../components/Label'
import {
  OrderDetailsSegment,
  OrderSummaryItemSegment,
  SimpleBorderedSegment,
} from '../components/Segment'
import DisputePayoutSegment from '../components/Segment/DisputePayoutSegment'
import { CircleSpinner } from '../components/Spinner'
import Stepper from '../components/Stepper/Stepper'

import PaymentNotification from '../interfaces/PaymentNotification'
import Dispute from '../models/Dispute'
import GroupMessage from '../models/GroupMessage'
import Profile from '../models/Profile'
import decodeHtml from '../utils/Unescape'

import config from '../config'
import { localeInstance } from '../i18n'

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
  private locale = localeInstance.get.localizations

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
    this.handleWebSocket = this.handleWebSocket.bind(this)
    this.renderPage = this.renderPage.bind(this)
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    const dispute = await Dispute.retrieve(id)
    const currentUser = await Profile.retrieve()

    const groupMessage = await GroupMessage.retrieve(id)

    groupMessage.peerIds.push(dispute.vendor!.peerID)
    groupMessage.peerIds.push(dispute.buyer!.peerID)

    if (currentUser.peerID !== dispute.moderator.peerID) {
      groupMessage.peerIds.push(dispute.moderator.peerID)
    }

    this.setState(
      {
        dispute,
        isLoading: false,
        groupMessage,
        id,
      },
      () => {
        window.socket.addEventListener('message', this.handleWebSocket)
      }
    )
  }

  public async handleWebSocket(message) {
    const info = JSON.parse(message.data)
    if (info.notification) {
      const notification = info as PaymentNotification

      if (
        notification.notification.type &&
        ![
          'disputeUpdate',
          'disputeOpen',
          'disputeClose',
          'disputeAccepted',
          'buyerDisputeTimeout',
          'buyerDisputeExpiry',
          'moderatorDisputeExpiry',
          'vendorDisputeTimeout',
        ].includes(notification.notification.type)
      ) {
        return
      }

      if (notification.notification.orderId === this.state.id) {
        const disputeUpdate = await Dispute.retrieve(this.state.id)
        this.setState({
          dispute: disputeUpdate,
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

  public render() {
    return (
      <IonPage translate>
        <MobileHeader showBackBtn />
        <IonContent translate>{this.renderPage()}</IonContent>
      </IonPage>
    )
  }

  private renderPage() {
    const { currentContent, isLoading, dispute: order } = this.state

    if (isLoading) {
      return (
        <div className="uk-flex uk-flex-center uk-flex-middle uk-height-1-1">
          <CircleSpinner message={this.locale.disputeViewPage.spinnerText} />
        </div>
      )
    }

    let content
    let currentTitle

    switch (currentContent) {
      case CONTENT_CONSTANTS.MAIN_CONTENT:
        content = this.renderMainContent()
        currentTitle = this.locale.orderViewPage.summaryText.toUpperCase()
        break
      case CONTENT_CONSTANTS.DISPUTE_FORM:
        content = this.renderDisputeForm()
        currentTitle = this.locale.orderViewPage.disputeOrderHeader.toUpperCase()
        break
      case CONTENT_CONSTANTS.DISCUSSION:
        content = this.renderDiscussionContent()
        currentTitle = this.locale.orderViewPage.discussionText.toUpperCase()
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
            <OrderSummaryItemSegment title={this.locale.orderViewPage.disputeExpiredHeader}>
              <SimpleBorderedSegment>
                <p className="color-secondary">
                  {this.locale.disputeViewPage.disputeExpiredParagraph}
                </p>
              </SimpleBorderedSegment>
            </OrderSummaryItemSegment>
          </div>
        ) : null}

        {dispute.state === 'DISPUTED' ? (
          <div className="uk-margin-bottom">
            <SimpleBorderedSegment>
              <p className="color-secondary">{this.locale.disputeViewPage.disputedNoteParagraph}</p>
            </SimpleBorderedSegment>
          </div>
        ) : null}

        {dispute.step >= 2 ? (
          <div className="uk-margin-bottom">
            <OrderSummaryItemSegment
              title={this.locale.orderViewPage.disputePayoutHeader}
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
          <OrderSummaryItemSegment
            title={this.locale.orderViewPage.disputeStartedHeader}
            date={new Date(dispute.timestamp)}
          >
            <SimpleBorderedSegment
              title={`${dispute.buyer.name} ${this.locale.disputeViewPage.buyerDisputingHeader}`}
              imageSrc={
                dispute.buyer.avatarHashes.medium
                  ? `${config.kimitzuHost}/kimitzu/media?id=${dispute.buyer.avatarHashes.medium}`
                  : `${process.env.PUBLIC_URL}/images/user.svg`
              }
              sideButtons={
                dispute.state === 'DISPUTED' ? (
                  <Button
                    className="uk-button uk-button-primary btn-fix"
                    onClick={e => this.setState({ currentContent: CONTENT_CONSTANTS.DISPUTE_FORM })}
                  >
                    {this.locale.disputeViewPage.resolveSubmitBtnText}
                  </Button>
                ) : null
              }
            >
              <div className="row-text">
                <p className="color-secondary text-fix">{decodeHtml(dispute.claim)}</p>
              </div>
            </SimpleBorderedSegment>
          </OrderSummaryItemSegment>
        </div>

        <div className="uk-margin-bottom">
          <OrderSummaryItemSegment
            title={this.locale.orderViewPage.orderAcceptedHeader}
            date={new Date(dispute.vendorContract.vendorOrderConfirmation.timestamp)}
          >
            <SimpleBorderedSegment
              title={this.locale.orderViewPage.acceptedOrderHeader}
              imageSrc={
                dispute.vendor.avatarHashes.medium
                  ? `${config.kimitzuHost}/kimitzu/media?id=${dispute.vendor.avatarHashes.medium}`
                  : `${process.env.PUBLIC_URL}/images/user.svg`
              }
            >
              <p className="color-secondary">{this.locale.orderViewPage.orderAcceptedParagraph}</p>
            </SimpleBorderedSegment>
          </OrderSummaryItemSegment>
        </div>

        <OrderSummaryItemSegment title={this.locale.orderViewPage.orderDetailsHeader}>
          <SimpleBorderedSegment>
            <OrderDetailsSegment
              listingName={dispute.buyerContract.vendorListings[0].item.title}
              listingThumbnailSrc={`${config.kimitzuHost}/kimitzu/media?id=${dispute.buyerContract.vendorListings[0].item.images[0].medium}`}
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
          <FormLabel
            label={this.locale.disputeViewPage.orderDetailsHeader.toUpperCase()}
            required
          />
          <div className="slider-container-main">
            <div className="slider-stat">
              <div className="perc-left">
                {this.locale.orderViewPage.buyertext} {100 - disputePercentage}%
              </div>
              <div className="perc-right">
                {this.locale.orderViewPage.sellerText} {disputePercentage}%
              </div>
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
          <FormLabel label={this.locale.disputeViewPage.resolutionLabel.toUpperCase()} required />
          <div className="uk-form-controls">
            <textarea
              required
              className="uk-textarea"
              rows={3}
              placeholder={this.locale.disputeViewPage.resolutionPlaceholder}
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
              <Button className="uk-button uk-button-primary" type="submit">
                {this.locale.disputeViewPage.resolutionSubmitBtnText.toUpperCase()}
              </Button>
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
    try {
      await this.state.dispute.settle(
        buyerPercentage,
        sellerPercentage,
        this.state.disputeResolution
      )
      window.UIkit.notification(this.locale.disputeViewPage.resolutionSuccessNotif, {
        status: 'success',
      })
      await this.handleBackBtn(true)
    } catch (e) {
      window.UIkit.notification(
        `${this.locale.disputeViewPage.resolutionFailedNotif}: ` + e.response.data.reason,
        {
          status: 'danger',
        }
      )
    }
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
