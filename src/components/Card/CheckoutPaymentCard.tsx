import React from 'react'

import currency from '../../models/Currency'
import Listing from '../../models/Listing'
import { Button } from '../Button'

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
}: Props) => {
  const { discount, shippingAmount, subTotalAmount, totalAmount, estimate } = orderSummary

  const sourceCurrency = listing.metadata.pricingCurrency
  const localCurrencyPrice = listing.toLocalCurrency()

  return (
    <div className="uk-card uk-card-default uk-card-body uk-flex uk-flex-column uk-height-1-1">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <Button
          className="uk-button uk-button-primary"
          showSpinner={isPending}
          onClick={handlePlaceOrder}
        >
          {isPending ? 'PENDING...' : 'PLACE ORDER NOW'}
        </Button>
        <div className="uk-margin">
          <p className="uk-text-center color-secondary">
            {isPending ? 'Awaiting payment...' : 'Clicking will advance you to the payment step'}
          </p>
        </div>
      </div>
      <hr />
      <div className="uk-margin-small-top">
        <h5 className="uk-margin-small-bottom uk-text-bold">Pay Via</h5>
        <div className="uk-form-controls uk-form-controls-text uk-height-1-1 uk-flex uk-flex-column uk-flex-start">
          {acceptedCurrencies.map((option: Option) => (
            <label key={option.value.toString()}>
              <input
                className="uk-radio uk-margin-small-right"
                type="radio"
                checked={option.value.toString() === selectedCurrency}
                onChange={() => handleOnChange('selectedCurrency', option.value)}
                name={option.value.toString()}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
      <div className="uk-margin-top">
        <h5 className="uk-text-bold uk-margin-small-bottom">Order Summary</h5>
        <div>
          <div className="uk-flex">
            <div className="uk-flex-1">
              <label>Listing</label>
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
                <label>Shipping</label>
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
              <label>Subtotal</label>
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
                <label>Coupon</label>
              </div>
              <div className="uk-flex-1 uk-text-right uk-text-bold">
                <label>-{discount}</label>
              </div>
            </div>
          ) : null}
          <div className="uk-flex">
            <div className="uk-flex-1">
              <label>Total</label>
            </div>
            <div className="uk-flex-1 uk-text-right uk-text-bold">
              <label>
                {(totalAmount + Number(shippingAmount)).toFixed(2)} {localCurrencyPrice.currency}
              </label>
            </div>
          </div>
          {isEstimating ? (
            <div className="uk-align-right uk-margin-top">
              <div uk-spinner="ratio: 1" /> Estimating...
            </div>
          ) : null}
          {estimate && !isEstimating ? (
            <div className="uk-flex uk-margin-top">
              <div className="uk-flex-1">
                <label>Estimate</label>
              </div>
              <div className="uk-flex-1 uk-text-right uk-text-bold">
                <label>{`${estimate} ${selectedCurrency}`}</label>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPaymentCard
