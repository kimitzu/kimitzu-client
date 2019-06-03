import React from 'react'

import Location from '../../models/Location'
import { AddAddressCard, AddressCard } from '../Card'

interface Props {
  locations: Location[]
  handleAddAddressBtn: () => void
  handleSelectAddress: (addressIndex: number) => void
}

const AddressesCardGroup = (props: Props) => {
  const { locations, handleAddAddressBtn, handleSelectAddress } = props
  return (
    <div>
      {locations.map((location: Location, index: number) => (
        <AddressCard
          key={index}
          location={location}
          handleSelectAddress={() => handleSelectAddress(index)}
        />
      ))}
      <AddAddressCard handleAddBtn={handleAddAddressBtn} />
    </div>
  )
}

export default AddressesCardGroup
