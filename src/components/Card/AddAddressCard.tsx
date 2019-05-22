import React from 'react'

import './AddAddressCard.css'
import './AddressCard.css'

interface Props {
  handleAddBtn: () => void
}

const AddAddressCard = (props: Props) => (
  <div
    id="address-card"
    className="uk-card uk-card-default uk-card-body"
    onClick={props.handleAddBtn}
  >
    <div id="add-address-body">
      <div id="add-address-text">
        <label className="color-primary">Add new address</label>
      </div>
      <div id="plus-text">
        <label className="color-primary">+</label>
      </div>
    </div>
  </div>
)

export default AddAddressCard
