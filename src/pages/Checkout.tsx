import {
  IonContent,
  IonItem,
  IonLabel,
  IonPage,
  IonRadio,
  IonRadioGroup,
  isPlatform,
} from '@ionic/react'

import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import {
  CheckoutPaymentCard,
  ListingCheckoutCard,
  ModeratorCard,
  PaymentQRCard,
} from '../components/Card'
import { MobileHeader } from '../components/Header'
import { FormLabel } from '../components/Label'
import ModeratorInfoModal from '../components/Modal/ModeratorInfoModal'
import CryptoCurrencies from '../constants/CryptoCurrencies'

import Listing from '../models/Listing'
import Order from '../models/Order'
import Profile from '../models/Profile'

import ListingExpiredOrNotFound from '../components/Errors/ListingExpiredOrNotFound'
import { CircleSpinner } from '../components/Spinner'
import { localeInstance } from '../i18n'
import PaymentNotification, { Notification } from '../interfaces/PaymentNotification'
import currency from '../models/Currency'

import './Checkout.css'

const cryptoCurrencies = CryptoCurrencies()

interface RouteProps {
  id: string
  quantity: string
}

interface CheckoutProps extends RouteComponentProps<RouteProps> {
  currentUser: Profile
}

interface CheckoutState {
  [key: string]: any
  amountToPay: number
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
  isRequestingPaymentInformation: boolean
  coupon: string
  discount: string
  totalAmount: number
  currentUser: Profile
  isRequestingMerchantAddress: boolean
  isLoading: boolean
}

class Checkout extends Component<CheckoutProps, CheckoutState> {
  private modal: React.ReactNode
  private locale = localeInstance.get.localizations

