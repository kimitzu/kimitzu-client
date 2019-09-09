import React, { useState } from 'react'
import StarRatingComponent from 'react-star-rating-component'
import Countries from '../../constants/Countries.json'
import ServiceTypes from '../../constants/ServiceTypes.json'
import { AutoCompleteSelect } from '../Input'
import { FormLabel } from '../Label'

import Values from '../../constants/Values.json'
import Profile from '../../models/Profile'

import { Search, searchInstance } from '../../models/Search'
import { Button } from '../Button'
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
  searchInstance: Search
  profile: Profile
  locationRadius: number
  plusCode: string
  rating: number
}

const Filter = ({
  onFilterChange,
  onFilterSubmit,
  onChange,
  locationRadius,
  plusCode,
  onFilterReset,
  onRatingChanged,
  rating,
  profile,
}: FilterProps) => {
  const [originalSliderValue, setOriginalSliderValue] = useState(1)

  return (
    <div id="main-div">
      <form
        onSubmit={async event => {
          event.preventDefault()
          await onFilterSubmit()
        }}
      >
        <legend className="uk-legend">FILTERS</legend>
        <div className="uk-margin">
          <FormLabel label="OCCUPATION" />
          <div id="form-select" className="uk-form-controls">
            <AutoCompleteSelect
              options={serviceTypes}
              onChange={async event => {
                onFilterChange('item.categories', event.value)
                await onFilterSubmit()
              }}
            />
          </div>
        </div>
        <p> PRICE RANGE </p>
        <div className="uk-margin uk-flex uk-flex-row uk-flex-center uk-flex-middle">
          <div className="uk-inline">
            <input
              className="uk-input"
              type="number"
              placeholder="MIN"
              value={searchInstance.filters.priceMin}
              onChange={event => onFilterChange('priceMin', event.target.value, '<=')}
            />
          </div>
          <span data-uk-icon="icon: triangle-right; ratio: 2" />
          <div className="uk-inline">
            <input
              className="uk-input"
              type="number"
              placeholder="MAX"
              onChange={event => onFilterChange('priceMax', event.target.value, '>=')}
            />
          </div>
        </div>
        <p> LOCATION </p>
        <div className="uk-margin">
          <input
            className="uk-input"
            type="text"
            placeholder="City"
            onChange={event => onFilterChange('location.city', event.target.value)}
          />
        </div>
        <div className="uk-margin">
          <input
            className="uk-input"
            type="text"
            placeholder="State"
            onChange={event => onFilterChange('location.state', event.target.value)}
          />
        </div>
        <div className="uk-margin">
          <input
            className="uk-input"
            type="text"
            placeholder="Zip"
            onChange={event => onFilterChange('location.zipCode', event.target.value)}
          />
        </div>
        <div className="uk-margin">
          <select
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
            className="uk-input"
            type="text"
            placeholder="Plus Code"
            value={plusCode}
            onChange={event => onChange('plusCode', event.target.value, 'search')}
          />
        </div>
        <div className="uk-margin">
          <p> RATING </p>
          <StarRatingComponent
            name="rate1"
            starCount={5}
            value={rating}
            onStarClick={onRatingChanged}
          />
        </div>
        <div className="uk-margin">
          <p>
            {' '}
            WITHIN RADIUS (
            {locationRadius > 5000
              ? profile.preferences.measurementUnit === 'ENGLISH'
                ? `${(locationRadius / Values.meterToMiles).toFixed(0)} miles`
                : `${(locationRadius / Values.meterToKilometer).toFixed(0)} km`
              : 'Nearby'}
            ){' '}
          </p>
          <div className="uk-margin">
            <input
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
        <Button
          type="reset"
          className="uk-button uk-button-default uk-margin-small-right"
          onClick={onFilterReset}
        >
          Reset
        </Button>
        <Button type="submit" className="uk-button uk-button-primary">
          Search
        </Button>
      </form>
    </div>
  )
}

export default Filter
