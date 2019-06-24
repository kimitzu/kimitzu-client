import React from 'react'

import Location from '../../interfaces/Location'
import './AddressCard.css'

interface Props {
  location: Location
  header?: string
  handleSelectAddress: () => void
}

const displayLocationKey = (key: string) => (key ? `, ${key}` : '')

const AddressCard = (props: Props) => {
  const { location, header } = props
  return (
    <div
      id="address-card"
      className="uk-card uk-card-default uk-card-body uk-card-small"
      onClick={props.handleSelectAddress}
    >
      {header ? <h3>Shipping Address</h3> : null}
      <div id="address-types">
        {location.type &&
          location.type!.map((t: string, index: number) => (
            <span key={`${t}${index}`} id="address-type-label" className="uk-label">
              {t.toUpperCase()}
            </span>
          ))}
      </div>
      <p id="address-text" className="address-card-font">
        {`${location.addressOne || ''}${displayLocationKey(
          location.addressTwo
        )}${displayLocationKey(location.city)}${displayLocationKey(
          location.state
        )}${displayLocationKey(location.zipCode)} ${location.country || ''}`}
      </p>

      {location.latitude && location.longitude ? (
        <p id="address-text" className="address-card-font">
          {location.latitude}, {location.longitude}
        </p>
      ) : null}

      {location.plusCode ? (
        <p id="address-text" className="address-card-font">
          {location.plusCode}
        </p>
      ) : null}
    </div>
  )
}

export default AddressCard
