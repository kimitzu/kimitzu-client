import React from 'react'

import Location from '../../../interfaces/Location'
import { AddAddressCard, AddressCard } from '../../Card'

interface Props {
  locations: Location[]
  handleAddAddressBtn: () => void
  handleSelectAddress: (addressIndex: number) => void
}

const AddressesCardGroup = (props: Props) => {
  const { locations, handleAddAddressBtn, handleSelectAddress } = props
  return (
    <div className="uk-flex-1">
      {locations.map((location: Location, index: number) => (
        <div className="uk-margin-bottom" key={index}>
          <AddressCard location={location} handleSelectAddress={() => handleSelectAddress(index)} />
        </div>
      ))}
      <AddAddressCard handleAddBtn={handleAddAddressBtn} />
    </div>
  )
}

export default AddressesCardGroup
