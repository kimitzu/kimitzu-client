import { IonItem, IonLabel, IonLoading, IonRadio, IonRadioGroup, isPlatform } from '@ionic/react'
import React from 'react'

import currency from '../../models/Currency'
import Listing from '../../models/Listing'
import { Button } from '../Button'

import { localeInstance } from '../../i18n'

interface OrderSummary {
  listingAmount: number
  shippingAmount: number
  discount: string
  subTotalAmount: number
  totalAmount: number
  estimate?: number
}

interface Option {
  label: string
  value: string | boolean
}

interface Props {
  isPending: boolean
  handleOnChange: (field: string, value: any, parentField?: string) => void
  handlePlaceOrder?: () => void
  listing: Listing
  orderSummary: OrderSummary
  acceptedCurrencies: Option[]
  selectedCurrency?: string
  isEstimating: boolean
  quantity: number
  id: string
}

const CheckoutPaymentCard = ({
  handleOnChange,
  handlePlaceOrder,
  isPending,
  orderSummary,
  acceptedCurrencies,
  selectedCurrency,
  isEstimating,
  listing,
  quantity,
  id,
}: Props) => {
  const { discount, shippingAmount, subTotalAmount, totalAmount, estimate } = orderSummary
  const { paymentCard } = localeInstance.get.localizations.checkoutPage
  const sourceCurrency = listing.metadata.pricingCurrency
  const localCurrencyPrice = listing.toLocalCurrency()
  const renderSpinner = () => {
    const { estimateSpinnerText } = paymentCard
    return isPlatform('mobile') || isPlatform('mobileweb') ? (
      <IonLoading isOpen={isEstimating} message={estimateSpinnerText} />
    ) : (
      <div className="uk-align-right uk-margin-top" hidden={!isEstimating}>
        <div uk-spinner="ratio: 1" /> {estimateSpinnerText}
      </div>
    )
  }
  const renderPaymentOptions = () => {
    return isPlatform('mobile') || isPlatform('mobileweb') ? (
      <IonRadioGroup
        onIonChange={e => {
          e.preventDefault()
          if (!isEstimating) {
            handleOnChange('selectedCurrency', e.detail.value)
          }
        }}
      >
        {acceptedCurrencies.map((option: Option) => (
          <IonItem key={option.value.toString()}>
            <IonLabel className="color-primary">{option.label}</IonLabel>
            <IonRadio
              className="uk-margin-small-right"
              slot="start"
              value={option.value}
              checked={option.value.toString() === selectedCurrency}
            />
          </IonItem>
        ))}
      </IonRadioGroup>
    ) : (
      acceptedCurrencies.map((option: Option) => (
        <label key={option.value.toString()}>
          <input
            id={`${id}-${option.value}`}
            className="uk-radio uk-margin-small-right"
            type="radio"
            checked={option.value.toString() === selectedCurrency}
            onChange={() => handleOnChange('selectedCurrency', option.value)}
            name={option.value.toString()}
          />
          {option.label}
        </label>
      ))
    )
  }
  return (
    <div className="uk-card uk-card-default uk-card-body uk-flex uk-flex-column uk-height-1-1">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle order-below-checkout-2">
        <Button
          className="uk-button uk-button-primary"
          showSpinner={isPending}
          onClick={handlePlaceOrder}
          id={`${id}-place-order-button`}
        >
          {isPending
            ? paymentCard.afterSubmitOrderBtnText.toUpperCase()
            : paymentCard.submitOrderBtnText.toUpperCase()}
        </Button>
        <div className="uk-margin">
          <p className="uk-text-center color-secondary">
            {isPending ? paymentCard.checkoutHelper1 : paymentCard.checkoutHelper2}
          </p>
        </div>
      </div>
      <hr className="order-below-checkout-2" />
      {isPending ? null : (
        <div className="uk-margin-small-top">
          <h5 className="uk-margin-small-bottom uk-text-bold">{paymentCard.paymentFormHeader}</h5>
          <div className="uk-form-controls uk-form-controls-text uk-height-1-1 uk-flex uk-flex-column uk-flex-start">
            {renderPaymentOptions()}
          </div>
        </div>
      )}
      <div className="uk-margin-top">
        <h5 className="uk-text-bold uk-margin-small-bottom">{paymentCard.summaryHeader}</h5>
        <div>
          <div className="uk-flex">
            <div className="uk-flex-1">
              <label>{paymentCard.listingLabel}</label>
            </div>
            <div className="uk-flex-1 uk-text-right uk-text-bold">
              <label>
                {localCurrencyPrice.price.toFixed(2)} {localCurrencyPrice.currency} x {quantity}
              </label>
            </div>
          </div>
          {shippingAmount! >= 0 ? (
            <div className="uk-flex">
              <div className="uk-flex-1">
                <label>{paymentCard.shippingLabel}</label>
              </div>
              <div className="uk-flex-1 uk-text-right uk-text-bold">
                <label>
                  {currency
                    .convert(shippingAmount, sourceCurrency, localCurrencyPrice.currency)
                    .toFixed(2)}{' '}
                  {localCurrencyPrice.currency}
                </label>
              </div>
            </div>
          ) : null}
        </div>
        <div className="uk-margin-top">
          <div className="uk-flex">
            <div className="uk-flex-1">
              <label>{paymentCard.subtotalLabel}</label>
            </div>
            <div className="uk-flex-1 uk-text-right uk-text-bold">
              <label>
                {currency
                  .convert(subTotalAmount, sourceCurrency, localCurrencyPrice.currency)
                  .toFixed(2)}{' '}
                {localCurrencyPrice.currency}
              </label>
            </div>
          </div>
          {discount ? (
            <div className="uk-flex">
              <div className="uk-flex-1">
                <label>{paymentCard.couponLabel}</label>
              </div>
              <div className="uk-flex-1 uk-text-right uk-text-bold">
                <label>-{discount}</label>
              </div>
            </div>
          ) : null}
          <div className="uk-flex">
            <div className="uk-flex-1">
              <label>{paymentCard.totalLabel}</label>
            </div>
            <div className="uk-flex-1 uk-text-right uk-text-bold">
              <label>
                {(totalAmount + Number(shippingAmount)).toFixed(2)} {localCurrencyPrice.currency}
              </label>
            </div>
          </div>
          {renderSpinner()}
          {estimate && !isEstimating ? (
            <div className="uk-flex uk-margin-top">
              <div className="uk-flex-1">
                <label>{paymentCard.estimateLabel}</label>
              </div>
              <div className="uk-flex-1 uk-text-right uk-text-bold">
                <label>{`${estimate} ${selectedCurrency}`}</label>
              </div>
            </div>
          ) : null}
          <hr className="order-below-checkout" />
          <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle order-below-checkout">
            <Button
              className="uk-button uk-button-primary"
              showSpinner={isPending}
              onClick={handlePlaceOrder}
            >
              {isPending
                ? paymentCard.afterSubmitOrderBtnText.toUpperCase()
                : paymentCard.submitOrderBtnText.toUpperCase()}
            </Button>
            <div className="uk-margin">
              <p className="uk-text-center color-secondary">
                {isPending ? paymentCard.checkoutHelper1 : paymentCard.checkoutHelper2}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPaymentCard
