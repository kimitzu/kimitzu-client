import React, { useState } from 'react'
import StarRatingComponent from 'react-star-rating-component'

import { Button } from '../Button'
import { AutoCompleteSelect } from '../Input'
import { FormLabel } from '../Label'

import Countries from '../../constants/Countries.json'
import ServiceTypes from '../../constants/ServiceTypes.json'
import Values from '../../constants/Values.json'
import Profile from '../../models/Profile'
import { Search, searchInstance } from '../../models/Search'

import { localeInstance } from '../../i18n'

import './Filter.css'

const serviceTypeIds = Object.keys(ServiceTypes)

const serviceTypes = serviceTypeIds
  .map(type => {
    const item = {
      label: ServiceTypes[type],
      value: type,
    }
    return item
  })
  .sort((a, b) => {
    if (a.label === b.label) {
      return 0
    }
    return a.label < b.label ? -1 : 1
  })

serviceTypes.unshift({
  label: 'All',
  value: '~',
})

interface FilterProps {
  onRatingChanged: (nextValue: number, prevValue: number, name: string) => void
  onFilterChange: (field: string, value: string, modifier?: string) => void
  onFilterSubmit: (event?: React.FormEvent<HTMLFormElement>) => void
  onChange: (fieldName: string, value: string, parentField?: string) => void
  onFilterReset: () => void
  onFilterDelete: (field: string) => void
  onAdvancedSearchShow: () => void
  searchInstance: Search
  profile: Profile
  locationRadius: number
  plusCode: string
  rating: number
  id?: string
}

const Filter = ({
  onFilterChange,
  onFilterSubmit,
  onChange,
  locationRadius,
  plusCode,
  onFilterReset,
  onRatingChanged,
  onAdvancedSearchShow,
  rating,
  profile,
  onFilterDelete,
  id,
}: FilterProps) => {
  const {
    localizations,
    localizations: { searchFilters, addressForm },
  } = localeInstance.get
  const [originalSliderValue, setOriginalSliderValue] = useState(1)
  return (
    <div id="main-div">
      <form
        onSubmit={async event => {
          event.preventDefault()
          await onFilterSubmit()
        }}
      >
        <legend className="uk-legend">{searchFilters.header}</legend>
        <div className="uk-margin">
          <Button
            className="uk-button uk-button-default uk-width-1-1"
            onClick={onAdvancedSearchShow}
          >
            {localizations.advancedSearch}
          </Button>
        </div>
        <hr />
        <div className="uk-margin">
          <label>
            <input
              id={`${id}-hideOwnListingCheckbox`}
              className="uk-checkbox"
              type="checkbox"
              onChange={async evt => {
                if (evt.target.checked) {
                  onFilterChange('vendorID.peerID', profile.peerID, '!=')
                } else {
                  onFilterDelete('vendorID.peerID')
                }
                await onFilterSubmit()
              }}
            />{' '}
            {searchFilters.checkboxLabel}
          </label>
        </div>
        <hr />
        <div className="uk-margin">
          <FormLabel label={searchFilters.occupationLabel.toUpperCase()} />
          <div id="form-select" className="uk-form-controls">
            <AutoCompleteSelect
              id={`${id}`}
              options={serviceTypes}
              onChange={async event => {
                if (event.value === '~') {
                  onFilterDelete('item.categories')
                } else {
                  onFilterChange('item.categories', event.value)
                }
                await onFilterSubmit()
              }}
            />
          </div>
        </div>
        <hr />
        <div className="uk-margin">
          <FormLabel label={searchFilters.priceRangeLabel.toUpperCase()} />
          <div className="uk-flex uk-flex-row uk-flex-center uk-flex-middle">
            <div className="uk-inline">
              <input
                id={`${id}-price-min`}
                className="uk-input"
                type="number"
                placeholder={localizations.minimum}
                value={searchInstance.filters.priceMin}
                onChange={event => onFilterChange('priceMin', event.target.value, '<=')}
              />
            </div>
            <span data-uk-icon="icon: triangle-right; ratio: 2" />
            <div className="uk-inline">
              <input
                id={`${id}-price-max`}
                className="uk-input"
                type="number"
                placeholder={localizations.maximum}
                onChange={event => onFilterChange('priceMax', event.target.value, '>=')}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="uk-margin">
          <FormLabel label={localizations.locationLabel.toUpperCase()} />
          <input
            id={`${id}-location-city`}
            className="uk-input"
            type="text"
            placeholder={addressForm.cityLabel}
            onChange={event => onFilterChange('location.city', event.target.value)}
          />
        </div>
        <div className="uk-margin">
          <input
            id={`${id}-location-state`}
            className="uk-input"
            type="text"
            placeholder={addressForm.stateLabel}
            onChange={event => onFilterChange('location.state', event.target.value)}
          />
        </div>
        <div className="uk-margin">
          <input
            id={`${id}-location-zipcode`}
            className="uk-input"
            type="text"
            placeholder={addressForm.zipCodeLabel}
            onChange={event => onFilterChange('location.zipCode', event.target.value)}
          />
        </div>
        <div className="uk-margin">
          <select
            id={`${id}-location-country`}
            className="uk-select"
            onChange={event => onFilterChange('location.country', event.target.value)}
          >
            {Countries.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="uk-margin">
          <input
            id={`${id}-location-pluscode`}
            className="uk-input"
            type="text"
            placeholder="Plus Code"
            value={plusCode}
            onChange={event => onChange('plusCode', event.target.value, 'search')}
          />
        </div>
        <div className="uk-margin">
          <p>
            {' '}
            {searchFilters.locationRadiusLabel.toUpperCase()} (
            {locationRadius > 5000
              ? profile.preferences.measurementUnit === 'ENGLISH'
                ? `${(locationRadius / Values.meterToMiles).toFixed(0)} miles`
                : `${(locationRadius / Values.meterToKilometer).toFixed(0)} km`
              : 'Nearby'}
            ){' '}
          </p>
          <div className="uk-margin">
            <input
              id={`${id}-radius-range`}
              className="uk-range"
              type="range"
              value={originalSliderValue}
              min="1"
              max="100"
              step="1"
              onChange={event => {
                /**
                 * Logarithmic Range Formula for fine-grained slider controls.
                 */
                const minSliderRange = 1
                const maxSliderRange = 100

                const minSliderRangeLog = Math.log(Values.minLocation)
                const maxSliderRangeLog = Math.log(Values.maxLocation)

                const scale =
                  (maxSliderRangeLog - minSliderRangeLog) / (maxSliderRange - minSliderRange)

                const actualValue = Math.exp(
                  minSliderRangeLog + scale * (Number(event.target.value) - minSliderRange)
                )
                setOriginalSliderValue(Number(event.target.value))
                onChange('locationRadius', actualValue.toFixed(0), 'search')
              }}
            />
          </div>
        </div>
        <hr />
        <div className="uk-margin">
          <div>
            <FormLabel label={searchFilters.ratingsLabel.toUpperCase()} />
          </div>
          <StarRatingComponent
            name="rate1"
            starCount={5}
            value={rating}
            onStarClick={onRatingChanged}
          />
        </div>
        <Button
          id={`${id}-reset`}
          type="reset"
          className="uk-button uk-button-default uk-margin-small-right uk-margin-small-bottom"
          onClick={onFilterReset}
        >
          Reset
        </Button>
        <Button
          id={`${id}-submit`}
          type="submit"
          className="uk-button uk-button-primary uk-margin-small-bottom"
        >
          Search
        </Button>
      </form>
    </div>
  )
}

export default Filter
