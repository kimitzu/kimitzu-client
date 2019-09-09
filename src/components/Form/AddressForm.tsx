import React, { useEffect, useState } from 'react'

import { TwoInputs } from '../Input'
import { FormLabel } from '../Label'
import { FormSelector } from '../Selector'

import Countries from '../../constants/Countries.json'
import Location from '../../interfaces/Location'
import decodeHtml from '../../utils/Unescape'

import OpenLocationCode from '../../utils/Location/PlusCode'
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
  updateIndex?: number
  isListing?: boolean
  data?: Location
  isNew?: boolean
  handleSave: (location: Location, index?: number) => void
  handleDelete?: (location: Location, index: number) => void
  handleFullSubmit?: (event: React.FormEvent) => void
}

const AddressForm = ({
  isListing: isListing,
  updateIndex,
  handleSave,
  data,
  handleDelete,
  isNew,
  handleFullSubmit,
}: Props) => {
  const baseLocationObject = {
    latitude: '',
    longitude: '',
    plusCode: '',
    addressOne: '',
    addressTwo: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    type: [],
  } as Location

  const [location, setLocation] = useState(baseLocationObject)

  useEffect(() => {
    if (data) {
      setLocation(data)
    }
  }, [])

  const handleChange = (field: string, value: any) => {
    setLocation({ ...location, [field]: value })
  }

  return (
    <form
      className="uk-form-stacked"
      onSubmit={event => {
        event.preventDefault()
        handleSave(location, updateIndex)
      }}
    >
      <fieldset className="uk-fieldset">
        {isListing ? null : (
          <div className="uk-margin" id="address-type-selection">
            <FormLabel label="TYPE" />
            {options.map((o, index) => (
              <label key={index}>
                <input
                  className="uk-checkbox uk-margin-small-left"
                  type="checkbox"
                  checked={location.type ? location.type.includes(o.value) : false}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (event.target.checked) {
                      location.type!.push(o.value)
                    } else {
                      const newData = location.type!.filter(e => e !== o.value)
                      location.type = newData
                    }
                    handleChange('type', location.type)
                  }}
                />
                {` ${o.label}`}
              </label>
            ))}
          </div>
        )}
        <div className="uk-margin">
          <FormLabel label="STREET ADDRESSES" />
          <input
            id="street-address-1"
            className="uk-input"
            type="text"
            value={decodeHtml(location.addressOne)}
            placeholder="Street Address 1"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleChange('addressOne', event.target.value)
            }
          />
          <input
            id="street-address-2"
            className="uk-input"
            type="text"
            value={decodeHtml(location.addressTwo)}
            placeholder="Street Address 2"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleChange('addressTwo', event.target.value)
            }
          />
        </div>
        <div className="uk-margin">
          <FormLabel label="PLUS CODE" />
          <div className="uk-inline uk-width-1-1">
            <a
              className="uk-form-icon uk-form-icon-flip"
              href="https://plus.codes/howitworks"
              target="_blank"
              uk-icon="icon: question"
              uk-tooltip="What is a Plus Code?"
            />
            <input
              id="plus-code"
              className="uk-input"
              value={location.plusCode}
              type="text"
              onChange={event => {
                const plusCode = event.target.value
                location.plusCode = plusCode
                if (OpenLocationCode.isValid(plusCode)) {
                  const decodedLocation = OpenLocationCode.decode(plusCode)
                  location.latitude = decodedLocation.latitudeCenter.toString()
                  location.longitude = decodedLocation.longitudeCenter.toString()
                } else {
                  location.latitude = ''
                  location.longitude = ''
                }
                setLocation({ ...location })
              }}
            />
          </div>
        </div>
        <TwoInputs
          input1={{
            label: 'LATITUDE',
            props: {
              id: 'latitude',
              type: 'text',
              value: location.latitude,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('latitude', event.target.value.toString()),
            },
          }}
          input2={{
            label: 'LONGITUDE',
            props: {
              id: 'longitude',
              type: 'text',
              value: location.longitude,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('longitude', event.target.value.toString()),
            },
          }}
        />
        <TwoInputs
          input1={{
            label: 'CITY',
            props: {
              id: 'city',
              type: 'text',
              value: decodeHtml(location.city),
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('city', event.target.value),
            },
          }}
          input2={{
            label: 'STATE',
            props: {
              id: 'state',
              type: 'text',
              value: decodeHtml(location.state),
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('state', event.target.value),
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
              value={location.zipCode}
              placeholder="Zip Code"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('zipCode', event.target.value)
              }
            />
          </div>
          <div id="input2" className="uk-width-1-2@s">
            <FormLabel label="Country" />
            <FormSelector
              id="countries"
              defaultVal={location.country || ''}
              options={Countries}
              onChange={event => handleChange('country', event.target.value)}
            />
          </div>
        </div>
      </fieldset>
      <div id="save-btn-div">
        {!isListing ? (
          <button
            className="uk-button uk-button-danger uk-margin-right"
            type="button"
            onClick={() => {
              if (handleDelete) {
                handleDelete(location, updateIndex!)
              }
            }}
          >
            DELETE
          </button>
        ) : null}
        {!isNew ? (
          <button
            className="uk-button uk-button-primary uk-margin-small-right"
            onClick={handleFullSubmit}
          >
            UPDATE LISTING
          </button>
        ) : null}
        <button
          className={`uk-button ${isNew ? 'uk-button-primary' : 'uk-button-default'}`}
          type="submit"
        >
          {isListing ? 'NEXT' : 'SAVE'}
        </button>
      </div>
    </form>
  )
}

export default AddressForm
