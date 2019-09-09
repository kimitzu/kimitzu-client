import React from 'react'

import { Button } from '../Button'
import { InputSelector } from '../Input'
import InlineFormFields from './InlineFormFields'

import decodeHtml from '../../utils/Unescape'

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
  uniqueId?: string
}

interface Props {
  coupons: Coupon[]
  handleInputChange: (field: string, value: any, parentField?: string) => void
  handleAddCoupon: () => void
  handleContinue: (event: React.FormEvent) => void
  handleRemoveRow: (type: string, index: number) => void
  handleFullSubmit: (event: React.FormEvent) => void
  isNew: boolean
}

const ListingCouponsForm = ({
  coupons,
  handleAddCoupon,
  handleContinue,
  handleInputChange,
  handleRemoveRow,
  isNew,
  handleFullSubmit,
}: Props) => {
  return (
    <form className="uk-form-stacked uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        {coupons.map((coupon: Coupon, index: number) => {
          return (
            <InlineFormFields
              key={`coupon-${coupon.uniqueId}`}
              sideOptions={[
                <a
                  key={`side-option-one-${index}`}
                  id={`coupon-remove-${index}`}
                  className="uk-icon-link"
                  data-uk-icon="close"
                  onClick={() => handleRemoveRow('coupon', index)}
                />,
              ]}
              fields={[
                {
                  component: (
                    <input
                      id={`coupon-title-${index}`}
                      className="uk-input"
                      type="text"
                      value={decodeHtml(coupon.title)}
                      onChange={event => {
                        coupons[index].title = event.target.value
                        handleInputChange('coupons', coupons, 'listing')
                      }}
                    />
                  ),
                  label: index === 0 ? { name: 'Title' } : undefined,
                },
                {
                  component: (
                    <input
                      id={`coupon-code-${index}`}
                      className="uk-input"
                      type="text"
                      value={coupons[index].discountCode}
                      onChange={event => {
                        coupons[index].discountCode = event.target.value
                        handleInputChange('coupons', coupons, 'listing')
                      }}
                    />
                  ),
                  label: index === 0 ? { name: 'Code' } : undefined,
                },
                {
                  component: (
                    <InputSelector
                      id={`coupon-${index}`}
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
                  label: index === 0 ? { name: 'Value' } : undefined,
                },
              ]}
            />
          )
        })}
        <div>
          <a id="coupon-add" className="add-field" onClick={handleAddCoupon}>
            ADD COUPON +
          </a>
        </div>
      </fieldset>
      <div className="submit-btn-div">
        {!isNew ? (
          <Button
            className="uk-button uk-button-primary uk-margin-small-right"
            onClick={handleFullSubmit}
          >
            UPDATE LISTING
          </Button>
        ) : null}
        <Button
          className={`uk-button ${isNew ? 'uk-button-primary' : 'uk-button-default'}`}
          onClick={handleContinue}
        >
          NEXT
        </Button>
      </div>
    </form>
  )
}

export default ListingCouponsForm
