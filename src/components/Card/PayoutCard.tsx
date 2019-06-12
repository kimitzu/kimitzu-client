import React from 'react'
import CryptoCurrencies from '../../constants/CryptoCurrencies.json'

import './PayoutCard.css'

interface Props {
  acceptedPayments: string[]
}

const PayoutCard = (props: Props) => (
  <div id="profile-payout">
    <div className="uk-card uk-card-default uk-card-body">
      <h3 id="title-social-media" className="uk-card-title">
        Payout Method
      </h3>
      {CryptoCurrencies.map((crypto, index) => {
        if (props.acceptedPayments.includes(crypto.value)) {
          return (
            <div id="social-media" key={index}>
              <div id="account-icon">
                <span uk-icon="icon: check" className="blueIcon" />
              </div>
              <div id="account-name">
                <p>{crypto.label}</p>
              </div>
            </div>
          )
        }
      })}
    </div>
  </div>
)

export default PayoutCard
