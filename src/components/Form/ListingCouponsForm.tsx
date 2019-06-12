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
}

const ListingCouponsForm = ({
  coupons,
  handleAddCoupon,
  handleContinue,
  handleInputChange,
}: Props) => {
  const couponPointer = coupons[coupons.length - 1]
  const remainingCoupons = coupons.slice(0, coupons.length - 1)
  return (
    <form className="uk-form-stacked uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        {remainingCoupons.map((coupon: Coupon, index: number) => (
          <InlineFormFields
            key={`coupons${index}`}
            fields={[
              {
                component: (
                  <input
                    className="uk-input"
                    type="text"
                    value={coupon.title}
                    onChange={event => {
                      coupons[index].title = event.target.value
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
                    value={coupons[index].discountCode}
                    onChange={event => {
                      coupons[index].discountCode = event.target.value
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
                      value: coupons[index].percentDiscount || coupons[index].priceDiscount,
                      onChange: event => {
                        if (coupons[index].type === 'percent') {
                          coupons[index].percentDiscount = parseFloat(event.target.value)
                        } else {
                          coupons[index].priceDiscount = parseFloat(event.target.value)
                        }
                        handleInputChange('coupons', coupons, 'listing')
                      },
                    }}
                    selectProps={{
                      onChange: event => {
                        coupons[index].type = event.target.value
                        if (coupons[index].type === 'percent') {
                          coupons[index].percentDiscount = coupons[index].priceDiscount
                          delete coupons[index].priceDiscount
                        } else {
                          coupons[index].priceDiscount = coupons[index].percentDiscount
                          delete coupons[index].percentDiscount
                        }
                        handleInputChange('coupons', coupons, 'listing')
                      },
                    }}
                    defaultSelectorVal={coupons[index].type}
                  />
                ),
              },
            ]}
          />
        ))}
        <InlineFormFields
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
