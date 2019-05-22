import React from 'react'

import { TwoInputs } from '../Input'
import { FormLabel } from '../Label'
import { FormSelector } from '../Selector'

import { Location } from '../../common/types'

import './AddressForm.css'

const options = [
  {
    label: 'Primary',
    value: 'Primary',
  },
  {
    label: 'Billing',
    value: 'Billing',
  },
  {
    label: 'Shipping',
    value: 'Shipping',
  },
  {
    label: 'Return',
    value: 'Return',
  },
]

interface Props {
  handleSave: () => void
  data: Location
}

const AddressForm = (props: Props) => {
  const { handleSave, data } = props
  return (
    <form className="uk-form-stacked">
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="TYPE" />
          <FormSelector defaultVal={data.type} options={options} />
        </div>
        <TwoInputs
          input1={{
            label: 'LONGITUDE',
            props: {
              type: 'text',
              value: data.longitude,
            },
          }}
          input2={{
            label: 'LATITUDE',
            props: {
              type: 'text',
              value: data.latitude,
            },
          }}
        />
        <TwoInputs
          input1={{
            label: 'CITY',
            props: {
              type: 'text',
              value: data.city,
            },
          }}
          input2={{
            label: 'STATE',
            props: {
              type: 'text',
              value: data.state,
            },
          }}
        />
        <TwoInputs
          input1={{
            label: 'ZIP CODE',
            props: {
              type: 'text',
              value: data.zipCode,
            },
          }}
          input2={{
            label: 'COUNTRY',
            props: {
              type: 'text',
              value: data.country,
            },
          }}
        />
        <div className="uk-width-1-2@s">
          <FormLabel label="PLUS CODE" />
          <input className="uk-input" value={data.plusCode} type="text" />
        </div>
        <div className="uk-margin">
          <FormLabel label="STREET ADDRESSES" />
          <input
            id="street-address"
            className="uk-input"
            type="text"
            value={data.address1}
            placeholder="Street Address 1"
          />
          <input
            id="street-address"
            className="uk-input"
            type="text"
            value={data.address2}
            placeholder="Street Address 2"
          />
        </div>
      </fieldset>
      <div id="save-btn-div">
        <button className="uk-button uk-button-primary" onClick={handleSave}>
          SAVE
        </button>
      </div>
    </form>
  )
}

export default AddressForm
