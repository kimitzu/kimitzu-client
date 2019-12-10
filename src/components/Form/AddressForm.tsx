import React, { useEffect, useState } from 'react'

import { TwoInputs } from '../Input'
import { FormLabel } from '../Label'

import Countries from '../../constants/Countries.json'
import Location from '../../interfaces/Location'
import decodeHtml from '../../utils/Unescape'

import OpenLocationCode from '../../utils/Location/PlusCode'
import { Button } from '../Button'

import { localeInstance } from '../../i18n'

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
  isListing,
  updateIndex,
  handleSave,
  data,
  handleDelete,
  isNew,
  handleFullSubmit,
}: Props) => {
  const {
    localizations,
    localizations: { addressForm, listingForm },
  } = localeInstance.get
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
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenLocationCodeValid, setIsOpenLocationCodeValid] = useState(false)

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
      onSubmit={async event => {
        event.preventDefault()
        setIsLoading(true)
        try {
          await handleSave(location, updateIndex)
          setIsLoading(false)
        } catch (e) {
          setIsLoading(false)
        }
      }}
    >
      <fieldset className="uk-fieldset">
        {isListing ? null : (
          <div className="uk-margin" id="address-type-selection">
            <FormLabel label={localizations.typeLabel.toUpperCase()} />
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
          <FormLabel label={addressForm.streetLabel.toUpperCase()} />
          <input
            id="street-address-1"
            className="uk-input"
            type="text"
            value={decodeHtml(location.addressOne)}
            placeholder={`${addressForm.streetLabel} 1`}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleChange('addressOne', event.target.value)
            }
          />
          <input
            id="street-address-2"
            className="uk-input"
            type="text"
            value={decodeHtml(location.addressTwo)}
            placeholder={`${addressForm.streetLabel} 2`}
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
              rel="noopener noreferrer"
              uk-icon="icon: question"
              uk-tooltip={addressForm.plusCodeHelper}
            >
              &nbsp;
            </a>
            <input
              id="plus-code"
              className={`uk-input ${
                isOpenLocationCodeValid ? 'uk-form-success' : 'uk-form-danger'
              }`}
              value={location.plusCode}
              type="text"
              onChange={event => {
                const plusCode = event.target.value
                location.plusCode = plusCode
                if (OpenLocationCode.isValid(plusCode)) {
                  try {
                    const decodedLocation = OpenLocationCode.decode(plusCode)
                    location.latitude = decodedLocation.latitudeCenter.toString()
                    location.longitude = decodedLocation.longitudeCenter.toString()
                    setIsOpenLocationCodeValid(true)
                  } catch (e) {
                    setIsOpenLocationCodeValid(false)
                  }
                } else {
                  location.latitude = ''
                  location.longitude = ''
                  setIsOpenLocationCodeValid(false)
                }
                setLocation({ ...location })
              }}
            />
          </div>
        </div>
        <TwoInputs
          input1={{
            label: addressForm.latitudeLabel.toUpperCase(),
            props: {
              id: 'latitude',
              type: 'text',
              value: location.latitude,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('latitude', event.target.value.toString()),
            },
          }}
          input2={{
            label: addressForm.longitudeLabel.toUpperCase(),
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
            label: addressForm.cityLabel.toUpperCase(),
            props: {
              id: 'city',
              type: 'text',
              value: decodeHtml(location.city),
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('city', event.target.value),
            },
          }}
          input2={{
            label: addressForm.stateLabel.toUpperCase(),
            props: {
              id: 'state',
              type: 'text',
              value: decodeHtml(location.state),
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('state', event.target.value),
            },
          }}
        />
        <TwoInputs
          input1={{
            label: addressForm.zipCodeLabel.toUpperCase(),
            props: {
              id: 'zipCode',
              type: 'text',
              value: decodeHtml(location.zipCode),
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('zipCode', event.target.value),
            },
          }}
          input2={{
            label: addressForm.countryLabel.toUpperCase(),
            props: {
              id: 'countries',
              type: 'text',
              value: decodeHtml(location.country || ''),
              options: Countries,
              onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
                handleChange('country', event.target.value),
            },
          }}
        />
      </fieldset>
      <div id="save-btn-div">
        {!isListing ? (
          <Button
            className="uk-button uk-button-danger uk-margin-right"
            type="button"
            onClick={() => {
              if (handleDelete) {
                handleDelete(location, updateIndex!)
              }
            }}
          >
            {localizations.deleteBtnText.toUpperCase()}
          </Button>
        ) : null}
        {!isNew && isListing ? (
          <Button
            className="uk-button uk-button-primary uk-margin-small-right"
            onClick={handleFullSubmit}
            showSpinner={isLoading}
          >
            {listingForm.updateBtnText.toUpperCase()}
          </Button>
        ) : null}
        <Button
          className={`uk-button ${isNew || !isListing ? 'uk-button-primary' : 'uk-button-default'}`}
          type="submit"
          showSpinner={isLoading}
        >
          {isListing
            ? localizations.nextBtnText.toUpperCase()
            : localizations.saveBtnText.toUpperCase()}
        </Button>
      </div>
    </form>
  )
}

export default AddressForm
