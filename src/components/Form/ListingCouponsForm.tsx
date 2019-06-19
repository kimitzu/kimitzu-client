import React from 'react'

import { InputSelector } from '../Input'
import InlineFormFields from './InlineFormFields'

const discountOptions = [
  {
    label: 'Percent',
    value: 'percent',
  },
  {
    label: 'Price',
    value: 'price',
  },
]

interface Coupon {
  title: string
  discountCode: string
  percentDiscount?: number
  priceDiscount?: number
  type: string
}

interface Props {
  coupons: Coupon[]
  handleInputChange: (field: string, value: any, parentField?: string) => void
  handleAddCoupon: () => void
  handleContinue: (event: React.FormEvent) => void
  handleRemoveRow: (type: string, index: number) => void
}

const ListingCouponsForm = ({
  coupons,
  handleAddCoupon,
  handleContinue,
  handleInputChange,
  handleRemoveRow,
}: Props) => {
  const couponPointer = coupons[0]
  const remainingCoupons = coupons.slice(1, coupons.length)
  return (
    <form className="uk-form-stacked uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        {couponPointer ? (
          <InlineFormFields
            sideOptions={[
              <a
                key="side-option-one"
                className="uk-icon-link"
                data-uk-icon="close"
                onClick={
                  coupons.length > 1
                    ? () => handleRemoveRow('coupon', 0)
                    : () => {
                        /* TODO: Add toast of simple alert */
                      }
                }
              />,
            ]}
            fields={[
              {
                component: (
                  <input
                    className="uk-input"
                    type="text"
                    value={couponPointer.title}
                    onChange={event => {
                      couponPointer.title = event.target.value
                      handleInputChange('coupons', coupons, 'listing')
                    }}
                  />
                ),
                label: {
                  name: 'TITLE',
                  required: true,
                },
              },
              {
                component: (
                  <input
                    className="uk-input"
                    type="text"
                    value={couponPointer.discountCode}
                    onChange={event => {
                      couponPointer.discountCode = event.target.value
                      handleInputChange('coupons', coupons, 'listing')
                    }}
                  />
                ),
                label: {
                  name: 'COUPON CODE',
                  required: true,
                },
              },
              {
                component: (
                  <InputSelector
                    options={discountOptions}
                    inputProps={{
                      value: couponPointer.percentDiscount || couponPointer.priceDiscount || 0,
                      onChange: event => {
                        if (couponPointer.type === 'percent') {
                          couponPointer.percentDiscount = parseFloat(event.target.value)
                        } else {
                          couponPointer.priceDiscount = parseFloat(event.target.value)
                        }
                        handleInputChange('coupons', coupons, 'listing')
                      },
                    }}
                    selectProps={{
                      onChange: event => {
                        couponPointer.type = event.target.value
                        if (couponPointer.type === 'percent') {
                          couponPointer.percentDiscount = couponPointer.priceDiscount
                          delete couponPointer.priceDiscount
                        } else {
                          couponPointer.priceDiscount = couponPointer.percentDiscount
                          delete couponPointer.percentDiscount
                        }
                        handleInputChange('coupons', coupons, 'listing')
                      },
                    }}
                    defaultSelectorVal={couponPointer.type}
                  />
                ),
                label: {
                  name: 'DISCOUNT',
                  required: true,
                },
              },
            ]}
          />
        ) : null}
        {remainingCoupons.map((coupon: Coupon, index: number) => {
          const couponIndex = index + 1
          return (
            <InlineFormFields
              key={`coupons${couponIndex}`}
              sideOptions={[
                <a
                  key={`side-option-one-${couponIndex}`}
                  className="uk-icon-link"
                  data-uk-icon="close"
                  onClick={() => handleRemoveRow('coupon', couponIndex)}
                />,
              ]}
              fields={[
                {
                  component: (
                    <input
                      className="uk-input"
                      type="text"
                      value={coupon.title}
                      onChange={event => {
                        coupons[couponIndex].title = event.target.value
                        handleInputChange('coupons', coupons, 'listing')
                      }}
                    />
                  ),
                },
                {
                  component: (
                    <input
                      className="uk-input"
                      type="text"
                      value={coupons[couponIndex].discountCode}
                      onChange={event => {
                        coupons[couponIndex].discountCode = event.target.value
                        handleInputChange('coupons', coupons, 'listing')
                      }}
                    />
                  ),
                },
                {
                  component: (
                    <InputSelector
                      options={discountOptions}
                      inputProps={{
                        value:
                          coupons[couponIndex].percentDiscount ||
                          coupons[couponIndex].priceDiscount,
                        onChange: event => {
                          if (coupons[couponIndex].type === 'percent') {
                            coupons[couponIndex].percentDiscount = parseFloat(event.target.value)
                          } else {
                            coupons[couponIndex].priceDiscount = parseFloat(event.target.value)
                          }
                          handleInputChange('coupons', coupons, 'listing')
                        },
                      }}
                      selectProps={{
                        onChange: event => {
                          coupons[couponIndex].type = event.target.value
                          if (coupons[couponIndex].type === 'percent') {
                            coupons[couponIndex].percentDiscount =
                              coupons[couponIndex].priceDiscount
                            delete coupons[couponIndex].priceDiscount
                          } else {
                            coupons[couponIndex].priceDiscount =
                              coupons[couponIndex].percentDiscount
                            delete coupons[couponIndex].percentDiscount
                          }
                          handleInputChange('coupons', coupons, 'listing')
                        },
                      }}
                      defaultSelectorVal={coupons[couponIndex].type}
                    />
                  ),
                },
              ]}
            />
          )
        })}
        <div>
          <a className="add-field" onClick={handleAddCoupon}>
            ADD COUPON +
          </a>
        </div>
      </fieldset>
      <div className="submit-btn-div">
        <button className="uk-button uk-button-primary" onClick={handleContinue}>
          CONTINUE
        </button>
      </div>
    </form>
  )
}

export default ListingCouponsForm
