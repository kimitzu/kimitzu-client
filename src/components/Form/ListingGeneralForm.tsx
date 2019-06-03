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
  handleOnChange: () => void
  handleContinue: () => void
}

const ListingGeneralForm = ({ data, handleOnChange, handleContinue }: Props) => (
  <form className="uk-form-stacked">
    <fieldset className="uk-fieldset">
      <div className="uk-margin">
        <FormLabel label="TITLE" required />
        <input className="uk-input" type="text" value={data.title} />
        <label className="form-label-desciptor">
          Something descriptive that clearly explains what you're selling
        </label>
      </div>
      <div className="uk-margin">
        <FormLabel label="TYPE" required />
        {/* TODO: update onChange handler */}
        <FormSelector defaultVal={data.type} options={ListingTypes} onChange={handleOnChange} />
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
                onChange={handleOnChange} // TODO: Update onChange handler
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
            component: <input className="uk-input" type="text" value={data.sku} />,
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
                handleOnChange={() => {
                  console.log('WIP')
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
          className="uk-textarea"
          rows={5}
          value={data.description}
          placeholder="Describe your listing as best as you can.."
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
