import React from 'react'

import { Location } from '../../common/types'
import { AddAddressCard, AddressCard } from '../Card'

interface Props {
  locations: Location[]
}

const AddressesCardGroup = (props: Props) => (
  <div>
    {props.locations.map((location: Location) => (
      <AddressCard key={location.plusCode} location={location} />
    ))}
    <AddAddressCard
      handleAddBtn={() => {
        console.log()
      }}
    />
  </div>
)

export default AddressesCardGroup
