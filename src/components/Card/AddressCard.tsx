import React from 'react'

import Location from '../../models/Location'
import './AddressCard.css'

interface Props {
  location: Location
  handleSelectAddress: () => void
}

const AddressCard = (props: Props) => {
  const { location } = props
  return (
    <div
      id="address-card"
      className="uk-card uk-card-default uk-card-body"
      onClick={props.handleSelectAddress}
    >
      <div id="address-types">
        {location.type.map((t: string, index: number) => (
          <span key={`${t}${index}`} id="address-type-label" className="uk-label">
            {t.toUpperCase()}
          </span>
        ))}
      </div>

      {location.latitude && location.longitude ? (
        <p id="address-text" className="address-card-font">
          Coordinates: ({location.latitude}, {location.longitude})
        </p>
      ) : null}

      {location.plusCode ? (
        <p id="address-text" className="address-card-font">
          Plus Code: {location.plusCode}
        </p>
      ) : null}

      {location.addressOne ? (
        <p id="address-text" className="address-card-font">
          Street Address 1: {location.addressOne}
        </p>
      ) : null}

      {location.addressTwo ? (
        <p id="address-text" className="address-card-font">
          Street Address 2: {location.addressTwo}
        </p>
      ) : null}

      {location.city ? (
        <p id="address-text" className="address-card-font">
          City: {location.city}
        </p>
      ) : null}

      {location.state ? (
        <p id="address-text" className="address-card-font">
          State: {location.state}
        </p>
      ) : null}
      {location.zipCode ? (
        <p id="address-text" className="address-card-font">
          Zip Code: {location.zipCode}
        </p>
      ) : null}
      {location.country ? (
        <p id="address-text" className="address-card-font">
          Country: {location.country}
        </p>
      ) : null}
    </div>
  )
}

export default AddressCard
