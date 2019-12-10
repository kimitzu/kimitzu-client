import React from 'react'

import { Button } from '../Button'
import { InputSelector } from '../Input'
import InlineFormFields from './InlineFormFields'

import { localeInstance } from '../../i18n'

import decodeHtml from '../../utils/Unescape'

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
  const {
    localizations,
    localizations: { listingForm },
  } = localeInstance.get

  const discountOptions = [
    {
      label: listingForm.percentLabel,
      value: 'percent',
    },
    {
      label: listingForm.priceLabel,
      value: 'price',
    },
  ]

  return (
    <form className="uk-form-stacked uk-flex uk-flex-column full-width">
      <div className="uk-alert-primary uk-padding-small uk-margin-bottom">
        {listingForm.couponsHelper}
      </div>
      <fieldset className="uk-fieldset">
        {coupons.map((coupon: Coupon, index: number) => {
          return (
            <InlineFormFields
              alwaysShowSideOptions
              key={`coupon-${coupon.uniqueId}`}
              sideOptions={[
                <a
                  href="/#"
                  key={`side-option-one-${index}`}
                  id={`coupon-remove-${index}`}
                  className="uk-icon-link uk-margin-small-left"
                  data-uk-icon="close"
                  onClick={evt => {
                    evt.preventDefault()
                    handleRemoveRow('coupon', index)
                  }}
                >
                  &nbsp;
                </a>,
              ]}
              fields={[
                {
                  component: (
                    <input
                      id={`coupon-title-${index}`}
                      placeholder={listingForm.couponTitlePlaceholder}
                      className="uk-input"
                      type="text"
                      value={decodeHtml(coupon.title)}
                      onChange={event => {
                        coupons[index].title = event.target.value
                        handleInputChange('coupons', coupons, 'listing')
                      }}
                    />
                  ),
                  label:
                    index === 0 ? { name: listingForm.couponTitleLabel.toUpperCase() } : undefined,
                },
                {
                  component: (
                    <input
                      id={`coupon-code-${index}`}
                      placeholder={listingForm.couponCodePlaceholder}
                      className="uk-input"
                      type="text"
                      value={coupons[index].discountCode}
                      onChange={event => {
                        coupons[index].discountCode = event.target.value
                        handleInputChange('coupons', coupons, 'listing')
                      }}
                    />
                  ),
                  label:
                    index === 0 ? { name: listingForm.couponCodeLabel.toUpperCase() } : undefined,
                },
                {
                  component: (
                    <InputSelector
                      id={`coupon-${index}`}
                      options={discountOptions}
                      inputProps={{
                        placeholder: listingForm.couponDiscountPlaceholder,
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
                  label:
                    index === 0
                      ? { name: listingForm.couponDiscountLabel.toUpperCase() }
                      : undefined,
                },
              ]}
            />
          )
        })}
        <div>
          <a id="coupon-add" className="add-field" onClick={handleAddCoupon} href="/#">
            {listingForm.addCouponLink} +
          </a>
        </div>
      </fieldset>
      <div className="submit-btn-div">
        {!isNew ? (
          <Button
            className="uk-button uk-button-primary uk-margin-small-right"
            onClick={handleFullSubmit}
          >
            {listingForm.updateBtnText.toUpperCase()}
          </Button>
        ) : null}
        <Button
          className={`uk-button ${isNew ? 'uk-button-primary' : 'uk-button-default'}`}
          onClick={handleContinue}
        >
          {localizations.nextBtnText.toUpperCase()}
        </Button>
      </div>
    </form>
  )
}

export default ListingCouponsForm
