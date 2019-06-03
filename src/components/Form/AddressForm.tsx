import React from 'react'

import { TwoInputs } from '../Input'
import { FormLabel } from '../Label'
import { FormSelector } from '../Selector'

import Countries from '../../constants/Countries.json'
import Location from '../../models/Location'
import '../Input/TwoInputs.css'
import './AddressForm.css'

const options = [
  {
    label: 'Primary Address',
    value: 'primary',
  },
  {
    label: 'Shipping Address',
    value: 'shipping',
  },
  {
    label: 'Billing Address',
    value: 'billing',
  },
  {
    label: 'Return Address',
    value: 'return',
  },
]

interface Props {
  onSaveAddress: (event: React.FormEvent<HTMLFormElement>) => void
  onAddressChange: (field: string, value: string | string[]) => void
  onDeleteAddress?: (index: number) => void
  updateIndex?: number
  data: Location
  isEdit: boolean
}

const AddressForm = (props: Props) => {
  const { onSaveAddress, data } = props
  return (
    <form className="uk-form-stacked" onSubmit={onSaveAddress}>
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label="TYPE" />
          {options.map((o, index) => (
            <label key={index}>
              <input
                className="uk-checkbox uk-margin-small-left"
                type="checkbox"
                checked={data.type ? data.type.includes(o.value) : false}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.checked) {
                    const newData = data.type.push(o.value)
                    props.onAddressChange('type', data.type)
                  } else {
                    const newData = data.type.filter(e => e !== o.value)
                    props.onAddressChange('type', newData)
                  }
                }}
              />
              {` ${o.label}`}
            </label>
          ))}
        </div>
        <div className="uk-margin">
          <FormLabel label="STREET ADDRESSES" />
          <input
            id="street-address"
            className="uk-input"
            type="text"
            value={data.addressOne}
            placeholder="Street Address 1"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              props.onAddressChange('addressOne', event.target.value)
            }
          />
          <input
            id="street-address"
            className="uk-input"
            type="text"
            value={data.addressTwo}
            placeholder="Street Address 2"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              props.onAddressChange('addressTwo', event.target.value)
            }
          />
        </div>
        <div className="uk-margin">
          <FormLabel label="PLUS CODE" />
          <input
            className="uk-input"
            value={data.plusCode}
            type="text"
            onChange={event => props.onAddressChange('plusCode', event.target.value)}
          />
        </div>
        <TwoInputs
          input1={{
            label: 'LONGITUDE',
            props: {
              type: 'number',
              value: data.longitude,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                props.onAddressChange('longitude', event.target.value),
            },
          }}
          input2={{
            label: 'LATITUDE',
            props: {
              type: 'number',
              value: data.latitude,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                props.onAddressChange('latitude', event.target.value),
            },
          }}
        />
        <TwoInputs
          input1={{
            label: 'CITY',
            props: {
              type: 'text',
              value: data.city,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                props.onAddressChange('city', event.target.value),
            },
          }}
          input2={{
            label: 'STATE',
            props: {
              type: 'text',
              value: data.state,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                props.onAddressChange('state', event.target.value),
            },
          }}
        />
        {/* TODO: Update this component to use the general two-input wrapper. */}
        <div id="two-inputs">
          <div id="input1" className="uk-width-1-2@s">
            <FormLabel label="Zip Code" />
            <input
              id="zipCode"
              className="uk-input"
              type="text"
              value={data.zipCode}
              placeholder="Zip Code"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                props.onAddressChange('zipCode', event.target.value)
              }
            />
          </div>
          <div id="input2" className="uk-width-1-2@s">
            <FormLabel label="Country" />
            <FormSelector
              defaultVal={data.country || ''}
              options={Countries}
              onChange={event => props.onAddressChange('country', event.target.value)}
            />
          </div>
        </div>
      </fieldset>
      <div id="save-btn-div">
        {props.isEdit ? (
          <button
            className="uk-button uk-button-danger uk-margin-right"
            type="button"
            onClick={() => props.onDeleteAddress!(props.updateIndex!)}
          >
            DELETE
          </button>
        ) : null}
        <button className="uk-button uk-button-primary" type="submit">
          SAVE
        </button>
      </div>
    </form>
  )
}

export default AddressForm
