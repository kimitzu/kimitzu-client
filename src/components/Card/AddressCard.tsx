import React from 'react'

import { Location } from '../../common/types'
import './AddressCard.css'

interface Props {
  location: Location
}

const AddressCard = (props: Props) => {
  const { location } = props
  return (
    <div id="address-card" className="uk-card uk-card-default uk-card-body">
      {location.isDefault ? (
        <div id="address-right-label" className="uk-card-badge uk-label">
          DEFAULT
        </div>
      ) : null}
      <h4 id="address-title" className="uk-card-title address-card-font">
        {location.type}
      </h4>
      <p id="address-text" className="address-card-font">{`${location.address1}, ${
        location.address2
      }, ${location.city}, ${location.state}, ${location.zipCode}, ${location.country}`}</p>
      <p id="address-text" className="address-card-font">{`${location.latitude}, ${
        location.longitude
      }`}</p>
      <p id="address-text" className="address-card-font">
        {location.plusCode}
      </p>
    </div>
  )
}

export default AddressCard
