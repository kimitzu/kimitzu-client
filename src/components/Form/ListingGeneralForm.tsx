import React from 'react'

import { InputSelector } from '../Input'
import { FormLabel } from '../Label'
import { RadioButtons } from '../RadioButton'
import { FormSelector } from '../Selector'
import InlineFormFields from './InlineFormFields'

import ListingConditions from '../../constants/ListingConditions.json'
import ListingTypes from '../../constants/ListingTypes.json'
import { ListingCreate } from '../../models/ListingCreate'

const currencies = [
  {
    label: 'USD',
    value: 'USD',
  },
  {
    label: 'BTC',
    value: 'BTC',
  },
]

interface Props {
  data: ListingCreate
  handleInputChange: (field: string, value: any, parentField?: string) => void
  handleContinue: (event: React.FormEvent) => void
}

const ListingGeneralForm = ({ data, handleInputChange, handleContinue }: Props) => (
  <form className="uk-form-stacked uk-flex uk-flex-column full-width">
    <fieldset className="uk-fieldset">
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
      <div className="uk-margin">
        <FormLabel label="TYPE" required />
        <FormSelector
          defaultVal={data.metadata.contractType}
          options={ListingTypes}
          onChange={event =>
            handleInputChange('metadata.contractType', event.target.value, 'listing')
          }
        />
        <label className="form-label-desciptor">Choose from 4 types</label>
      </div>
      <InlineFormFields
        fields={[
          {
            component: (
              <InputSelector
                options={currencies}
                inputProps={{
                  value: data.item.price,
                  type: 'number',
                  onChange: event => handleInputChange('item.price', event.target.value, 'listing'),
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
            descriptiveLabel: 'Set your price in Dollars, Yuan, Bitcoin, anything',
          },
          {
            component: (
              <FormSelector
                defaultVal={data.item.condition}
                options={ListingConditions}
                onChange={event =>
                  handleInputChange('item.condition', event.target.value, 'listing')
                }
              />
            ),
            label: {
              name: 'CONDITION',
              required: true,
            },
            descriptiveLabel: 'The overall condition of your listing',
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
                value={''}
                disabled
                onChange={event => {
                  // TODO: Update SKU implementation
                  // handleInputChange('sku', event.target.value, 'generalForm')
                }}
              />
            ),
            label: {
              name: 'SKU',
            },
            descriptiveLabel: 'A unique identifier for your listing',
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

export default ListingGeneralForm
