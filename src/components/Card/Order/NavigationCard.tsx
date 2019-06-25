import React from 'react'

const NavigationCard = props => (
  <div className="uk-card uk-card-default uk-card-body">
    <ul className="uk-tab-right" uk-tab="media: @s">
      <li className="uk-active">
        <a href="">Summary</a>
      </li>
      <li>
        <a href="">Discussion</a>
      </li>
      <li className="uk-disabled">
        <a href="">Contract</a>
      </li>
    </ul>
  </div>
)

export default NavigationCard
