import React from 'react'
import StarRatingComponent from 'react-star-rating-component'
import Countries from '../../constants/Countries.json'
import ServiceTypes from '../../constants/ServiceTypes.json'
import { FormLabel } from '../Label'

import { AutoCompleteSelect } from '../Input'
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
}: FilterProps) => (
  <div id="main-div">
    <form
      onSubmit={async event => {
        event.preventDefault()
        await onFilterSubmit()
      }}
    >
      <legend className="uk-legend">FILTERS</legend>
      <div className="uk-margin">
        <FormLabel label="Occupation" />
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
          {/* <span className="uk-form-icon" data-uk-icon="" /> */}
          <input
            className="uk-input"
            type="number"
            placeholder="MIN"
            onChange={event => onFilterChange('priceMin', event.target.value, '<=')}
          />
        </div>
        <span data-uk-icon="icon: triangle-right; ratio: 2" />
        <div className="uk-inline">
          {/* <span className="uk-form-icon" data-uk-icon="" /> */}
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
        <p> WITHIN RADIUS ({locationRadius > -1 ? locationRadius + ' m' : 'Nearby'}) </p>
        <div className="uk-margin">
          <input
            className="uk-range"
            type="range"
            value={locationRadius}
            min="-1"
            max="200000"
            step="1"
            onChange={event => {
              onChange('locationRadius', event.target.value, 'search')
            }}
          />
        </div>
      </div>
      <button type="reset" className="uk-button uk-button-default" onClick={onFilterReset}>
        Reset
      </button>
      <button type="submit" className="uk-button uk-button-primary">
        Search
      </button>
    </form>
  </div>
)

export default Filter
