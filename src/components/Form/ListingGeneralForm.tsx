import React from 'react'

import { InputSelector } from '../Input'
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

serviceTypes.unshift({
  label: 'Select the classification that best describes your service',
  value: '',
})

const currencies = [
  {
    label: 'USD',
    value: 'USD',
  },
]

interface Props {
  data: Listing
  handleInputChange: (field: string, value: any, parentField?: string) => void
  handleContinue: (event: React.FormEvent) => void
}

const ListingGeneralForm = ({ data, handleInputChange, handleContinue }: Props) => {
  const skuPointer = data.item.skus[0]
  return (
    <form className="uk-form-stacked uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="Occupation Classification" required />
          <div id="form-select" className="uk-form-controls">
            <FormSelector
              options={serviceTypes}
              defaultVal={''}
              onChange={event => {
                const occupationIndex = event.target.value
                handleInputChange('item.title', `${ServiceTypes[occupationIndex]}: `, 'listing')
                handleInputChange(
                  'item.categories',
                  [occupationIndex, ServiceTypes[occupationIndex]],
                  'listing'
                )
              }}
              required
            />
          </div>
        </div>

        <div className="uk-margin">
          <FormLabel label="TITLE" required />
          <input
            className="uk-input"
            type="text"
            value={data.item.title}
            onChange={event => handleInputChange('item.title', event.target.value, 'listing')}
          />
          <label className="form-label-desciptor">
            Something descriptive that clearly explains what you're selling
          </label>
        </div>
        <InlineFormFields
          fields={[
            {
              component: (
                <FormSelector
                  defaultVal={data.metadata.contractType}
                  options={ListingTypes}
                  onChange={event =>
                    handleInputChange('metadata.contractType', event.target.value, 'listing')
                  }
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
                  options={currencies}
                  inputProps={{
                    value: data.item.price,
                    type: 'number',
                    onChange: event =>
                      handleInputChange('item.price', event.target.value, 'listing'),
                  }}
                  selectProps={{
                    onChange: event =>
                      handleInputChange('metadata.pricingCurrency', event.target.value, 'listing'),
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
                  defaultVal={data.item.serviceRateMethod}
                  options={ServiceRateMethods}
                  disabled={data.metadata.contractType !== 'SERVICE'}
                  onChange={event =>
                    handleInputChange('item.serviceRateMethod', event.target.value, 'listing')
                  }
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
                    handleInputChange('item.skus', data.item.skus, 'listing')
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
                  field={'item.nsfw'}
                  parentField={'listing'}
                  selectedVal={data.item.nsfw.toString()}
                  handleOnChange={handleInputChange}
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
            className="uk-textarea"
            rows={5}
            value={data.item.description}
            placeholder="Describe your listing as best as you can.."
            onChange={event => handleInputChange('item.description', event.target.value, 'listing')}
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
