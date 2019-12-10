import React from 'react'
import CryptoCurrencies from '../../constants/CryptoCurrencies'

import './PayoutCard.css'

const cryptoCurrencies = CryptoCurrencies()

interface Props {
  acceptedPayments: string[]
}

const PayoutCard = (props: Props) => (
  <div id="profile-payout" className="uk-margin-bottom">
    <div className="uk-card uk-card-default uk-card-body">
      <h3 id="title-social-media" className="uk-card-title">
        Payout Method
      </h3>
      {cryptoCurrencies.map((crypto, index) => {
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
        } else {
          return null
        }
      })}
    </div>
  </div>
)

export default PayoutCard
