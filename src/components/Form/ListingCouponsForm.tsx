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
  code: {
    discountCode: string
  }
  discount: {
    percentDiscount?: number
    priceDiscount?: number
    type: string
  }
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
                    value={coupons[index].code.discountCode}
                    onChange={event => {
                      coupons[index].code.discountCode = event.target.value
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
                      value: coupons[index].discount.percentDiscount,
                      onChange: event => {
                        if (coupons[index].discount.type === 'percent') {
                          coupons[index].discount.percentDiscount = parseFloat(event.target.value)
                        } else {
                          coupons[index].discount.priceDiscount = parseFloat(event.target.value)
                        }
                        handleInputChange('coupons', coupons, 'listing')
                      },
                    }}
                    selectProps={{
                      onChange: event => {
                        coupons[index].discount.type = event.target.value
                        if (coupons[index].discount.type === 'percent') {
                          coupons[index].discount.percentDiscount = parseFloat(event.target.value)
                          delete coupons[index].discount.percentDiscount
                        } else {
                          coupons[index].discount.priceDiscount = parseFloat(event.target.value)
                          delete coupons[index].discount.priceDiscount
                        }
                        handleInputChange('coupons', coupons, 'listing')
                      },
                    }}
                    defaultSelectorVal={coupons[index].discount.type}
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
                  value={couponPointer.code.discountCode}
                  onChange={event => {
                    couponPointer.code.discountCode = event.target.value
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
                    value: couponPointer.discount.percentDiscount,
                    onChange: event => {
                      if (couponPointer.discount.type === 'percent') {
                        couponPointer.discount.percentDiscount = parseFloat(event.target.value)
                      } else {
                        couponPointer.discount.priceDiscount = parseFloat(event.target.value)
                      }
                      handleInputChange('coupons', coupons, 'listing')
                    },
                  }}
                  selectProps={{
                    onChange: event => {
                      couponPointer.discount.type = event.target.value
                      if (couponPointer.discount.type === 'percent') {
                        couponPointer.discount.percentDiscount = parseFloat(event.target.value)
                        delete couponPointer.discount.percentDiscount
                      } else {
                        couponPointer.discount.priceDiscount = parseFloat(event.target.value)
                        delete couponPointer.discount.priceDiscount
                      }
                      handleInputChange('coupons', coupons, 'listing')
                    },
                  }}
                  defaultSelectorVal={couponPointer.discount.type}
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
