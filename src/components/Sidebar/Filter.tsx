import React from 'react'
import Countries from '../../constants/Countries.json'
import ServiceTypes from '../../constants/ServiceTypes.json'
import { FormLabel } from '../Label'
import { FormSelector } from '../Selector'

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
  label: 'Select service',
  value: '',
})

interface FilterProps {
  onFilterChange: (field: string, value: string, modifier?: string) => void
  onFilterSubmit: (event?: React.FormEvent<HTMLFormElement>) => void
  onChange: (fieldName: string, value: string) => void
  onFilterReset: () => void
  locationRadius: number
  plusCode: string
}

const Filter = ({
  onFilterChange,
  onFilterSubmit,
  onChange,
  locationRadius,
  plusCode,
  onFilterReset,
}: FilterProps) => (
  <div id="main-div">
    <form onSubmit={onFilterSubmit}>
      <legend className="uk-legend">FILTERS</legend>
      <div className="uk-margin">
        <FormLabel label="Occupation Classification" required />
        <div id="form-select" className="uk-form-controls">
          <FormSelector
            options={serviceTypes}
            defaultVal={''}
            onChange={async event => {
              onFilterChange('item.categories', event.target.value)
              await onFilterSubmit()
            }}
          />
        </div>
      </div>
      <p> PRICE RANGE </p>
      <div className="uk-margin">
        <input
          className="uk-range"
          type="range"
          defaultValue="8"
          min="0"
          max="10"
          step="0.1"
          onChange={event => {
            onFilterChange('priceRange', event.target.value)
          }}
        />
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
          onChange={event => onChange('plusCode', event.target.value)}
        />
      </div>
      <div className="uk-margin">
        <p> RATING </p>
        <span uk-icon="icon: star" onClick={() => onFilterChange('averageRating', '1', '>=')} />
        <span uk-icon="icon: star" onClick={() => onFilterChange('averageRating', '2', '>=')} />
        <span uk-icon="icon: star" onClick={() => onFilterChange('averageRating', '3', '>=')} />
        <span uk-icon="icon: star" onClick={() => onFilterChange('averageRating', '4', '>=')} />
        <span uk-icon="icon: star" onClick={() => onFilterChange('averageRating', '5', '>=')} />
      </div>
      <div className="uk-margin">
        <p> WITHIN RADIUS ({locationRadius > -1 ? locationRadius + ' m' : 'Nearby'}) </p>
        <div className="uk-margin">
          <input
            className="uk-range"
            type="range"
            defaultValue="0"
            value={locationRadius}
            min="-1"
            max="200000"
            step="1"
            onChange={event => {
              onChange('locationRadius', event.target.value)
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
