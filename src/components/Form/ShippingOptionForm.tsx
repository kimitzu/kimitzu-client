import React from 'react'

import { Button } from '../Button'
import { FormLabel } from '../Label'
import { FormSelector } from '../Selector'
import InlineFormFields from './InlineFormFields'

const typeOptions = [
  {
    label: 'New',
    value: 'new',
  },
  {
    label: 'Old',
    value: 'old',
  },
]

interface ShippingService {
  name: string
  deliveryTime: string
  price: number
  priceAddtl: number
}

interface ShippingOption {
  destination: string
  optionTitle: string
  type: string
  shippingServices: ShippingService[]
}

interface Props {
  data: ShippingOption
  disabled: boolean
  handleInputChange: (field: string, value: any, parentField?: string) => void
  handleAddShippingService: () => void
  handleContinue: (event: React.FormEvent) => void
}

const ShippingOptionForm = ({
  data,
  disabled,
  handleInputChange,
  handleAddShippingService,
  handleContinue,
}: Props) => {
  const { destination, optionTitle, shippingServices, type } = data
  const pointer = shippingServices[0]
  const remainingShippingServices = shippingServices.slice(1, shippingServices.length)
  return (
    <form className="uk-form-stacked uk-flex uk-flex-column full-width">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="DESTINATION" required />
          <input
            className="uk-input"
            type="text"
            placeholder="Enter Destinations"
            value={destination}
            onChange={event =>
              handleInputChange('destination', event.target.value, 'shippingOptions')
            }
            disabled={disabled}
          />
        </div>
        <InlineFormFields
          fields={[
            {
              component: (
                <input
                  className="uk-input"
                  type="text"
                  value={optionTitle}
                  onChange={event =>
                    handleInputChange('optionTitle', event.target.value, 'shippingOptions')
                  }
                  disabled={disabled}
                />
              ),
              label: {
                name: 'OPTION TITLE',
                required: true,
              },
            },
            {
              component: (
                <FormSelector
                  defaultVal={type}
                  options={typeOptions}
                  onChange={event =>
                    handleInputChange('type', event.target.value, 'shippingOptions')
                  }
                  disabled={disabled}
                />
              ),
              label: {
                name: 'TYPE',
                required: true,
              },
            },
          ]}
        />
        {remainingShippingServices.map((shippingService: ShippingService, index: number) => (
          <InlineFormFields
            key={`services${index}`}
            fields={[
              {
                component: (
                  <input
                    className="uk-input"
                    type="text"
                    placeholder="e.g. Standard Express"
                    value={shippingService.name}
                    disabled={disabled}
                    onChange={event => {
                      shippingServices[index].name = event.target.value
                      handleInputChange('shippingServices', shippingServices, 'shippingOptions')
                    }}
                  />
                ),
              },
              {
                component: (
                  <input
                    className="uk-input"
                    type="text"
                    placeholder="e.g. 5-7 days"
                    value={shippingService.deliveryTime}
                    disabled={disabled}
                    onChange={event => {
                      shippingServices[index].deliveryTime = event.target.value
                      handleInputChange('shippingServices', shippingServices, 'shippingOptions')
                    }}
                  />
                ),
              },
              {
                component: (
                  <input
                    className="uk-input"
                    type="number"
                    placeholder="0.00"
                    value={shippingService.price}
                    disabled={disabled}
                    onChange={event => {
                      shippingServices[index].price = parseFloat(event.target.value)
                      handleInputChange('shippingServices', shippingServices, 'shippingOptions')
                    }}
                  />
                ),
              },
              {
                component: (
                  <input
                    className="uk-input"
                    type="number"
                    placeholder="0.00"
                    value={shippingService.priceAddtl}
                    disabled={disabled}
                    onChange={event => {
                      shippingServices[index].priceAddtl = parseFloat(event.target.value)
                      handleInputChange('shippingServices', shippingServices, 'shippingOptions')
                    }}
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
                  placeholder="e.g. Standard Express"
                  value={pointer.name}
                  disabled={disabled}
                  onChange={event => {
                    pointer.name = event.target.value
                    handleInputChange('shippingServices', shippingServices, 'shippingOptions')
                  }}
                />
              ),
              label: {
                name: 'Service',
                required: true,
              },
            },
            {
              component: (
                <input
                  className="uk-input"
                  type="text"
                  placeholder="e.g. 5-7 days"
                  value={pointer.deliveryTime}
                  disabled={disabled}
                  onChange={event => {
                    pointer.deliveryTime = event.target.value
                    handleInputChange('shippingServices', shippingServices, 'shippingOptions')
                  }}
                />
              ),
              label: {
                name: 'EST. DELIVERY TIME',
                required: true,
              },
            },
            {
              component: (
                <input
                  className="uk-input"
                  type="number"
                  placeholder="0.00"
                  value={pointer.price}
                  disabled={disabled}
                  onChange={event => {
                    pointer.price = parseFloat(event.target.value)
                    handleInputChange('shippingServices', shippingServices, 'shippingOptions')
                  }}
                />
              ),
              label: {
                name: 'PRICE(1ST ITEM)',
                required: true,
              },
            },
            {
              component: (
                <input
                  className="uk-input"
                  type="number"
                  placeholder="0.00"
                  value={pointer.priceAddtl}
                  disabled={disabled}
                  onChange={event => {
                    pointer.priceAddtl = parseFloat(event.target.value)
                    handleInputChange('shippingServices', shippingServices, 'shippingOptions')
                  }}
                />
              ),
              label: {
                name: `PRICE(ADDT'L ITEM)`,
                required: true,
              },
            },
          ]}
        />
        <div>
          <a
            className="add-field"
            onClick={
              disabled
                ? evt => {
                    evt.preventDefault()
                    console.log('Function disabled')
                  }
                : handleAddShippingService
            }
            href="/#"
          >
            + ADD SERVICE
          </a>
        </div>
      </fieldset>
      <div className="submit-btn-div">
        <Button className="uk-button uk-button-primary" onClick={handleContinue}>
          CONTINUE
        </Button>
      </div>
    </form>
  )
}

export default ShippingOptionForm
