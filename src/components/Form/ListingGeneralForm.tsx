import React, { useState } from 'react'

import { AutoCompleteSelect, InputSelector } from '../Input'
import { FormLabel } from '../Label'
import { RadioButtons } from '../RadioButton'
import { FormSelector } from '../Selector'
import InlineFormFields from './InlineFormFields'

import ListingTypes from '../../constants/ListingTypes.json'
import ServiceRateMethods from '../../constants/ServiceRateMethods.json'
import ServiceTypes from '../../constants/ServiceTypes.json'
import { Listing } from '../../interfaces/Listing'

const serviceTypeIds = Object.keys(ServiceTypes)

const serviceTypes = serviceTypeIds
  .map(type => {
    const item = {
      label: ServiceTypes[type],
      value: type,
    }
    return item
  })
  .sort((a, b) => {
    if (a.label === b.label) {
      return 0
    }
    return a.label < b.label ? -1 : 1
  })

const currencies = [
  {
    label: 'USD',
    value: 'USD',
  },
]

interface Props {
  data: Listing
  handleContinue: (event: React.FormEvent) => void
}

const ListingGeneralForm = ({ data, handleContinue }: Props) => {
  const skuPointer = data.item.skus[0]

  const [listing, setListing] = useState(data)

  const handleChange = (field, value) => {
    listing[field] = value
    setListing({ ...listing })
  }

  return (
    <form className="uk-form-stacked uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="Occupation Classification" required />
          <div id="form-select" className="uk-form-controls">
            <AutoCompleteSelect
              defaultSelectorVal={listing.metadata.serviceClassification || ''}
              options={serviceTypes}
              onChange={event => {
                const occupationIndex = event.value
                const item = listing.item

                /**
                 * Note: Categories in OpenBazaar are limited to 40 characters
                 */
                item.categories = [occupationIndex]

                const metadata = listing.metadata
                metadata.serviceClassification = occupationIndex

                handleChange('item', item)
                handleChange('metadata', metadata)
              }}
            />
          </div>
        </div>

        <div className="uk-margin">
          <FormLabel label="TITLE" required />
          <input
            id="general-title"
            className="uk-input"
            type="text"
            value={listing.item.title}
            onChange={event => {
              const item = listing.item
              item.title = event.target.value
              handleChange('item', item)
            }}
          />
          <label className="form-label-desciptor">
            Something descriptive that clearly explains your service
          </label>
        </div>
        <InlineFormFields
          fields={[
            {
              component: (
                <FormSelector
                  id="general-type"
                  defaultVal={listing.metadata.contractType}
                  options={ListingTypes}
                  onChange={event => {
                    const metadata = listing.metadata
                    metadata.contractType = event.target.value
                    handleChange('metadata', metadata)
                  }}
                />
              ),
              label: {
                name: 'TYPE',
                required: true,
              },
            },
            {
              component: (
                <InputSelector
                  id="general-price"
                  options={currencies}
                  inputProps={{
                    value: listing.item.price,
                    type: 'number',
                    onChange: event => {
                      const item = listing.item
                      item.price = event.target.value
                      handleChange('item', item)
                    },
                  }}
                  selectProps={{
                    onChange: event => {
                      const metadata = listing.metadata
                      metadata.pricingCurrency = event.target.value
                    },
                  }}
                />
              ),
              label: {
                name: 'PRICE',
                required: true,
              },
              descriptiveLabel: 'Set your price and its currency',
            },
            {
              component: (
                <FormSelector
                  id="general-rate-method"
                  defaultVal={listing.metadata.serviceRateMethod}
                  options={ServiceRateMethods}
                  disabled={listing.metadata.contractType !== 'SERVICE'}
                  onChange={event => {
                    const metadata = listing.metadata
                    metadata.serviceRateMethod = event.target.value
                    handleChange('metadata', metadata)
                  }}
                />
              ),
              label: {
                name: 'RATE METHOD',
                required: true,
              },
              descriptiveLabel: 'How would you like to charge clients?',
            },
          ]}
        />
        <InlineFormFields
          fields={[
            {
              component: (
                <input
                  className="uk-input"
                  type="text"
                  value={skuPointer.quantity < 0 ? '' : skuPointer.quantity}
                  onChange={event => {
                    const value = Number(event.target.value)
                    if (event.target.value === '') {
                      skuPointer.quantity = -1
                    } else if (value || value === 0) {
                      skuPointer.quantity = value
                    } else {
                      skuPointer.quantity = -1
                    }

                    const item = listing.item
                    item.skus = [skuPointer]

                    handleChange('item', item)
                  }}
                />
              ),
              label: {
                name: 'Service Quantity',
              },
              descriptiveLabel:
                'How many service units would you like to offer? (Leave blank if you do not want to use this field).',
            },
            {
              component: (
                <RadioButtons
                  options={[
                    {
                      label: 'Yes',
                      value: true,
                    },
                    {
                      label: 'No',
                      value: false,
                    },
                  ]}
                  selectedVal={listing.nsfw.toString()}
                  handleSelect={selectedItem => {
                    const selectedItemBoolean = selectedItem as boolean
                    handleChange('nsfw', selectedItemBoolean)
                  }}
                />
              ),
              label: {
                name: 'MATURE CONTENT(NSFW, Adult, 18+, etc)',
              },
              descriptiveLabel: 'The overall condition of your listing',
            },
          ]}
        />
        <div className="uk-margin">
          <FormLabel label="DESCRIPTION" />
          <textarea
            id="general-desc"
            className="uk-textarea"
            rows={5}
            value={listing.item.description}
            placeholder="Describe your listing as best as you can.."
            onChange={event => {
              const item = listing.item
              item.description = event.target.value
              handleChange('item', item)
            }}
          />
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

export default ListingGeneralForm
