import React from 'react'
import Countries from '../../constants/Countries.json'

import './Filter.css'

interface FilterProps {
  onFilterChange: (field: string, value: string, modifier?: string) => void
  onFilterSubmit: (event: React.FormEvent<HTMLFormElement>) => void
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
        <select className="uk-select">
          <option>All Categories</option>
          <option>Option 01</option>
          <option>Option 02</option>
        </select>
      </div>
      <p> PRICE RANGE </p>
      <div className="uk-margin uk-flex uk-flex-row uk-flex-center uk-flex-middle">
        <div className="uk-inline">
          {/* <span className="uk-form-icon" data-uk-icon="" /> */}
          <input
            className="uk-input"
            type="number"
            placeholder="MIN"
            onChange={event => onFilterChange('price.min', event.target.value)}
          />
        </div>
        <span data-uk-icon="icon: triangle-right; ratio: 2" />
        <div className="uk-inline">
          {/* <span className="uk-form-icon" data-uk-icon="" /> */}
          <input
            className="uk-input"
            type="number"
            placeholder="MAX"
            onChange={event => onFilterChange('price.max', event.target.value)}
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
