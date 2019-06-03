import React from 'react'

import { FormLabel } from '../Label'
import { FormSelector } from '../Selector'
import InlineFormFields from './InlineFormFields'

import './ShippingOptionForm.css'

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
  handleInputChange: () => void
  handleSelectChange: () => void
  handleAddShippingService: () => void
  handleContinue: () => void
}

const ShippingOptionForm = ({
  data,
  handleInputChange,
  handleSelectChange,
  handleAddShippingService,
  handleContinue,
}: Props) => {
  const { destination, optionTitle, shippingServices, type } = data
  const shippingService1 = shippingServices.splice(0, 1)[0]
  return (
    <form className="uk-form-stacked">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="DESTINATION" required />
          <input
            className="uk-input"
            type="text"
            placeholder="Enter Destinations"
            value={destination}
            onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleSelectChange}
                />
              ),
              label: {
                name: 'TYPE',
                required: true,
              },
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
                  placeholder="e.g. Standard Express"
                  value={shippingService1.name}
                  onChange={handleInputChange}
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
                  value={shippingService1.deliveryTime}
                  onChange={handleInputChange}
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
                  value={shippingService1.price}
                  onChange={handleInputChange}
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
                  value={shippingService1.priceAddtl}
                  onChange={handleInputChange}
                />
              ),
              label: {
                name: `PRICE(ADDT'L ITEM)`,
                required: true,
              },
            },
          ]}
        />
        {shippingServices.map((shippingService: ShippingService) => (
          <InlineFormFields
            key={shippingService.name}
            fields={[
              {
                component: (
                  <input
                    className="uk-input"
                    type="text"
                    placeholder="e.g. Standard Express"
                    value={shippingService.name}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                  />
                ),
              },
            ]}
          />
        ))}
        <div>
          <a id="add-service" onClick={handleAddShippingService}>
            + ADD SERVICE
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

export default ShippingOptionForm
