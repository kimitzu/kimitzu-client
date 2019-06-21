import React, { Component } from 'react'

import { AddressCard, ListingCheckoutCard } from '../components/Card'
import { FormLabel } from '../components/Label'

import Listing from '../models/Listing'
import './Checkout.css'

interface CheckoutProps {
  wip?: string
}

interface CheckoutState {
  wip?: string
}

class Checkout extends Component<CheckoutProps, CheckoutState> {
  constructor(props: CheckoutProps) {
    super(props)
  }

  public render() {
    return (
      <div id="checkout-container" className="uk-flex uk-flex-row uk-margin">
        <div id="checkout-order-summary" className="uk-flex uk-flex-column">
          <div className="uk-margin-bottom">
            <ListingCheckoutCard />
          </div>
          <div className="uk-margin-bottom">
            <AddressCard
              header="Shipping Address"
              location={{
                // type: ['return'],
                latitude: '105.1',
                longitude: '12.2',
                addressOne: 'Yellow House',
                addressTwo: 'San Isidro',
                city: 'Iloilo City',
                country: 'ph',
                plusCode: '14+E21',
                state: 'Iloilo',
                zipCode: '5000',
              }}
              handleSelectAddress={() => {
                // wip
              }}
            />
          </div>
          <div className="uk-margin-bottom">
            <div className="uk-card uk-card-default uk-card-body uk-card-small">
              <h3>Additional Information</h3>
              <div className="uk-margin">
                <FormLabel label="MEMO" />
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Provide additional details for the vendor (Optional)"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="uk-flex-1" />
      </div>
    )
  }
}

export default Checkout