  constructor(props: CheckoutProps) {
    super(props)
    const listing = new Listing()
    const order = new Order()
    const profile = new Profile()

    this.state = {
      currentUser: profile,
      isLoading: true,
      amountToPay: 0,
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
      isRequestingPaymentInformation: false,
      isRequestingMerchantAddress: false,
      coupon: '',
      discount: '',
      totalAmount: 0,
    }
    this.copyToClipboard = this.copyToClipboard.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this)
    this.handleMoreInfo = this.handleMoreInfo.bind(this)
    this.estimate = this.estimate.bind(this)
    this.renderPage = this.renderPage.bind(this)
    this.renderPaymentSchemes = this.renderPaymentSchemes.bind(this)
  }

  public async componentDidMount() {
    const id = this.props.match.params.id
    const quantity = this.props.match.params.quantity
    const listing = await Listing.retrieve(id)

    const currentUser = this.props.currentUser
    const moderatorListResponse = listing.listing.moderators

    const profileIndex = moderatorListResponse.indexOf(currentUser.peerID)
    if (profileIndex > 0) {
      moderatorListResponse.splice(profileIndex, 1)
    }

    if (moderatorListResponse.length > 0) {
      setTimeout(async () => {
        await Promise.all(
          moderatorListResponse.map(async (moderatorId, index) => {
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
        )
      })
    }

    this.setState({
      isLoading: false,
      listing: listing.listing,
      quantity: Number(quantity),
      currentUser,
      totalAmount: currency.convert(
        listing.listing.item.price * Number(quantity),
        listing.listing.metadata.pricingCurrency,
        currentUser.preferences.fiat
      ).value,
    })

    window.socket.addEventListener('message', event => {
      const rawData = JSON.parse(event.data)
      if (rawData.notification) {
        const data = JSON.parse(event.data) as PaymentNotification
        if (data.notification.type !== 'payment') {
          return
        }

        this.setState(
          {
            payment: data.notification,
          },
          () => {
            window.UIkit.modal(this.modal).show()
          }
        )
      }
    })
  }

  public handleMoreInfo(moderator: Profile) {
    this.setState({ selectedModerator: moderator })
    const moderatorModal = window.UIkit.modal('#moderator-info')
    if (moderatorModal) {
      moderatorModal.show()
    }
  }

  public componentWillUnmount() {
    if (!this.modal) {
      return
    }
    window.UIkit.modal(this.modal).hide()
  }

  public render() {
    return (
      <IonPage>
        <MobileHeader showBackBtn />
        <IonContent>{this.renderPage()}</IonContent>
      </IonPage>
    )
  }

  private renderPage() {
    const {
      listing,
      quantity,
      amountToPay,
      paymentAddress,
      isRequestingPaymentInformation,
      isRequestingMerchantAddress,
      isLoading,
    } = this.state
    const { locale } = this

    if (isLoading) {
      return (
        <div className="uk-flex uk-flex-row uk-flex-center">
          <div className="uk-margin-top">
            <CircleSpinner message={locale.checkoutPage.spinnerText} />
          </div>
        </div>
      )
    }

    if (listing.hasExpired) {
      return <ListingExpiredOrNotFound />
    }

    let interactivePane

    if (!isRequestingPaymentInformation && !isRequestingMerchantAddress) {
      interactivePane = (
        <div>
          <div className="uk-margin-bottom">
            <div className="uk-card uk-card-default uk-card-body uk-card-small">
              <h3>{locale.checkoutPage.couponForm.header}</h3>
              <div className="uk-margin">
                <form
                  onSubmit={async evt => {
                    evt.preventDefault()
                    await this.handleCouponApply()
                  }}
                  className="uk-flex uk-flex-row"
                >
                  <input
                    className="uk-input"
                    placeholder={locale.checkoutPage.couponForm.inputPlaceholder}
                    onChange={e => {
                      this.handleChange('coupon', e.target.value)
                    }}
                    value={this.state.coupon}
                  />
                  <button type="submit" className="uk-button uk-button-primary uk-margin-left">
                    {locale.checkoutPage.couponForm.submitBtnText}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="uk-margin-bottom">
            <div className="uk-card uk-card-default uk-card-body uk-card-small">
              <h3>{locale.checkoutPage.paymentForm.header}</h3>
              <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid" data-uk-grid>
                {this.renderPaymentSchemes()}
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
                            href="/#"
                            id="moderator-card-more-link"
                            onClick={evt => {
                              evt.preventDefault()
                              this.handleMoreInfo(data)
                            }}
                          >
                            {locale.checkoutPage.expandModeratorLink}
                          </a>
                        </ModeratorCard>
                      )
                    }
                    return null
                  })}
                </div>
              ) : null}
            </div>
          </div>
          <div className="uk-margin-bottom">
            <div className="uk-card uk-card-default uk-card-body uk-card-small">
              <h3>{locale.checkoutPage.additionalForm.header}</h3>
              <div className="uk-margin">
                <FormLabel label={locale.checkoutPage.additionalForm.memoLabel} />
                <textarea
                  rows={4}
                  className="uk-textarea"
                  placeholder={locale.checkoutPage.additionalForm.memoPlaceholder}
                  onChange={e => {
                    this.handleChange('memo', e.target.value)
                  }}
                  value={this.state.memo}
                />
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div id="checkout-container" className="uk-margin background-body">
        {listing.isOwner ? (
          <div className="uk-alert-primary uk-padding-small uk-text-center" uk-alert>
            <p>{locale.checkoutPage.listingOwnerHelper}</p>
          </div>
        ) : null}
        <div className="uk-flex uk-flex-row">
          <div id="checkout-order-summary" className="uk-flex uk-flex-column uk-padding-small">
            {isRequestingPaymentInformation ? (
              <div className="uk-margin-bottom">
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
                    try {
                      await this.state.order.pay(orderDetails)
                    } catch (e) {
                      window.UIkit.notification(this.locale.errors[e.response.data.reason], {
                        status: 'danger',
                      })
                    }
                  }}
                />
              </div>
            ) : null}
            {isRequestingMerchantAddress ? (
              <div className="uk-margin-bottom">
                <div className="uk-card uk-card-default uk-card-body uk-card-small">
                  <div className="uk-flex uk-flex-center uk-flex-column uk-text-center">
                    <div className="uk-align-center" uk-spinner="ratio: 3" />
                    <p>{this.locale.checkoutPage.requestAddressParagraph}</p>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="uk-margin-bottom hide-checkout-payment-2">
              <CheckoutPaymentCard
                id="mobile"
                key={this.state.isPending.toString()}
                acceptedCurrencies={cryptoCurrencies.filter(crypto => {
                  return this.state.listing.metadata.acceptedCurrencies.includes(crypto.value)
                })}
                orderSummary={{
                  discount: this.state.discount,
                  estimate: this.state.estimate,
                  listingAmount: Number(this.state.listing.displayValue),
                  shippingAmount: 0,
                  subTotalAmount: Number(this.state.listing.displayValue) * this.state.quantity,
                  totalAmount: this.state.totalAmount,
                }}
                listing={this.state.listing}
                handleOnChange={this.handleChange}
                handlePlaceOrder={this.handlePlaceOrder}
                isPending={this.state.isPending}
                selectedCurrency={this.state.selectedCurrency}
                isEstimating={this.state.isEstimating}
                quantity={this.state.quantity}
              />
            </div>
            <div id="checkout-order-summary" className="uk-flex uk-flex-column">
              <ListingCheckoutCard listing={listing} quantity={quantity} />
              <div className="uk-margin-top">{interactivePane}</div>
            </div>
          </div>
          <div className="uk-flex uk-padding-small uk-width-1-3 hide-checkout-payment">
            <CheckoutPaymentCard
              id="desktop"
              key={this.state.isPending.toString()}
              acceptedCurrencies={cryptoCurrencies.filter(crypto => {
                return this.state.listing.metadata.acceptedCurrencies.includes(crypto.value)
              })}
              orderSummary={{
                discount: this.state.discount,
                estimate: this.state.estimate,
                listingAmount: Number(this.state.listing.displayValue),
                shippingAmount: 0,
                subTotalAmount: Number(this.state.listing.displayValue) * this.state.quantity,
                totalAmount: this.state.totalAmount,
              }}
              listing={this.state.listing}
              handleOnChange={this.handleChange}
              handlePlaceOrder={this.handlePlaceOrder}
              isPending={this.state.isPending}
              selectedCurrency={this.state.selectedCurrency}
              isEstimating={this.state.isEstimating}
              quantity={this.state.quantity}
            />
          </div>

          <div id="modal-payment-success" data-uk-modal ref={modal => (this.modal = modal)}>
            <div id="payment-modal" className="uk-modal-dialog uk-modal-body">
              <img
                width="15%"
                height="15%"
                src={`${process.env.PUBLIC_URL}/images/check.png`}
                alt="check"
              />
              <h4>
                {locale.checkoutPage.receivedPaymentHeader1}{' '}
                <span id="payment-modal-amount">
                  {currency.humanizeCrypto(this.state.payment.fundingTotal)}
                </span>{' '}
                {this.state.payment.coinType} {locale.checkoutPage.receivedPaymentHeader2}
              </h4>
              <p>{locale.checkoutPage.receivedPaymentParagraph}</p>
              <Link to={`/history/purchases/${this.state.payment.orderId}`}>
                {locale.checkoutPage.receivedPaymentLink}
              </Link>
            </div>
          </div>

          <ModeratorInfoModal profile={this.state.selectedModerator} />
        </div>
      </div>
    )
  }

  private renderPaymentSchemes() {
    const { listing, isPaymentSchemeDirect } = this.state
    const { locale } = this
    return isPlatform('mobile') || isPlatform('mobileweb') ? (
      <IonRadioGroup
        onIonChange={e => {
          e.preventDefault()
          this.setState({ isPaymentSchemeDirect: e.detail.value })
        }}
      >
        <IonItem lines="none">
          <IonLabel className="color-primary">
            {locale.checkoutPage.paymentForm.directLabel}
          </IonLabel>
          <IonRadio
            value
            className="uk-margin-small-right"
            slot="start"
            checked={isPaymentSchemeDirect}
          />
        </IonItem>
        {listing.moderators.length > 0 ? (
          <IonItem lines="none">
            <IonLabel className="color-primary">
              {locale.checkoutPage.paymentForm.moderatedPayment}
            </IonLabel>
            <IonRadio
              value={false}
              className="uk-margin-small-right"
              slot="start"
              checked={!isPaymentSchemeDirect}
            />
          </IonItem>
        ) : null}
      </IonRadioGroup>
    ) : (
      <>
        <label>
          <input
            className="uk-radio"
            type="radio"
            name="isPaymentSchemeDirect"
            checked={isPaymentSchemeDirect}
            onClick={() => {
              this.setState({
                isPaymentSchemeDirect: true,
              })
            }}
          />{' '}
          {locale.checkoutPage.paymentForm.directLabel}
        </label>
        {listing.moderators.length > 0 ? (
          <label>
            <input
              className="uk-radio"
              type="radio"
              name="isPaymentSchemeDirect"
              checked={!isPaymentSchemeDirect}
              onClick={() => {
                this.setState({
                  isPaymentSchemeDirect: false,
                })
              }}
            />{' '}
            {locale.checkoutPage.paymentForm.moderatedPayment}
          </label>
        ) : null}
      </>
    )
  }

  private copyToClipboard(field: string) {
    navigator.clipboard.writeText(this.state.listing[field])
  }

  private async handleChange(field: string, value: any) {
    if (field === 'selectedCurrency') {
      await this.estimate(value)
    }

    this.setState({
      [field]: value,
    })
  }

  private async handleCouponApply() {
    if (this.state.selectedCurrency) {
      await this.estimate(this.state.selectedCurrency)
    } else {
      const coupon = this.state.listing.coupons.find(c => this.state.coupon === c.discountCode)

      if (coupon) {
        const localListingCurrency = this.state.listing.toLocalCurrency()
        if (coupon.priceDiscount) {
          const discount = currency.convert(
            Number(coupon.priceDiscount),
            this.state.listing.metadata.pricingCurrency,
            localListingCurrency.currency
          )
          this.setState({
            discount: `${discount.value} ${discount.currency}`,
            totalAmount:
              Number(localListingCurrency.price * this.state.quantity) - Number(discount.value),
          })
        } else {
          this.setState({
            discount: `${coupon.percentDiscount}%`,
            totalAmount:
              ((100 - coupon.percentDiscount!) / 100) *
              Number(localListingCurrency.price * this.state.quantity),
          })
        }
      } else {
        window.UIkit.notification(this.locale.checkoutPage.applyCouponFailNotif, {
          status: 'danger',
        })
      }
    }
  }

  private async estimate(crypto: string) {
    this.setState({
      isEstimating: true,
    })
    try {
      const estimate = await this.state.order.estimate(
        this.state.listing.hash,
        this.state.quantity,
        this.state.memo,
        crypto,
        this.state.coupon
      )
      this.setState({
        estimate,
      })
    } catch (e) {
      window.UIkit.notification(this.locale.errors[e.response.data.reason], {
        status: 'danger',
      })
    }
    this.setState({
      isEstimating: false,
    })
  }

  private async handlePlaceOrder() {
    this.setState({
      isPending: true,
      isRequestingMerchantAddress: true,
    })

    let paymentInformation

    const isOwner = this.state.listing.isOwner
    if (isOwner) {
      window.UIkit.notification(this.locale.checkoutPage.listingOwnerHelper, {
        status: 'primary',
      })
      this.setState({
        isPending: false,
      })
      return
    }

    try {
      paymentInformation = await this.state.order.create(
        this.state.listing.hash,
        this.state.quantity,
        this.state.memo,
        this.state.selectedCurrency,
        this.state.selectedModeratorID,
        this.state.coupon
      )
    } catch (e) {
      window.UIkit.notification(e.response.data.reason, {
        status: 'warning',
      })
      this.setState({
        isPending: false,
        isRequestingMerchantAddress: false,
      })
      return
    }

    const order = this.state.order
    order.id = paymentInformation.orderId

    this.setState({
      amountToPay: paymentInformation.amount,
      isPending: true,
      isRequestingMerchantAddress: false,
      isRequestingPaymentInformation: true,
      order,
      paymentAddress: paymentInformation.paymentAddress,
    })
  }
}

export default Checkout
