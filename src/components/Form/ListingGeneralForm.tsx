import React from 'react'

import { InputSelector } from '../Input'
import { FormLabel } from '../Label'
import { RadioButtons } from '../RadioButton'
import { FormSelector } from '../Selector'
import InlineFormFields from './InlineFormFields'

import ListingConditions from '../../constants/ListingConditions.json'
import ListingTypes from '../../constants/ListingTypes.json'

const currencies = [
  {
    label: 'USD',
    value: 'usd',
  },
  {
    label: 'BTC',
    value: 'btc',
  },
]

// TODO: move if necessary
interface GeneralListingInfo {
  title: string
  type: string
  price: number
  condition: string
  sku: string
  nsfw: boolean
  description: string
}

interface Props {
  data: GeneralListingInfo
  handleInputChange: () => void
  handleSelectChange: () => void
  handleContinue: () => void
}

const ListingGeneralForm = ({
  data,
  handleInputChange,
  handleSelectChange,
  handleContinue,
}: Props) => (
  <form className="uk-form-stacked uk-flex uk-flex-column full-width">
    <fieldset className="uk-fieldset">
      <div className="uk-margin">
        <FormLabel label="TITLE" required />
        <input className="uk-input" type="text" value={data.title} onChange={handleInputChange} />
        <label className="form-label-desciptor">
          Something descriptive that clearly explains what you're selling
        </label>
      </div>
      <div className="uk-margin">
        <FormLabel label="TYPE" required />
        {/* TODO: update onChange handler */}
        <FormSelector defaultVal={data.type} options={ListingTypes} onChange={handleSelectChange} />
        <label className="form-label-desciptor">Choose from 4 types</label>
      </div>
      <InlineFormFields
        fields={[
          {
            component: (
              <InputSelector
                options={currencies}
                inputProps={{
                  value: data.price,
                  type: 'number',
                  onChange: handleInputChange,
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
                defaultVal={data.condition}
                options={ListingConditions}
                onChange={handleSelectChange} // TODO: Update onChange handler
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
                value={data.sku}
                onChange={handleInputChange}
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
                    value: 'yes',
                  },
                  {
                    label: 'No',
                    value: 'no',
                  },
                ]}
                selectedVal={data.nsfw ? 'yes' : 'no'} // TODO: update props
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
          value={data.description}
          placeholder="Describe your listing as best as you can.."
          onChange={handleInputChange}
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
