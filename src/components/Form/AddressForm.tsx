import React from 'react'

import { TwoInputs } from '../Input'
import { FormLabel } from '../Label'
import { FormSelector } from '../Selector'

import './AddressForm.css'

const options = [
  {
    label: 'Primary',
    value: 'primary',
  },
  {
    label: 'Billing',
    value: 'billing',
  },
  {
    label: 'Shipping',
    value: 'shipping',
  },
  {
    label: 'Return',
    value: 'return',
  },
]

interface Props {
  handleSave: () => void
}

const AddressForm = (props: Props) => (
  <form className="uk-form-stacked">
    <fieldset className="uk-fieldset">
      <div className="uk-margin">
        <FormLabel label="TYPE" />
        <FormSelector options={options} />
      </div>
      <TwoInputs
        input1={{
          label: 'LONGITUDE',
          props: {
            type: 'text',
          },
        }}
        input2={{
          label: 'LATITUDE',
          props: {
            type: 'text',
          },
        }}
      />
      <TwoInputs
        input1={{
          label: 'CITY',
          props: {
            type: 'text',
          },
        }}
        input2={{
          label: 'STATE',
          props: {
            type: 'text',
          },
        }}
      />
      <TwoInputs
        input1={{
          label: 'ZIP CODE',
          props: {
            type: 'text',
          },
        }}
        input2={{
          label: 'COUNTRY',
          props: {
            type: 'text',
          },
        }}
      />
      <div className="uk-width-1-2@s">
        <FormLabel label="PLUS CODE" />
        <input className="uk-input" type="text" />
      </div>
      <div className="uk-margin">
        <FormLabel label="STREET ADDRESSES" />
        <input
          id="street-address"
          className="uk-input"
          type="text"
          placeholder="Street Address 1"
        />
        <input
          id="street-address"
          className="uk-input"
          type="text"
          placeholder="Street Address 2"
        />
      </div>
    </fieldset>
    <div id="save-btn-div">
      <button className="uk-button uk-button-primary">SAVE</button>
    </div>
  </form>
)

export default AddressForm
